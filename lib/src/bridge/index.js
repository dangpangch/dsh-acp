import Schema from "@deepseek-ai/schemastery";
import { randomUUID } from "node:crypto";
import { basename, dirname, isAbsolute, join, resolve, sep } from "node:path";
import { Readable, Writable } from "node:stream";
import { AgentSideConnection, PROTOCOL_VERSION, RequestError, ndJsonStream } from "@agentclientprotocol/sdk";
import { installModelSelection } from "@deepseek-ai/dsh-agent";
import { ReasoningEffortId, createUserMessage, errorChain } from "@deepseek-ai/dsh-llm";
import { SessionId } from "@deepseek-ai/dsh-session";
import { resolveDshHome } from "@deepseek-ai/dsh-home-paths";
import { readFileSync, rmSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { isImageAdmissionError } from "@deepseek-ai/dsh-attachment";
//#region src/bridge/content.ts
/** Raster formats shared by ACP image blocks and dsh's attachment store. */
const IMAGE_MEDIA_TYPES = [
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif"
];
function isImageMediaType(mimeType) {
	return IMAGE_MEDIA_TYPES.includes(mimeType);
}
/**
* Canonical RFC 4648 base64: whitespace and URL-safe aliases rejected before
* the durable admission call, so wire bytes never reach the store uncleaned.
*/
const CANONICAL_BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
/** Error with a stable request-failure category (wire error mapping). */
var AcpContentError = class extends Error {
	/** 'invalid' -> invalidParams on the wire; 'internal' -> internalError. */
	kind;
	constructor(message, kind, options) {
		super(message, options);
		this.name = "AcpContentError";
		this.kind = kind;
	}
};
function decodeImage(block) {
	if (!isImageMediaType(block.mimeType)) throw new AcpContentError("image mimeType must be image/png, image/jpeg, image/webp, or image/gif", "invalid");
	const mediaType = block.mimeType;
	if (!CANONICAL_BASE64.test(block.data)) throw new AcpContentError("image data must be canonical base64", "invalid");
	return {
		mediaType,
		data: Buffer.from(block.data, "base64")
	};
}
/** Render one baseline resource link into the core's current text vocabulary. */
function resourceLinkText(block) {
	return `\n[resource_link name=${JSON.stringify(block.name)} uri=${JSON.stringify(block.uri)}]\n`;
}
/**
* Graceful degradation of one embedded resource into plain prompt text (the
* pi-acp approach): a text resource contributes its body inline; a blob or an
* unknown payload contributes only a marker, so a client that ignored the
* `embeddedContext: false` advertisement still gets its context through
* instead of the whole prompt failing.
*/
function resourceText(block) {
	const resource = block.resource;
	const uri = typeof resource.uri === "string" ? resource.uri : "(unknown)";
	if (typeof resource.text === "string") return `\n[embedded context ${uri} (${typeof resource.mimeType === "string" ? resource.mimeType : "text/plain"})]\n${resource.text}\n`;
	if (typeof resource.blob === "string") return `\n[embedded context ${uri} (${typeof resource.mimeType === "string" ? resource.mimeType : "application/octet-stream"}, ${Buffer.byteLength(resource.blob, "base64")} bytes, not decoded)]\n`;
	return `\n[embedded context ${uri}]\n`;
}
/**
* Validate one ACP prompt in wire order and return its decoded images in
* wire order. text/resource_link pass through; embedded resources degrade to
* plain text (see resourceText) even though the capability is not advertised,
* so a client that sends one anyway does not lose its prompt; audio stays the
* only hard rejection. Every block is validated before any image write
* starts, so a rejected batch persists nothing.
*/
function scanPrompt(prompt, imageEnabled) {
	const images = [];
	for (const block of prompt) switch (block.type) {
		case "text":
		case "resource_link":
		case "resource": break;
		case "image":
			if (!imageEnabled) throw new AcpContentError("inline image prompts were not advertised by this connection", "invalid");
			images.push(decodeImage(block));
			break;
		case "audio": throw new AcpContentError("audio prompt content is not supported", "invalid");
		default: throw new AcpContentError("unsupported ACP prompt content", "invalid");
	}
	return images;
}
/**
* Persist one decoded image batch through the shared attachment store.
* Admission rejects map to invalid params, storage faults stay internal, and
* cancellation never queues a late message.
*/
async function persistImages(attachments, images, signal) {
	signal.throwIfAborted();
	const inputs = images.map((image) => ({
		mediaType: image.mediaType,
		data: image.data
	}));
	try {
		const refs = await attachments.saveImages(inputs);
		signal.throwIfAborted();
		return refs;
	} catch (error) {
		if (isImageAdmissionError(error)) throw new AcpContentError(error.message, "invalid", { cause: error });
		throw new AcpContentError("unable to persist the prompt image batch", "internal", { cause: error });
	}
}
/**
* Rebuild the ordered content for one user message: text and resource links
* stay text (concatenated in order); each image becomes an ImageBlock backed
* by its durable reference (the harness's request projection resolves images
* for the exact model route). Empty prompts are rejected here.
*/
function contentForPrompt(prompt, imageRefs) {
	const content = [];
	let pendingText = "";
	const flushText = () => {
		if (pendingText.length === 0) return;
		content.push({
			type: "text",
			text: pendingText
		});
		pendingText = "";
	};
	let imageIndex = 0;
	for (const block of prompt) switch (block.type) {
		case "text":
			pendingText += block.text;
			break;
		case "resource_link":
			pendingText += resourceLinkText(block);
			break;
		case "resource":
			pendingText += resourceText(block);
			break;
		case "image":
			flushText();
			content.push({
				type: "image",
				attachment: imageRefs[imageIndex++]
			});
	}
	flushText();
	if (!content.some((block) => block.type === "image" || block.type === "text" && block.text.trim().length > 0)) throw new AcpContentError("empty prompt", "invalid");
	return content;
}
//#endregion
//#region src/bridge/codec.ts
/**
* Prompt-level settlement decision for a correlated turn ending: the ACP
* stopReason, or null when the caller should reject instead — `error` endings
* reject the inflight request with an internal error (v1 has no `error` stop
* reason).
*/
function settledStopReason(kind) {
	switch (kind) {
		case "completed":
		case "aborted":
		case "blocked":
		case "max-tokens": return "end_turn";
		case "interrupted": return "cancelled";
		case "error": return null;
	}
}
//#endregion
//#region src/bridge/session-store.ts
/** Deregister `record` only when it is still the registered instance. */
function removeRecord(store, record) {
	if (store.get(record.id) === record) store.delete(record.id);
}
/** Allocate a fresh single-flight prompt slot (factory keeps transitions honest). */
function createInflight() {
	const admission = Promise.withResolvers();
	const completion = Promise.withResolvers();
	return {
		promise: completion.promise,
		resolve: (stopReason) => completion.resolve(stopReason),
		reject: (error) => completion.reject(error),
		messageId: void 0,
		messageQueued: false,
		turn: void 0,
		endKind: void 0,
		endMessage: void 0,
		cancelRequested: false,
		settlementStarted: false,
		admissionDone: admission.promise,
		finishAdmission: () => admission.resolve(),
		admissionController: new AbortController(),
		outputError: void 0,
		agentError: void 0,
		commandExecuted: void 0
	};
}
/** Build a live session record from a resolved agent factory handle. */
function makeRecord(id, cwd, handle, selection) {
	return {
		id,
		cwd,
		agent: handle.agent,
		dispose: () => handle.dispose(),
		outputTail: Promise.resolve(),
		selection,
		inflight: void 0,
		closed: false,
		supportedEfforts: void 0,
		permission: void 0,
		sentPlanFold: void 0,
		everSentPlan: false,
		replaying: false,
		streamedText: /* @__PURE__ */ new Map(),
		streamedReasoning: /* @__PURE__ */ new Map()
	};
}
/** Await the record's quiescence: admission, agent idle, and output drain. */
async function drainRecord(record) {
	await record.inflight?.admissionDone;
	await record.agent.whenIdle();
	await record.outputTail;
}
/** Cancel everything a record owns and request the agent stop. */
function requestStop(record, cause) {
	const inflight = record.inflight;
	if (inflight !== void 0) {
		inflight.cancelRequested = true;
		inflight.admissionController.abort(/* @__PURE__ */ new Error(`ACP ${cause.kind} stop`));
	}
	record.agent.cancel(cause);
}
//#endregion
//#region src/bridge/updates.ts
/** One committed assistant text block as an `agent_message_chunk`. */
function assistantTextChunk(text) {
	return {
		sessionUpdate: "agent_message_chunk",
		content: {
			type: "text",
			text
		}
	};
}
/**
* One committed user text block as a `user_message_chunk`. `messageId` groups
* a replayed message's blocks client-side (Zed merges adjacent user chunks
* that share it), so every block of one stored message passes the same id.
*/
function userMessageChunk(text, messageId) {
	return {
		sessionUpdate: "user_message_chunk",
		content: {
			type: "text",
			text
		},
		messageId
	};
}
/** Reasoning text as an `agent_thought_chunk`. */
function assistantThoughtChunk(text) {
	return {
		sessionUpdate: "agent_thought_chunk",
		content: {
			type: "text",
			text
		}
	};
}
/** Whole-list `plan` replacement (ACP replaces the entire plan per update). */
function planUpdate(entries) {
	return {
		sessionUpdate: "plan",
		entries: entries.map((entry) => ({
			content: entry.content,
			priority: "medium",
			status: entry.status
		}))
	};
}
/** Context-window `usage_update` (used/size; unknown sides never emit). */
function usageUpdate(used, size) {
	return {
		sessionUpdate: "usage_update",
		used,
		size
	};
}
/** Slash/command catalog announcement. */
function commandsUpdate(commands) {
	return {
		sessionUpdate: "available_commands_update",
		availableCommands: commands.map((command) => ({
			name: command.name,
			description: command.description ?? "",
			input: command.input === void 0 || command.input === null ? void 0 : { hint: command.input }
		}))
	};
}
/**
* Fold one streamed delta onto the per-(turn,step,index) accumulation and
* return the wire chunk to send. Deltas of one block concatenate; every
* already-accumulated prefix was delivered, so the fresh text goes out whole.
* An empty delta sends nothing.
*/
function streamTextDelta(acc, key, text, chunk) {
	if (text.length === 0) return void 0;
	acc.set(key, (acc.get(key) ?? "") + text);
	return chunk(text);
}
/**
* Decide what still needs delivering when a committed block lands: blocks that
* never streamed go whole; streamed blocks only resend the missing tail; a
* mismatch (stream and commit diverged) sends nothing rather than duplicating.
*/
function committedBlockRemainder(acc, key, fullText) {
	const streamed = acc.get(key);
	if (streamed === void 0) return fullText.length > 0 ? fullText : void 0;
	if (fullText.startsWith(streamed)) {
		const tail = fullText.slice(streamed.length);
		return tail.length > 0 ? tail : void 0;
	}
}
/**
* Terminal tool-call card content: one content block, truncated so a huge raw
* result cannot flood the client frame.
*/
function toolCallContent(text) {
	const maxChars = 8e3;
	const trimmed = text.length > maxChars ? `${text.slice(0, maxChars)}\n… [truncated]` : text;
	if (trimmed.length === 0) return void 0;
	return [{
		type: "content",
		content: {
			type: "text",
			text: trimmed
		}
	}];
}
/**
* Wrap text in one markdown code fence, so the client renders it as a
* monospace block (Zed renders rawInput strings as markdown verbatim). The
* fence grows past any backtick run inside the text, so fence-collision
* cannot break the block. Trailing newlines are dropped (the closing fence
* replaces them); an empty input stays an honest empty block.
*/
function codeFence(text, info = "") {
	const body = text.replace(/\n+$/, "");
	const fence = "`".repeat(Math.max(3, ...(body.match(/`+/g) ?? []).map((run) => run.length + 1)));
	return `${fence}${info}\n${body}\n${fence}`;
}
/**
* Structured diff card content (ACP `ToolCallContent {type: 'diff'}`): the
* client renders a real diff view instead of raw tool text. The model-facing
* confirmation text still rides alongside, so clients without diff support
* degrade to the plain text card. Paths are absolutized against the session
* cwd (the diff vocabulary uses the model-facing, possibly relative path).
*/
function toolCallDiffContent(diffs, cwd) {
	return diffs.map((diff) => ({
		type: "diff",
		path: isAbsolute(diff.path) ? diff.path : resolve(cwd, diff.path),
		...diff.oldText !== null ? { oldText: diff.oldText } : {},
		newText: diff.newText
	}));
}
/**
* Fold a session log's todo history into ONE final plan update:
* `todo/write` replaces the whole table (last write wins) and `turn/start`
* clears it. Returns undefined when nothing ever rendered a plan — callers
* then send nothing (replay never fabricates frames).
*/
function foldTodoPlan(events) {
	let current;
	for (const event of events) if (event.type === "todo/write") current = event.data.todos;
	else if (event.type === "turn/start") current = [];
	if (current === void 0 || current.length === 0) return void 0;
	return current;
}
//#endregion
//#region src/bridge/tool-cards.ts
/** First tool-result call id + concatenated visible text of one result message. */
function toolResultCall(message) {
	let callId = "";
	let text = "";
	const collect = (blocks) => {
		for (const block of blocks) {
			const typed = block;
			if (typed.type === "text") text += typed.text ?? "";
			else if (typed.type === "tool-result") {
				if (callId === "") callId = typed.toolCallId ?? "";
				if (Array.isArray(typed.content)) collect(typed.content);
			}
		}
	};
	collect(message.content);
	return {
		callId,
		text
	};
}
/** Coarse ACP tool-kind classification for the generic card icon. */
function toolKindFor(name) {
	if (name === "write" || name === "edit" || name === "str_replace" || name === "str_replace_editor") return "edit";
	if (name === "read_image" || name === "read") return "read";
	if (name.startsWith("search") || name === "grep" || name === "glob" || name === "fs_search") return "search";
	if (name.includes("delete") || name === "rm") return "delete";
	return "other";
}
/**
* Command-runner tools: their result text is captured process output (not a
* tool-authored confirmation), so the expanded card fences it as a code block.
*/
function isCommandTool(name) {
	return name === "bash" || name === "pwsh";
}
/**
* The card body of one tool result. A `read` result carries a
* `<path>/<type>/<content>` envelope whose header lines are card noise (the
* path already shows in the title and the follow-along location) — keep only
* the `<content>` body. Any other shape passes through unchanged.
*/
function resultCardText(name, text) {
	if (name !== "read") return text;
	const match = /<content>\n?([\s\S]*?)\n?<\/content>/.exec(text);
	return match === null ? text : match[1];
}
/**
* The fenced card body of one tool result: extract the display text
* (`resultCardText`) and wrap it in a code fence. Empty results stay empty —
* an invisible tool result must not turn into an empty code block.
*/
function resultBody(name, text) {
	const extracted = resultCardText(name, text);
	return extracted.length === 0 ? extracted : codeFence(extracted);
}
/**
* The rawInput a card displays. Zed renders a string rawInput as markdown
* verbatim (object rawInput becomes a JSON block), so every tool with a
* nameable argument gets a monospace pseudo-command line:
* `<workdir> $ <command>` for command runners (execute-card look), and
* `<tool> <path|pattern> [key=value …]` for every other tool that names
* something (mirroring the title fragment, plus the small numeric window
* arguments the title drops). Tools whose arguments name nothing (todo_write,
* ask_user_question…) pass their parsed arguments through verbatim.
*/
function displayRawInput(name, rawInput, cwd) {
	const command = (typeof rawInput === "string" ? rawInput : commandOf(rawInput))?.trim();
	if (isCommandTool(name) && command !== void 0 && command.length > 0) return codeFence(`${cwd} $ ${command}`, "sh");
	if (typeof rawInput !== "object" || rawInput === null) return rawInput;
	const record = rawInput;
	const fragment = titleArgumentOf(toolKindFor(name), record, cwd);
	if (fragment === void 0) return rawInput;
	return codeFence([
		name,
		fragment,
		...[
			"offset",
			"limit",
			"view_range",
			"insert_line"
		].filter((key) => record[key] !== void 0).map((key) => `${key}=${JSON.stringify(record[key])}`)
	].join(" "));
}
/** Raw tool-argument JSON as displayed input (unparsable stays verbatim). */
function rawInputOf(argumentsJson) {
	try {
		return JSON.parse(argumentsJson);
	} catch {
		return argumentsJson;
	}
}
/** The model-facing path argument shared by every harness filesystem tool. */
function toolPathOf(rawInput) {
	if (typeof rawInput !== "object" || rawInput === null) return void 0;
	const record = rawInput;
	for (const key of ["file_path", "path"]) {
		const value = record[key];
		if (typeof value === "string" && value.length > 0) return value;
	}
}
/**
* 1-based line of the first occurrence of `needle` in `text`, or undefined
* when absent or ambiguous (pi-acp's rule: a repeated match carries no focus).
*/
function uniqueLineOfText(text, needle) {
	if (needle.length === 0) return void 0;
	const first = text.indexOf(needle);
	if (first < 0 || text.indexOf(needle, first + needle.length) >= 0) return void 0;
	let line = 1;
	for (let index = 0; index < first; index += 1) if (text.charCodeAt(index) === 10) line += 1;
	return line;
}
/** First 1-based line of a str_replace_editor `view_range` window ([11,12]→11). */
function viewRangeLine(viewRange) {
	if (!Array.isArray(viewRange)) return void 0;
	const start = viewRange[0];
	return typeof start === "number" && Number.isInteger(start) && start >= 1 ? start : void 0;
}
/**
* The follow-along location for one tool call, resolved against the session
* cwd. `readText` (the file's current content) lets an `edit`-shaped input
* report the exact line its `old_string` matches; other tools derive their
* line purely from arguments. Returns undefined when the arguments name no
* file (a bash/grep/todo card follows nothing).
*/
function toolCallLocation(rawInput, cwd, readText) {
	const path = toolPathOf(rawInput);
	if (path === void 0) return void 0;
	const absolute = isAbsolute(path) ? path : resolve(cwd, path);
	if (typeof rawInput !== "object" || rawInput === null) return { path: absolute };
	const record = rawInput;
	const offset = record["offset"];
	if (typeof offset === "number" && Number.isInteger(offset) && offset >= 1) return {
		path: absolute,
		line: offset
	};
	const viewLine = viewRangeLine(record["view_range"]);
	if (viewLine !== void 0) return {
		path: absolute,
		line: viewLine
	};
	if (typeof record["command"] === "string" && record["command"] === "insert") {
		const insertLine = record["insert_line"];
		if (typeof insertLine === "number" && Number.isInteger(insertLine) && insertLine >= 0) return {
			path: absolute,
			line: insertLine + 1
		};
	}
	const oldString = record["old_string"] ?? record["old_str"];
	if (typeof oldString === "string" && readText !== void 0) {
		const current = readText(absolute);
		if (current !== void 0) {
			const line = uniqueLineOfText(current, oldString);
			if (line !== void 0) return {
				path: absolute,
				line
			};
		}
	}
	return { path: absolute };
}
/** Structural guard for one opaque meta diff entry (malformed entries drop). */
function isFileDiffLike(value) {
	if (typeof value !== "object" || value === null) return false;
	const record = value;
	return typeof record["path"] === "string" && (record["oldText"] === null || typeof record["oldText"] === "string") && typeof record["newText"] === "string";
}
/** Narrow opaque `tool/result` meta to validated file diffs ([] is valid). */
function fileDiffsFromMeta(meta) {
	if (typeof meta !== "object" || meta === null || Array.isArray(meta)) return void 0;
	const diffs = meta["diffs"];
	if (!Array.isArray(diffs) || !diffs.every(isFileDiffLike)) return void 0;
	return diffs;
}
/**
* The structured diff for one mutating call, in source-preference order:
* the harness-computed result hunks (`meta.diffs`) when present, else the
* arguments' own before/after for the argument-described edits (str_replace_editor,
* and a `write` whose result carried no hunks — the fresh-create shape).
* Errors and non-mutating calls produce no diff card.
*
* A pathological identical-content overwrite (hunks `[]`, like a create)
* falls back to the whole-file argument diff too; its content is identical
* either way, so the rendered view stays truthful.
*/
function diffForToolCall(name, rawInput, meta, isError) {
	if (isError) return void 0;
	const fromMeta = fileDiffsFromMeta(meta);
	if (fromMeta !== void 0 && fromMeta.length > 0) return fromMeta;
	if (typeof rawInput !== "object" || rawInput === null) return void 0;
	const record = rawInput;
	const path = toolPathOf(rawInput);
	if (path === void 0) return void 0;
	const fileText = record["content"] ?? record["file_text"];
	if ((name === "write" || name === "str_replace_editor") && typeof fileText === "string") return [{
		path,
		oldText: null,
		newText: fileText
	}];
	const oldText = record["old_string"] ?? record["old_str"];
	const newText = record["new_string"] ?? record["new_str"];
	if (typeof oldText === "string" && typeof newText === "string") return [{
		path,
		oldText,
		newText
	}];
}
/** The model-written command line of a bash/pwsh call, or undefined. */
function commandOf(rawInput) {
	if (typeof rawInput !== "object" || rawInput === null) return void 0;
	const command = rawInput.command;
	return typeof command === "string" ? command : void 0;
}
/** First non-blank string argument among the keys, or undefined. */
function firstStringArg(rawInput, keys) {
	for (const key of keys) {
		const value = rawInput[key];
		if (typeof value === "string" && value.trim().length > 0) return value;
	}
}
/**
* Display form of a model-facing path: cwd-relative when the model passed an
* absolute path under the session cwd, verbatim otherwise (a relative
* argument already IS the short form, and tools run against that cwd).
*/
function displayPathOf(path, cwd) {
	if (cwd === void 0 || !isAbsolute(path)) return path;
	const prefix = cwd.endsWith(sep) ? cwd : cwd + sep;
	return path.startsWith(prefix) ? path.slice(prefix.length) : path;
}
/**
* The concise argument fragment a title shows after the tool name: the
* model-facing path for every path-shaped tool (str_replace_editor also
* carries a `command` field, so path wins there), the model-written
* description for command-only tools (bash/pwsh — a human summary reads
* better than a raw command line; the full command stays in rawInput),
* falling back to the command line itself, the pattern (plus optional scope)
* for search tools, or undefined when the arguments name neither (the title
* then falls back to the bare tool name).
*/
function titleArgumentOf(kind, rawInput, cwd) {
	if (kind === "search") {
		const pattern = firstStringArg(rawInput, [
			"pattern",
			"query",
			"regex"
		]);
		if (pattern !== void 0) {
			const scope = firstStringArg(rawInput, ["path"]);
			return scope !== void 0 ? `${pattern} in ${scope}` : pattern;
		}
	}
	const path = toolPathOf(rawInput);
	if (path !== void 0) return displayPathOf(path, cwd);
	const description = firstStringArg(rawInput, ["description"]);
	if (description !== void 0) return description;
	const command = commandOf(rawInput)?.trim();
	if (command !== void 0 && command.length > 0) return command;
}
/** Human card title for one tool call (see module header for the rationale). */
function toolCallTitle(kind, name, rawInput, cwd) {
	const argument = typeof rawInput === "object" && rawInput !== null ? titleArgumentOf(kind, rawInput, cwd) : void 0;
	if (argument === void 0) return name;
	const title = `${name} ${argument}`;
	return title.length <= 400 ? title : `${title.slice(0, 400)}…`;
}
//#endregion
//#region src/bridge/replay.ts
/**
* Map one stored session event to the wire updates a `session/load` replay
* should send. Assistant committed content streams whole (replay never
* re-streams raw deltas); image blocks degrade to a bracketed placeholder.
* User messages replay only when the durable log marks them `source: 'user'`
* — synthetic user-role events (agent.inject() contexts, goal continuation
* rounds, compaction checkpoints) carry no client-facing prompt and stay out.
* `calls` pairs a `tool/result` with its call (the result event carries only
* the call id) and `cwd` absolutizes locations and diff paths — callers walk
* the log in order, adding each `tool/call` before its result reads it.
* Returns an empty array for events with no client-visible face.
*/
function replayUpdatesForEvent(event, context) {
	switch (event.type) {
		case "user/message": {
			const message = event.data;
			if (message.source?.kind !== "user") return [];
			const updates = [];
			const blocks = message.content ?? [];
			for (const block of blocks) if (block.type === "text" && block.text !== void 0 && block.text.length > 0) updates.push(userMessageChunk(block.text, String(event.seq)));
			else if (block.type === "image") {
				const name = block.image?.name;
				const mediaType = block.image?.mediaType ?? "image";
				updates.push(userMessageChunk(`[image: ${name ?? mediaType}]`, String(event.seq)));
			}
			return updates;
		}
		case "assistant/message": {
			const updates = [];
			const content = event.data.message.content;
			for (const block of content ?? []) if (block.type === "text" && block.text !== void 0 && block.text.length > 0) updates.push(assistantTextChunk(block.text));
			else if (block.type === "reasoning" && block.text !== void 0 && block.text.length > 0) updates.push(assistantThoughtChunk(block.text));
			else if (block.type === "image") {
				const name = block.image?.name;
				const mediaType = block.image?.mediaType ?? "image";
				updates.push(assistantTextChunk(`[image: ${name ?? mediaType}]`));
			}
			return updates;
		}
		case "tool/call": {
			const rawInput = rawInputOf(event.data.arguments);
			const kind = toolKindFor(event.data.name);
			const location = toolCallLocation(rawInput, context.cwd);
			return [{
				sessionUpdate: "tool_call",
				toolCallId: String(event.data.callId),
				title: toolCallTitle(kind, event.data.name, rawInput, context.cwd),
				name: event.data.name,
				kind,
				status: "pending",
				rawInput: displayRawInput(event.data.name, rawInput, context.cwd),
				...location !== void 0 ? { locations: [location] } : {}
			}];
		}
		case "tool/result": {
			const { callId, text } = toolResultCall(event.data.message);
			if (callId === "") return [];
			const isError = event.data.error !== void 0;
			const call = context.calls.get(callId);
			const diffs = diffForToolCall(call?.name ?? "", call?.rawInput, event.data.meta, isError);
			const textContent = toolCallContent(resultBody(call?.name ?? "", text));
			const content = diffs === void 0 ? textContent : [...toolCallDiffContent(diffs, context.cwd), ...textContent ?? []];
			return [{
				sessionUpdate: "tool_call_update",
				toolCallId: callId,
				status: isError ? "failed" : "completed",
				...content !== void 0 ? { content } : {}
			}];
		}
		default: return [];
	}
}
//#endregion
//#region src/bridge/catalog.ts
/** Slash-name prefix under which user-invocable skills are announced. */
const SKILL_SLASH_PREFIX = "skill:";
/**
* Normalize one text block's skill tokens back to bare gestures. Zed sends the
* picked completion verbatim (`/skill:find-skills`), but dsh's `tool-skill`
* pre-step hook recognizes only the bare `/name` shape (its gesture regex does
* not accept a colon), so each `skill:<name>` token is rewritten to `/name`
* before the prompt reaches the model. Only word-bounded `/skill:<kebab>`
* tokens are touched; anything else passes through untouched.
*/
function normalizeSkillSlashText(text) {
	return text.replace(/(^|\s)\/skill:([a-z0-9]+(?:-[a-z0-9]+)*)(?=\s|$)/g, "$1/$2");
}
/**
* Merge command-plane entries with user-invocable skills into one slash
* catalog. Skills are announced as `skill:<name>` entries (mirroring pi-acp so
* the popup reads `/skill:find-skills`); non-user-invocable skills stay out
* (picking one would silently no-op). The result is partitioned: every command
* first in registry order, then every skill in registry order, so the flat Zed
* popup separates the two kinds visually. Commands keep plain names, so a
* command and a skill can never collide on the wire.
*/
function mergeSlashCatalog(commands, skills) {
	const entries = [];
	const commandNames = /* @__PURE__ */ new Set();
	for (const command of commands) {
		if (commandNames.has(command.name)) continue;
		commandNames.add(command.name);
		entries.push({
			name: command.name,
			description: command.description,
			...command.inputHint !== void 0 && command.inputHint !== null && command.inputHint.length > 0 ? { input: command.inputHint } : {}
		});
	}
	const skillNames = /* @__PURE__ */ new Set();
	for (const skill of skills) {
		if (!skill.userInvocable) continue;
		if (skillNames.has(skill.name)) continue;
		skillNames.add(skill.name);
		entries.push({
			name: SKILL_SLASH_PREFIX + skill.name,
			description: skill.description
		});
	}
	return entries;
}
//#endregion
//#region src/bridge/config-options.ts
/** Display-only thinking-level id meaning "let the provider decide". */
const PROVIDER_DEFAULT_REASONING_EFFORT = "provider-default";
/**
* Canonical thinking levels, in display order, shown when the selected model
* exposes no reasoning metadata of its own so the thinking picker never
* disappears (values mirror the harness effort vocabulary).
*/
const CANONICAL_REASONING_LEVELS = [
	{
		id: "off",
		name: "Off",
		description: null
	},
	{
		id: "minimal",
		name: "Minimal",
		description: null
	},
	{
		id: "low",
		name: "Low",
		description: null
	},
	{
		id: "medium",
		name: "Medium",
		description: null
	},
	{
		id: "high",
		name: "High",
		description: null
	},
	{
		id: "xhigh",
		name: "Xhigh",
		description: null
	},
	{
		id: "max",
		name: "Max",
		description: null
	}
];
/**
* The thinking levels to offer for one model: the model's own declared
* efforts when present, else the canonical fallback table. When the model
* names no default effort the display-only `provider-default` entry is
* prepended so the picker never has to default to the first declared level
* (`off` for the canonical list) — which would misrepresent "provider
* default" as "thinking off". The default NEVER falls back to `off`.
*/
function effortOptionsFor(reasoning) {
	const declared = reasoning?.efforts;
	if (declared !== void 0 && declared.length > 0) return declared;
	return CANONICAL_REASONING_LEVELS;
}
/**
* The picker's current effort id: an explicit session pick wins, else the
* model's declared default effort, else the display-only `provider-default`
* entry. Never falls back to `off` (design §6.3).
*/
function currentEffortFor(current, defaultEffort) {
	return current ?? defaultEffort ?? "provider-default";
}
/** Options for a thought_level select (display-only provider-default first). */
function thoughtLevelOptionOptions(reasoning) {
	const efforts = effortOptionsFor(reasoning);
	if (reasoning?.defaultEffort !== void 0) return efforts;
	return [{
		id: PROVIDER_DEFAULT_REASONING_EFFORT,
		name: "Provider default",
		description: null
	}, ...efforts];
}
/**
* Strip a reasoning effort the current model cannot honor from every agent
* request. `provider-default` never matches a real effort (display-only), and
* a pick from the canonical fallback can name a level the model does not
* declare — the harness rejects such efforts on every request
* (UNSUPPORTED_REASONING_EFFORT), so the guard keeps the picker from breaking
* a session. Unknown supported-set (no model metadata yet) keeps the request.
*/
function guardReasoningEffort(request, supported) {
	if (request.reasoningEffort === void 0 || supported === void 0 || supported.has(request.reasoningEffort)) return request;
	const { reasoningEffort: _stripped, ...rest } = request;
	return rest;
}
/** Human-readable label for a permission preset key. */
const PERMISSION_LABELS = {
	"read-only": "Read only",
	"workspace-write": "Workspace write",
	"danger-full-access": "Full access"
};
function permissionLabel(name) {
	return PERMISSION_LABELS[name] ?? name;
}
/** Write-permission select options from the preset (or sandbox) names. */
function permissionSelectOptions(names) {
	return names.map((name) => ({
		value: name,
		name: permissionLabel(name),
		description: null
	}));
}
/**
* Model select options from a fetched provider/model catalog (provider/model
* pairs flattened into `provider/model` ids so a pick can switch providers
* too). Returns null when no discoverable models exist.
*/
function modelSelectOptionList(catalog, current) {
	const options = [];
	for (const provider of catalog) for (const model of provider.models) options.push({
		value: `${provider.id}/${model.id}`,
		name: `${provider.name ?? provider.id} / ${model.name ?? model.id}`,
		description: model.description ?? null
	});
	if (options.length === 0) return null;
	const composed = current.provider !== void 0 && current.model !== void 0 ? `${current.provider}/${current.model}` : void 0;
	return {
		options,
		currentValue: composed !== void 0 && options.some((option) => option.value === composed) ? composed : options[0].value
	};
}
//#endregion
//#region src/bridge/index.ts
/** Stable cordis plugin name (design.zh.md §5). */
const name = "dsh-acp-interactive";
/** Agent spine services this bridge programs (validated on the rc.2 baseline). */
const inject = [
	"agents",
	"sessions",
	"sessionQuery",
	"sessionPersistence"
];
const Config = Schema.object({
	provider: Schema.string(),
	model: Schema.string()
});
const AGENT_NAME = "dsh-acp-interactive";
const AGENT_VERSION = "0.1.0";
const CONFIG_ID_MODEL = "model";
const CONFIG_ID_THOUGHT_LEVEL = "thought_level";
const CONFIG_ID_PERMISSION = "permission";
const AUTH_ENV_KEY = "DEEPSEEK_API_KEY";
/** Canonical write-permission preset ids (mirrors the dsh-base permission row). */
const PERMISSION_PRESETS = [
	"read-only",
	"workspace-write",
	"danger-full-access"
];
/** Preserve invalid-parameter detail in the SDK wire error message. */
function invalidParams(detail) {
	return RequestError.invalidParams(void 0, detail);
}
/** Preserve failed-turn detail; plain handler errors become a generic wire internal error. */
function internalError(detail) {
	return RequestError.internalError(void 0, detail);
}
/** The slash-command line when the prompt starts with '/', else undefined. */
function slashLine(prompt) {
	let text = "";
	for (const block of prompt) if (block.type === "text") text += block.text;
	const line = text.trimEnd();
	return line.startsWith("/") ? line : void 0;
}
/** Original wire image blocks as encoded attachments for the command plane. */
function encodedImages(prompt) {
	const images = [];
	for (const block of prompt) if (block.type === "image") images.push({
		mediaType: block.mimeType,
		data: block.data
	});
	return images;
}
/**
* Apply the bridge. On a serving invocation the app already published
* readiness (stdin is ours); open the AgentSideConnection over stdin/stdout
* and route session/* to per-session agent records.
*/
function apply(ctx, config = {}) {
	const agents = ctx.agents;
	const logger = ctx.logger;
	const sessions = ctx.sessions;
	const llm = ctx.get("llm");
	const attachments = ctx.get("attachments");
	const commands = ctx.get("commands");
	const skills = ctx.get("skills");
	const projections = ctx.get("sessionProjections");
	const presets = ctx.get("agentPresets");
	const query = ctx.get("sessionQuery");
	const persistence = ctx.get("sessionPersistence");
	const permissionPresets = ctx.get("permissionPresets");
	const userQuestions = ctx.get("userQuestions") !== void 0;
	const store = /* @__PURE__ */ new Map();
	let closed = false;
	let imagePromptEnabled = false;
	let clientCapabilities;
	const activeRequests = /* @__PURE__ */ new Set();
	const askCall = /* @__PURE__ */ new Map();
	const liveCalls = /* @__PURE__ */ new Map();
	const elicitationFormsEnabled = () => {
		return clientCapabilities?.elicitation?.form !== void 0;
	};
	const assertOpen = () => {
		if (closed) throw internalError("the ACP bridge has been disposed");
	};
	const requireSession = (sessionId) => {
		const record = store.get(sessionId);
		if (record === void 0) throw invalidParams(`unknown session: ${sessionId}`);
		return record;
	};
	let conn;
	const notify = async (notification) => {
		if (conn === void 0) return;
		try {
			await conn.sessionUpdate(notification);
		} catch (error) {
			logger.warn(`dsh-acp-interactive: session/update failed: ${String(error)}`);
		}
	};
	/** Chain one wire update onto the record's ordered delivery tail. */
	const deliver = (record, update) => {
		record.outputTail = record.outputTail.then(async () => {
			if (record.closed) return;
			await notify({
				sessionId: record.id,
				update
			});
		}).catch((error) => {
			const inflight = record.inflight;
			if (inflight !== void 0) inflight.outputError ??= new Error(String(error));
			logger.warn(`dsh-acp-interactive: output delivery failed: ${errorChain(error)}`);
		});
	};
	/** Settle one prompt after admission, agent quiescence, and output drain. */
	const settleAfterQuiescence = (record, inflight) => {
		if (inflight.settlementStarted) return;
		inflight.settlementStarted = true;
		(async () => {
			await drainRecord(record);
			if (record.inflight !== inflight) return;
			record.inflight = void 0;
			if (inflight.cancelRequested) {
				inflight.resolve("cancelled");
				return;
			}
			if (inflight.outputError !== void 0) {
				inflight.reject(internalError(`assistant output delivery failed: ${inflight.outputError.message}`));
				return;
			}
			if (inflight.agentError !== void 0) {
				inflight.reject(internalError(`turn failed: ${inflight.agentError.message}`));
				return;
			}
			const kind = inflight.endKind;
			if (kind === void 0) {
				inflight.resolve(inflight.commandExecuted === true ? "end_turn" : "cancelled");
				return;
			}
			const stop = settledStopReason(kind);
			if (stop === null) {
				inflight.reject(internalError(`turn failed: ${inflight.endMessage ?? "unknown"}`));
				return;
			}
			inflight.resolve(stop);
		})().catch((error) => {
			if (record.inflight !== inflight) return;
			record.inflight = void 0;
			inflight.reject(internalError(`prompt settlement failed: ${errorChain(error)}`));
		});
	};
	/** Chain one synchronous serialization task onto the delivery tail. */
	const serialize = (record, task) => {
		record.outputTail = record.outputTail.then(task).catch((error) => {
			const inflight = record.inflight;
			if (inflight !== void 0) inflight.outputError ??= new Error(String(error));
			logger.warn(`dsh-acp-interactive: output conversion failed: ${errorChain(error)}`);
		});
	};
	/** Push a usage_update ring whenever both sides of the window are known. */
	const pushUsage = (record) => {
		if (projections === void 0) return;
		const pressure = projections.snapshot(record.agent.session).values.contextPressure;
		if (pressure === void 0) return;
		const used = pressure.projectedTokens ?? pressure.pressureTokens;
		const size = pressure.contextWindow;
		if (used === void 0 || size === void 0) return;
		deliver(record, usageUpdate(used, size));
	};
	/** Map a committed assistant message, resending only unstreamed remainders. */
	const deliverAssistantMessage = (record, turn, step, blocks) => {
		serialize(record, async () => {
			if (record.closed || record.replaying) return;
			for (let index = 0; index < blocks.length; index += 1) {
				const block = blocks[index];
				const key = `${turn}:${step}:${index}`;
				if (block.type === "text") {
					const remainder = committedBlockRemainder(record.streamedText, key, block.text);
					if (remainder !== void 0) await notify({
						sessionId: record.id,
						update: assistantTextChunk(remainder)
					});
				} else if (block.type === "reasoning") {
					const remainder = committedBlockRemainder(record.streamedReasoning, key, block.text);
					if (remainder !== void 0) await notify({
						sessionId: record.id,
						update: assistantThoughtChunk(remainder)
					});
				}
			}
			pushUsage(record);
		});
	};
	/** Deliver streamed deltas (thought/message) as they arrive. */
	const deliverStreamChunk = (record, turn, step, chunk) => {
		if (chunk.type === "text-delta" && chunk.index !== void 0 && chunk.text !== void 0 && chunk.text.length > 0) {
			const key = `${turn}:${step}:${chunk.index}`;
			const wire = streamTextDelta(record.streamedText, key, chunk.text, assistantTextChunk);
			if (wire !== void 0) deliver(record, wire);
		} else if (chunk.type === "reasoning-delta" && chunk.index !== void 0 && chunk.text !== void 0 && chunk.text.length > 0) {
			const key = `${turn}:${step}:${chunk.index}`;
			const wire = streamTextDelta(record.streamedReasoning, key, chunk.text, assistantThoughtChunk);
			if (wire !== void 0) deliver(record, wire);
		}
	};
	/** Deliver the whole-table todo plan (and its turn/start clear). */
	const deliverPlan = (record, todos) => {
		const fold = JSON.stringify(todos);
		if (fold === record.sentPlanFold) return;
		record.sentPlanFold = fold;
		record.everSentPlan = true;
		deliver(record, planUpdate(todos));
	};
	const deliverPlanClear = (record) => {
		if (!record.everSentPlan || record.sentPlanFold === "[]") return;
		record.sentPlanFold = "[]";
		deliver(record, planUpdate([]));
	};
	/** Deliver a generic tool card on call and its terminal update on result. */
	const deliverToolCall = (record, call) => {
		const parsed = rawInputOf(call.arguments);
		const kind = toolKindFor(call.name);
		const location = toolCallLocation(parsed, record.cwd, (path) => {
			try {
				return readFileSync(path, "utf8");
			} catch {
				return;
			}
		});
		serialize(record, async () => {
			if (record.closed || record.replaying) return;
			await notify({
				sessionId: record.id,
				update: {
					sessionUpdate: "tool_call",
					toolCallId: call.callId,
					title: toolCallTitle(kind, call.name, parsed, record.cwd),
					name: call.name,
					kind,
					status: "pending",
					rawInput: displayRawInput(call.name, parsed, record.cwd),
					...location !== void 0 ? { locations: [location] } : {}
				}
			});
		});
	};
	const deliverToolResult = (record, result) => {
		serialize(record, async () => {
			if (record.closed || record.replaying) return;
			const diffs = diffForToolCall(result.name, result.rawInput, result.meta, result.isError);
			const textContent = toolCallContent(resultBody(result.name, result.text));
			const content = diffs === void 0 ? textContent : [...toolCallDiffContent(diffs, record.cwd), ...textContent ?? []];
			await notify({
				sessionId: record.id,
				update: {
					sessionUpdate: "tool_call_update",
					toolCallId: result.callId,
					status: result.isError ? "failed" : "completed",
					...content !== void 0 ? { content } : {}
				}
			});
			pushUsage(record);
		});
	};
	/**
	* Announce the session's slash catalog as one `available_commands_update`.
	* The list merges the dsh command plane (`ctx.commands`, e.g. goal /
	* permission / plan / compact / feedback) with **user-invocable skills**
	* (`ctx.skills`, sourced from the same global/project roots Zed reads —
	* `~/.agents/skills` and `<project>/.agents/skills`), because Zed 1.18 only
	* surfaces slash entries for an external ACP agent through
	* `available_commands_update` and validates any typed `/name` against that
	* list. Commands win name collisions; skills the user may not invoke stay
	* out. Execution needs no extra bridge code: a picked skill reaches the
	* prompt as a plain `/name` user text, and dsh's `tool-skill` pre-step hook
	* expands that gesture into the skill body for the model — exactly the dsh
	* Web "/"-menu behavior.
	*/
	const slashCatalogFor = async (record) => {
		const commandEntries = [];
		if (commands !== void 0) for (const descriptor of commands.list(record.agent)) commandEntries.push({
			name: descriptor.name,
			description: descriptor.description,
			...descriptor.input?.hint !== void 0 && descriptor.input.hint.length > 0 ? { inputHint: descriptor.input.hint } : {}
		});
		let skillEntries = [];
		if (skills !== void 0) try {
			skillEntries = (await skills.list({
				cwd: record.cwd,
				scope: record.agent
			})).map((skill) => ({
				name: skill.name,
				description: skill.description,
				userInvocable: skill.invocation.userInvocable
			}));
		} catch (error) {
			logger.warn(`dsh-acp-interactive: skill catalog unavailable for slash list: ${errorChain(error)}`);
		}
		return mergeSlashCatalog(commandEntries, skillEntries);
	};
	/** Deferred slash-catalog announcement (Zed ignores unknown-session updates). */
	const announceSlashCatalog = (record) => {
		setTimeout(() => {
			slashCatalogFor(record).then((entries) => {
				if (entries.length === 0 || record.closed) return;
				deliver(record, commandsUpdate(entries));
			}).catch((error) => {
				logger.warn(`dsh-acp-interactive: slash catalog announcement failed: ${errorChain(error)}`);
			});
		}, 0);
	};
	if (commands !== void 0 || skills !== void 0) {
		const refreshAll = () => {
			for (const record of store.values()) announceSlashCatalog(record);
		};
		const host = ctx;
		host.on("skills/change", refreshAll);
		host.on("commands/change", refreshAll);
	}
	ctx.on("session/event", (session, event) => {
		const record = store.get(session.header.id);
		if (record === void 0 || record.agent.session !== session) return;
		const inflight = record.inflight;
		switch (event.type) {
			case "assistant/chunk":
				deliverStreamChunk(record, event.data.turn, event.data.step, event.data.chunk);
				break;
			case "assistant/message":
				deliverAssistantMessage(record, event.data.turn, event.data.step, event.data.message.content);
				break;
			case "tool/call":
				if (event.data.name === "ask_user_question") askCall.set(record.id, String(event.data.callId));
				liveCalls.set(String(event.data.callId), {
					name: event.data.name,
					rawInput: rawInputOf(event.data.arguments)
				});
				deliverToolCall(record, event.data);
				break;
			case "tool/result": {
				const call = toolResultCall(event.data.message);
				const source = liveCalls.get(call.callId);
				deliverToolResult(record, {
					callId: call.callId,
					text: call.text,
					isError: event.data.error !== void 0,
					name: source?.name ?? "",
					rawInput: source?.rawInput,
					meta: event.data.meta
				});
				liveCalls.delete(call.callId);
				break;
			}
			case "todo/write":
				deliverPlan(record, event.data.todos);
				break;
			case "turn/start":
				deliverPlanClear(record);
				break;
			case "turn/end":
				if (inflight !== void 0 && inflight.turn === event.data.turn) {
					inflight.endKind = event.data.reason.kind;
					if (event.data.reason.kind === "error") inflight.endMessage = event.data.reason.error?.message ?? "";
					settleAfterQuiescence(record, inflight);
				}
				pushUsage(record);
		}
	});
	ctx.on("approval/request", (request, next) => {
		if (conn === void 0) return next();
		const record = store.get(request.agent.session.id);
		if (record === void 0 || record.agent !== request.agent || request.callId === void 0) return next();
		const callId = request.callId;
		return drainRecord(record).then(() => conn.requestPermission({
			sessionId: record.id,
			toolCall: { toolCallId: callId },
			options: [{
				optionId: "allow-once",
				name: "Allow once",
				kind: "allow_once"
			}, {
				optionId: "reject-once",
				name: "Reject",
				kind: "reject_once"
			}]
		})).then(({ outcome }) => {
			if (outcome.outcome === "cancelled") return "cancelled";
			return outcome.optionId === "allow-once" ? "allowed-once" : "rejected";
		});
	});
	ctx.on("agent/inbox/claimed", ({ agent, message, turn }) => {
		const inflight = store.get(agent.session.id)?.inflight;
		if (inflight !== void 0 && inflight.messageId === message.id) inflight.turn = turn;
	});
	ctx.on("agent/error", ({ agent, turn, error }) => {
		const record = store.get(agent.session.id);
		const inflight = record?.inflight;
		if (record === void 0 || inflight === void 0 || !inflight.messageQueued || inflight.turn === turn) return;
		inflight.agentError = new Error(errorChain(error));
		settleAfterQuiescence(record, inflight);
	});
	const closing = /* @__PURE__ */ new WeakMap();
	const closeOne = (record, cause) => {
		const pending = closing.get(record);
		if (pending !== void 0) return pending;
		const run = (async () => {
			if (record.closed) return;
			requestStop(record, cause);
			await drainRecord(record);
			await record.dispose();
			try {
				await sessions.flush(record.agent.session);
			} catch (error) {
				logger.warn(`dsh-acp-interactive: persistence flush failed on close: ${String(error)}`);
			}
			record.closed = true;
		})();
		closing.set(record, run);
		return run;
	};
	/** Shipped route defaults: a model-selection ref plus the factory options bag. */
	const routeDefaults = () => {
		const selection = {
			current: void 0,
			assembled: void 0
		};
		if (config.provider !== void 0 && config.model !== void 0) selection.current = {
			provider: config.provider,
			model: config.model
		};
		return {
			selection,
			agentOptions: config.provider !== void 0 || config.model !== void 0 ? {
				provider: config.provider,
				model: config.model
			} : void 0
		};
	};
	const reasoningFor = async (provider, model) => {
		if (llm === void 0) return void 0;
		try {
			const resolved = await llm.resolveModelInfo(provider, model);
			if (resolved.reasoning === void 0) return void 0;
			return {
				efforts: resolved.reasoning.efforts.map((effort) => ({
					id: effort.id,
					name: effort.name,
					description: effort.description ?? null
				})),
				...resolved.reasoning.defaultEffort !== void 0 ? { defaultEffort: resolved.reasoning.defaultEffort } : {}
			};
		} catch (error) {
			logger.warn(`dsh-acp-interactive: reasoning catalog for ${provider}/${model} failed: ${String(error)}`);
			return;
		}
	};
	const refreshConfigOptions = async (record) => {
		const current = record.selection.current;
		if (llm === void 0 || current === void 0 || current.provider === void 0 || current.model === void 0) return [];
		const out = [];
		try {
			const providers = await llm.listProviders();
			const catalog = [];
			for (const provider of providers) {
				let models = [];
				try {
					models = await llm.listModels(provider.id);
				} catch (error) {
					logger.warn(`dsh-acp-interactive: model catalog for ${provider.id} failed: ${String(error)}`);
				}
				catalog.push({
					id: provider.id,
					name: provider.name,
					models
				});
			}
			const flat = modelSelectOptionList(catalog, {
				provider: current.provider,
				model: current.model
			});
			if (flat !== null && flat.options.length > 0) out.push({
				type: "select",
				id: CONFIG_ID_MODEL,
				name: "Model",
				description: "Model used for new requests in this session.",
				category: "model",
				currentValue: flat.currentValue,
				options: flat.options
			});
		} catch (error) {
			logger.warn(`dsh-acp-interactive: provider catalog failed: ${String(error)}`);
		}
		const reasoning = await reasoningFor(current.provider, current.model);
		const offered = thoughtLevelOptionOptions(reasoning);
		if (offered.length > 0) {
			record.supportedEfforts = reasoning?.efforts !== void 0 ? new Set(reasoning.efforts.map((effort) => effort.id)) : void 0;
			const currentEffort = currentEffortFor(current.reasoningEffort !== void 0 ? current.reasoningEffort : void 0, reasoning?.defaultEffort);
			out.push({
				type: "select",
				id: CONFIG_ID_THOUGHT_LEVEL,
				name: "Thought Level",
				description: "Reasoning effort for models that support selectable levels.",
				category: "thought_level",
				currentValue: currentEffort,
				options: offered.map((effort) => ({
					value: effort.id,
					name: effort.name,
					description: effort.description
				}))
			});
		}
		if (permissionPresets !== void 0) {
			const names = PERMISSION_PRESETS;
			const currentValue = record.permission ?? "workspace-write";
			out.push({
				type: "select",
				id: CONFIG_ID_PERMISSION,
				name: "Write permission",
				description: "One-shot permission preset for this session (sandbox mode + approval policy).",
				category: "permission",
				currentValue: names.includes(currentValue) ? currentValue : names[1],
				options: permissionSelectOptions(names)
			});
		}
		return out;
	};
	/** Apply one validated config change; takes effect on the next turn. */
	const applyConfigOption = async (record, configId, value) => {
		const current = record.selection.current;
		if (current === void 0 || current.provider === void 0 || current.model === void 0) throw invalidParams("config options are unavailable: the session has no model route");
		if (typeof value !== "string") throw invalidParams(`config option "${configId}" expects a select value id`);
		if (configId === CONFIG_ID_MODEL) {
			const slash = value.indexOf("/");
			if (slash <= 0 || slash === value.length - 1) throw invalidParams(`unknown model value: ${value}`);
			record.selection.current = {
				provider: value.slice(0, slash),
				model: value.slice(slash + 1)
			};
			return;
		}
		if (configId === CONFIG_ID_THOUGHT_LEVEL) {
			if (!thoughtLevelOptionOptions(await reasoningFor(current.provider, current.model)).some((effort) => effort.id === value)) throw invalidParams(`unknown thought_level value: ${value}`);
			if (value === "provider-default") {
				const { reasoningEffort: _stripped, ...rest } = current;
				record.selection.current = rest;
				return;
			}
			record.selection.current = {
				...current,
				reasoningEffort: ReasoningEffortId(value)
			};
			return;
		}
		if (configId === CONFIG_ID_PERMISSION) {
			if (permissionPresets === void 0) throw invalidParams("permission presets are not mounted");
			if (!PERMISSION_PRESETS.includes(value)) throw invalidParams(`unknown permission preset: ${value}`);
			record.permission = value;
			permissionPresets.set(record.agent.session, value);
			return;
		}
		throw invalidParams(`unknown config option: ${configId}`);
	};
	/** Strip a reasoning effort the current model cannot honor before queueing. */
	const guardCurrentEffort = (record) => {
		const current = record.selection.current;
		if (current?.reasoningEffort === void 0) return;
		const supported = record.supportedEfforts;
		if (supported === void 0) return;
		if (guardReasoningEffort({ reasoningEffort: current.reasoningEffort }, supported).reasoningEffort === void 0) {
			const { reasoningEffort: _stripped, ...rest } = current;
			record.selection.current = rest;
		}
	};
	const supportsImages = async () => {
		if (attachments === void 0 || llm === void 0 || config.provider === void 0 || config.model === void 0) return false;
		if (!attachments.imageLimits.mediaTypes.some((mediaType) => isImageMediaType(mediaType))) return false;
		try {
			return (await llm.resolveModelInfo(config.provider, config.model)).inputModalities?.includes("image") === true;
		} catch {
			return false;
		}
	};
	const validateWorkspaceParams = (params) => {
		if (!isAbsolute(params.cwd)) throw invalidParams(`cwd must be an absolute path: ${params.cwd}`);
		if (params.additionalDirectories !== void 0 && params.additionalDirectories !== null && params.additionalDirectories.length > 0) throw invalidParams("additionalDirectories is not supported");
		if (params.mcpServers !== void 0 && params.mcpServers !== null && params.mcpServers.length > 0) throw invalidParams("mcpServers is not supported");
	};
	/** Look a persisted session up by id and return its stored header facts. */
	const persistedHeader = async (sessionId) => {
		if (query === void 0) return void 0;
		const record = (await query.listSessions()).find((entry) => entry.header.id === sessionId && entry.persisted);
		if (record === void 0) return void 0;
		const cwd = record.header.cwd;
		return cwd !== void 0 && cwd.length > 0 ? {
			cwd,
			agentPreset: record.header.agentPreset
		} : void 0;
	};
	/** Latest activity time of one session as an ISO string (best effort). */
	const updatedAtFor = async (sessionId) => {
		if (query === void 0) return void 0;
		try {
			const events = await query.listEvents(sessionId);
			let latest = 0;
			for (const event of events) if (event.time > latest) latest = event.time;
			return latest > 0 ? new Date(latest).toISOString() : void 0;
		} catch {
			return;
		}
	};
	/** Display title of one session (best effort; none -> undefined). */
	const titleFor = async (sessionId) => {
		if (query === void 0) return void 0;
		try {
			return (await query.readTitle(sessionId))?.title;
		} catch {
			return;
		}
	};
	/** Dispose and deregister a live bridge record for the id, if any. */
	const releaseOnline = async (sessionId) => {
		const record = store.get(sessionId);
		if (record === void 0) return;
		removeRecord(store, record);
		await closeOne(record, { kind: "disposed" });
	};
	/**
	* Publish a freshly built record (session/new and load/resume share the
	* tail): register, build config options, kick off the background durability
	* flush and the deferred slash-catalog announcement, and roll the record
	* back loudly on failure.
	*/
	const registerRecord = async (record, replay) => {
		store.set(record.id, record);
		try {
			assertOpen();
			const configOptions = await refreshConfigOptions(record);
			assertOpen();
			sessions.flush(record.agent.session).catch((error) => {
				logger.warn(`dsh-acp-interactive: background persistence flush failed: ${String(error)}`);
			});
			announceSlashCatalog(record);
			if (replay !== void 0) await replay();
			return configOptions;
		} catch (error) {
			if (store.get(record.id) === record) removeRecord(store, record);
			await closeOne(record, { kind: "disposed" }).catch(() => {});
			throw error;
		}
	};
	/**
	* Stream one persisted session's history to the client as wire updates
	* (session/load semantics). Committed assistant content and tool cards from
	* the raw log, ending with the todo history folded to one final plan update;
	* raw deltas and usage never replay. Each frame is awaited in order so the
	* load response never races it.
	*/
	const replayHistory = async (record, events) => {
		record.replaying = true;
		try {
			const calls = /* @__PURE__ */ new Map();
			for (const event of events) {
				if (record.closed) return;
				if (event.type === "tool/call") calls.set(String(event.data.callId), {
					name: event.data.name,
					rawInput: rawInputOf(event.data.arguments)
				});
				for (const update of replayUpdatesForEvent(event, {
					cwd: record.cwd,
					calls
				})) await notify({
					sessionId: record.id,
					update
				});
			}
			const entries = foldTodoPlan(events);
			if (entries !== void 0 && !record.closed) await notify({
				sessionId: record.id,
				update: planUpdate(entries)
			});
		} finally {
			record.replaying = false;
		}
	};
	/** One ordered "create-or-resume" agent handle for history loads. */
	const resumeAgentFor = async (sessionId, agentPreset) => {
		const { selection, agentOptions } = routeDefaults();
		let presetId = agentPreset;
		if (presetId === void 0 && presets !== void 0) try {
			presetId = (await presets.resolve())?.id;
		} catch (error) {
			logger.warn(`dsh-acp-interactive: default agent preset unavailable: ${errorChain(error)}`);
		}
		return {
			handle: await agents.resume({
				resumeSessionId: sessionId,
				agentOptions,
				setup: async (agentCtx) => {
					installModelSelection(agentCtx, selection);
					if (presetId !== void 0 && presets !== void 0) await presets.mount(agentCtx, presetId);
				}
			}),
			selection
		};
	};
	/** Best-effort durable delete of one session artifact (idempotent). */
	const deletePersisted = (header) => {
		if (persistence === void 0) return;
		if (header.cwd === void 0 || header.cwd.length === 0) {
			logger.warn(`dsh-acp-interactive: durable delete skipped: session cwd is unknown`);
			return;
		}
		let location;
		try {
			location = persistence.locate(header);
		} catch (error) {
			logger.warn(`dsh-acp-interactive: persistence locate failed: ${errorChain(error)}`);
			return;
		}
		if (location === void 0) return;
		const sessionsRoot = join(resolveDshHome(), "sessions");
		const artifact = location.path;
		if (!artifact.startsWith(sessionsRoot)) {
			logger.warn(`dsh-acp-interactive: refusing to delete artifact outside the sessions root: ${artifact}`);
			return;
		}
		const sessionDir = dirname(artifact);
		if (!/^(session-)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(basename(sessionDir))) {
			logger.warn(`dsh-acp-interactive: refusing to delete unexpected artifact layout: ${artifact}`);
			return;
		}
		try {
			rmSync(sessionDir, {
				recursive: true,
				force: true
			});
		} catch (error) {
			logger.warn(`dsh-acp-interactive: durable delete failed: ${errorChain(error)}`);
		}
	};
	const trackedImplementation = new Proxy({
		async initialize(params) {
			clientCapabilities = params.clientCapabilities ?? void 0;
			imagePromptEnabled = await supportsImages();
			const history = query !== void 0;
			return {
				protocolVersion: PROTOCOL_VERSION,
				agentInfo: {
					name: AGENT_NAME,
					version: AGENT_VERSION
				},
				agentCapabilities: {
					loadSession: history,
					promptCapabilities: {
						image: imagePromptEnabled,
						audio: false,
						embeddedContext: false
					},
					sessionCapabilities: {
						close: {},
						...history ? {
							list: {},
							delete: {},
							resume: {}
						} : {}
					}
				},
				authMethods: [{
					id: "env-deepseek-api-key",
					name: "DeepSeek API key",
					description: "Set the DEEPSEEK_API_KEY environment variable (or configure the key in the dsh web Models settings / ~/.dsh/.credentials.yaml) and restart the agent."
				}]
			};
		},
		async authenticate(_params) {
			if (process.env[AUTH_ENV_KEY]?.trim()) return;
			const homeKey = process.env.DSH_HOME ?? resolveDshHome();
			try {
				const credentials = await readFile(join(homeKey, ".credentials.yaml"), "utf8");
				if (credentials.includes("apiKey") || credentials.includes("deepseek")) return;
			} catch {}
			throw RequestError.authRequired(void 0, "no API key is configured: set DEEPSEEK_API_KEY in the agent environment, or add a DeepSeek API key through the dsh web Models settings (" + join(homeKey, ".credentials.yaml") + ") and restart.");
		},
		async newSession(params) {
			assertOpen();
			validateWorkspaceParams(params);
			const sessionId = SessionId(randomUUID());
			const { selection, agentOptions } = routeDefaults();
			let presetId;
			if (presets !== void 0) try {
				presetId = (await presets.resolve())?.id;
			} catch (error) {
				logger.warn(`dsh-acp-interactive: default agent preset unavailable: ${errorChain(error)}`);
			}
			let handle;
			try {
				handle = await agents.create({
					sessionId,
					meta: {
						cwd: params.cwd,
						...presetId !== void 0 ? { agentPreset: presetId } : {}
					},
					agentOptions,
					setup: async (agentCtx) => {
						installModelSelection(agentCtx, selection);
						if (presetId !== void 0 && presets !== void 0) await presets.mount(agentCtx, presetId);
					}
				});
			} catch (error) {
				throw internalError(`session creation failed: ${errorChain(error)}`);
			}
			if (closed) {
				await handle.dispose().catch(() => {});
				throw internalError("connection closed during session/new");
			}
			return {
				sessionId,
				configOptions: await registerRecord(makeRecord(sessionId, params.cwd, handle, selection))
			};
		},
		async listSessions(params) {
			assertOpen();
			if (query === void 0) throw invalidParams("session history is not available on this connection");
			const records = await query.listSessions();
			const want = params.cwd !== void 0 && params.cwd !== null ? params.cwd : void 0;
			const sessions = [];
			for (const record of records) {
				const cwd = record.header.cwd;
				if (cwd === void 0 || cwd.length === 0) continue;
				if (want !== void 0 && cwd !== want) continue;
				const id = record.header.id;
				const [title, updatedAt] = await Promise.all([titleFor(id), updatedAtFor(id)]);
				sessions.push({
					sessionId: id,
					cwd,
					...title !== void 0 ? { title } : {},
					...updatedAt !== void 0 ? { updatedAt } : {}
				});
			}
			return { sessions };
		},
		/** Shared admission for load/resume over a persisted session. */
		async prepareHistoryResume(params) {
			assertOpen();
			const sessionId = SessionId(params.sessionId);
			const header = await persistedHeader(sessionId);
			if (header === void 0) throw invalidParams(`unknown session: ${params.sessionId}`);
			if (header.cwd !== params.cwd) throw invalidParams(`session ${params.sessionId} belongs to ${header.cwd}, not ${params.cwd}`);
			await releaseOnline(sessionId);
			const { handle, selection } = await resumeAgentFor(sessionId, header.agentPreset);
			if (closed) {
				await handle.dispose().catch(() => {});
				throw internalError("connection closed during session load/resume");
			}
			const record = makeRecord(sessionId, params.cwd, handle, selection);
			return { configOptions: await registerRecord(record, params.replay && query !== void 0 ? async () => {
				const snapshot = await query.readSession(sessionId);
				await replayHistory(record, snapshot.events);
			} : void 0) };
		},
		async loadSession(params) {
			validateWorkspaceParams(params);
			return this.prepareHistoryResume({
				sessionId: params.sessionId,
				cwd: params.cwd,
				replay: true
			});
		},
		async resumeSession(params) {
			validateWorkspaceParams(params);
			return this.prepareHistoryResume({
				sessionId: params.sessionId,
				cwd: params.cwd,
				replay: false
			});
		},
		async deleteSession(params) {
			assertOpen();
			const sessionId = SessionId(params.sessionId);
			const online = store.get(sessionId);
			let cwd = online?.cwd;
			if (cwd === void 0 && query !== void 0) cwd = (await persistedHeader(sessionId))?.cwd;
			if (online !== void 0) {
				removeRecord(store, online);
				await closeOne(online, { kind: "user" }).catch(() => {});
			}
			deletePersisted({
				id: sessionId,
				cwd
			});
			return {};
		},
		async closeSession(params) {
			assertOpen();
			const sessionId = SessionId(params.sessionId);
			const record = requireSession(sessionId);
			try {
				await closeOne(record, { kind: "user" });
			} catch (error) {
				throw internalError(`session close failed: ${errorChain(error)}`);
			} finally {
				removeRecord(store, record);
			}
			return {};
		},
		async setSessionConfigOption(params) {
			assertOpen();
			const record = requireSession(SessionId(params.sessionId));
			await applyConfigOption(record, params.configId, params.value);
			return { configOptions: await refreshConfigOptions(record) };
		},
		async prompt(params) {
			assertOpen();
			const record = requireSession(SessionId(params.sessionId));
			if (record.inflight !== void 0) throw invalidParams("a prompt is already in flight for this session");
			guardCurrentEffort(record);
			const inflight = createInflight();
			record.inflight = inflight;
			const prompt = params.prompt.map((block) => block.type === "text" ? {
				...block,
				text: normalizeSkillSlashText(block.text)
			} : block);
			let admissionFailed = false;
			let admissionFailure;
			try {
				if (agents.get(record.agent.id) !== record.agent) throw internalError("prompt was not queued: the agent was disposed outside the bridge");
				const line = slashLine(prompt);
				if (line !== void 0) {
					if (commands === void 0) throw internalError("no command runtime is mounted");
					const exec = await commands.execute(record.agent, line, encodedImages(prompt), inflight.admissionController.signal);
					if (exec !== void 0) {
						inflight.commandExecuted = true;
						if (exec.result.text !== void 0 && exec.result.text.length > 0) deliver(record, assistantTextChunk(exec.result.text));
					}
				}
				if (inflight.commandExecuted !== true) {
					const images = scanPrompt(prompt, imagePromptEnabled);
					inflight.admissionController.signal.throwIfAborted();
					let imageRefs = [];
					if (images.length > 0) {
						if (attachments === void 0) throw invalidParams("no attachment store is mounted");
						imageRefs = await persistImages(attachments, images, inflight.admissionController.signal);
					}
					inflight.admissionController.signal.throwIfAborted();
					if (agents.get(record.agent.id) !== record.agent) throw internalError("prompt was not queued: the agent was disposed outside the bridge");
					const content = contentForPrompt(prompt, imageRefs);
					const message = createUserMessage({
						content,
						source: { kind: "user" }
					});
					inflight.messageId = message.id;
					inflight.messageQueued = true;
					try {
						record.agent.followup(message);
					} catch (error) {
						inflight.messageQueued = false;
						throw error;
					}
				}
			} catch (error) {
				admissionFailed = true;
				admissionFailure = error;
			} finally {
				inflight.finishAdmission();
			}
			if (inflight.cancelRequested) {
				settleAfterQuiescence(record, inflight);
				return { stopReason: await inflight.promise };
			}
			if (admissionFailed) {
				record.inflight = void 0;
				if (admissionFailure instanceof AcpContentError) throw admissionFailure.kind === "invalid" ? invalidParams(admissionFailure.message) : internalError(admissionFailure.message);
				if (admissionFailure instanceof RequestError) throw admissionFailure;
				throw internalError(`prompt was not queued: ${admissionFailure?.message ?? String(admissionFailure)}`);
			}
			settleAfterQuiescence(record, inflight);
			return { stopReason: await inflight.promise };
		},
		cancel(params) {
			const record = store.get(SessionId(params.sessionId));
			if (record === void 0) return Promise.resolve();
			const inflight = record.inflight;
			if (inflight !== void 0) {
				inflight.cancelRequested = true;
				inflight.admissionController.abort(/* @__PURE__ */ new Error("ACP prompt cancelled"));
				settleAfterQuiescence(record, inflight);
			}
			if (inflight === void 0 || inflight.messageQueued) record.agent.cancel({ kind: "user" });
			return Promise.resolve();
		}
	}, { get(target, prop, receiver) {
		const value = Reflect.get(target, prop, receiver);
		if (typeof value !== "function") return value;
		return (...args) => {
			const result = value.apply(target, args);
			if (result instanceof Promise) {
				activeRequests.add(result);
				result.catch(() => void 0).finally(() => {
					activeRequests.delete(result);
				});
			}
			return result;
		};
	} });
	conn = new AgentSideConnection((connection) => {
		conn = connection;
		return trackedImplementation;
	}, ndJsonStream(Writable.toWeb(process.stdout), Readable.toWeb(process.stdin)));
	let quiescing;
	const quiesce = () => {
		if (quiescing !== void 0) return quiescing;
		closed = true;
		for (const record of store.values()) {
			const inflight = record.inflight;
			if (inflight !== void 0) {
				inflight.cancelRequested = true;
				inflight.admissionController.abort(/* @__PURE__ */ new Error("ACP bridge disposed"));
				settleAfterQuiescence(record, inflight);
			}
			record.agent.cancel({ kind: "disposed" });
		}
		quiescing = (async () => {
			await Promise.allSettled([...activeRequests]);
			const records = [...store.values()];
			const failures = [];
			for (const record of records) {
				try {
					await closeOne(record, { kind: "disposed" });
				} catch (error) {
					failures.push(error);
				}
				removeRecord(store, record);
			}
			if (failures.length > 0) {
				const detail = failures.map((failure) => errorChain(failure)).join("; ");
				throw new AggregateError(failures, `dsh-acp-interactive: teardown failed for ${failures.length} session(s): ${detail}`);
			}
		})();
		return quiescing;
	};
	const appExit = ctx.get("appExit");
	let exitStarted = false;
	conn.closed.catch((error) => {
		logger.warn(`dsh-acp-interactive: connection closed with an error: ${String(error)}`);
	}).then(async () => {
		await quiesce();
		if (appExit !== void 0 && !exitStarted) {
			exitStarted = true;
			appExit(0);
		}
	}).catch((error) => {
		logger.warn(`dsh-acp-interactive: connection-close teardown failed: ${String(error)}`);
	});
	ctx.effect(() => quiesce, "dsh-acp-interactive.connection");
	const askViaForm = async (request) => {
		const agent = request.agent;
		const record = agent !== void 0 ? store.get(agent.session.id) : void 0;
		if (record === void 0 || record.closed || conn === void 0) throw new Error("no live ACP session for this question");
		if (!elicitationFormsEnabled()) throw new Error("this ACP client does not support elicitation forms; answer the question inline instead");
		const signal = request.signal;
		if (signal !== void 0 && signal.aborted) throw new Error("question aborted");
		const properties = {};
		const required = [];
		const messages = [];
		for (const item of request.questions) {
			messages.push(item.question);
			const base = {
				title: item.question,
				...item.detail !== void 0 && item.detail.length > 0 ? { description: item.detail } : {}
			};
			const options = item.options ?? [];
			if (options.length > 0) {
				const labels = options.map((option) => option.label);
				properties[item.id] = item.multiSelect === true ? {
					type: "array",
					items: {
						type: "string",
						enum: labels
					},
					...base
				} : {
					type: "string",
					enum: labels,
					...base
				};
				properties[`${item.id}__other`] = {
					type: "string",
					title: "Other"
				};
			} else {
				properties[item.id] = {
					type: "string",
					...base
				};
				required.push(item.id);
			}
		}
		const callId = askCall.get(record.id);
		let outcome;
		try {
			outcome = await conn.createElicitation({
				mode: "form",
				sessionId: record.id,
				...callId !== void 0 ? { toolCallId: callId } : {},
				message: messages.join(" "),
				schema: {
					type: "object",
					properties,
					required
				}
			});
		} finally {
			askCall.delete(record.id);
		}
		if (outcome.action === "decline") throw new Error("the user declined the question");
		if (outcome.action === "cancel") throw new Error("the question was cancelled");
		let content = {};
		if (outcome.action === "accept" && outcome.content !== void 0 && outcome.content !== null) content = outcome.content;
		const answers = [];
		for (const item of request.questions) {
			const value = content[item.id];
			const other = content[`${item.id}__other`];
			const hasOptions = (item.options ?? []).length > 0;
			const selected = value === void 0 ? [] : Array.isArray(value) ? value.map(String) : [String(value)];
			answers.push({
				id: item.id,
				selected: hasOptions ? selected : [],
				...typeof other === "string" && other.length > 0 ? { custom: other } : !hasOptions && typeof value === "string" && value.length > 0 ? { custom: value } : {}
			});
		}
		return { answers };
	};
	if (userQuestions !== void 0) ctx.on("user-questions/request", ((request, next) => {
		const agent = request.agent;
		if ((agent !== void 0 ? store.get(agent.session.id) : void 0) === void 0) return next();
		return askViaForm(request);
	}));
}
//#endregion
export { Config, apply, inject, name };
