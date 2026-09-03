import { randomUUID } from "node:crypto";
import { isAbsolute } from "node:path";
import { Readable, Writable } from "node:stream";
import Schema from "@deepseek-ai/schemastery";
import { createUserMessage, errorChain } from "@deepseek-ai/dsh-llm";
import { AgentSideConnection, PROTOCOL_VERSION, RequestError, ndJsonStream } from "@agentclientprotocol/sdk";
import { SessionId } from "@deepseek-ai/dsh-session";
import { isImageAdmissionError } from "@deepseek-ai/dsh-attachment";
//#region lib/types/content.js
/** ACP wire-content admission and projection owned by the ACP adapter. @module */
/** Raster formats shared by ACP image blocks and the core attachment vocabulary. */
const IMAGE_MEDIA_TYPES = [
	"image/png",
	"image/jpeg",
	"image/webp",
	"image/gif"
];
/** Canonical RFC 4648 base64, excluding whitespace and URL-safe aliases. */
const CANONICAL_BASE64 = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
/** Error with a stable ACP request-failure category and no raw binary payload. */
var AcpContentError = class extends Error {
	/** Whether the bridge should report invalid params or an internal failure. */
	kind;
	/**
	* @param message - safe protocol-facing detail without inline binary data.
	* @param kind - request-failure category.
	* @param options - optional causal chain for diagnostics.
	*/
	constructor(message, kind, options) {
		super(message, options);
		this.name = "AcpContentError";
		this.kind = kind;
	}
};
/** Narrow a wire MIME string to the durable raster vocabulary. */
function imageMediaType(value) {
	return IMAGE_MEDIA_TYPES.includes(value) ? value : void 0;
}
/** Strictly decode one ACP inline image without accepting base64 aliases. */
function decodeImage(block) {
	const mediaType = imageMediaType(block.mimeType);
	if (mediaType === void 0) throw new AcpContentError("image mimeType must be image/png, image/jpeg, image/webp, or image/gif", "invalid");
	if (!CANONICAL_BASE64.test(block.data)) throw new AcpContentError("image data must be canonical base64", "invalid");
	const data = Buffer.from(block.data, "base64");
	if (data.toString("base64") !== block.data) throw new AcpContentError("image data must be canonical base64", "invalid");
	return {
		data,
		mediaType
	};
}
/** Resolve the exact current route and require explicit image input support. */
async function assertImageRoute(ctx, agent, signal) {
	const routed = agent.session.requestHeader()?.config;
	const provider = routed?.provider ?? agent.options.provider;
	const model = routed?.model ?? agent.options.model;
	const llm = ctx.get("llm");
	if (provider === void 0 || model === void 0 || llm === void 0) throw new AcpContentError("the current model route could not be resolved for image input", "invalid");
	let info;
	try {
		info = await llm.resolveModelInfo(provider, model, signal);
	} catch (error) {
		throw new AcpContentError("the current model route could not be verified for image input", "internal", { cause: error });
	}
	if (info.inputModalities === void 0 || !info.inputModalities.includes("image")) throw new AcpContentError(`model "${model}" does not declare image input`, "invalid");
}
/**
* Determine whether initialization may truthfully advertise inline image prompts.
* Unknown service, route, capability, or deployment media support is negative.
* @param ctx - bridge context carrying optional attachment and model services.
* @param provider - configured provider route used for newly created sessions.
* @param model - configured exact model id used for newly created sessions.
* @returns whether this bridge can admit images at initialization time.
*/
async function supportsAcpImagePrompts(ctx, provider, model) {
	const attachments = ctx.get("attachments");
	const llm = ctx.get("llm");
	if (attachments === void 0 || llm === void 0 || provider === void 0 || model === void 0) return false;
	if (!attachments.imageLimits.mediaTypes.some((mediaType) => IMAGE_MEDIA_TYPES.includes(mediaType))) return false;
	try {
		return (await llm.resolveModelInfo(provider, model)).inputModalities?.includes("image") === true;
	} catch {
		return false;
	}
}
/** Render one baseline resource link into the core's current text vocabulary. */
function resourceLinkText(block) {
	return `\n[resource_link name=${JSON.stringify(block.name)} uri=${JSON.stringify(block.uri)}]\n`;
}
/**
* Admit one ACP prompt into ordered durable core content.
* Every wire block and image is validated before the ordered image batch starts
* writing; cancellation after a successful content-addressed write may leave an
* unreachable object but never queues a late user message.
* @param ctx - bridge context carrying attachment and model services.
* @param agent - destination agent whose latest exact route controls admission.
* @param prompt - untrusted ACP prompt blocks in wire order.
* @param imageEnabled - capability result advertised during initialization.
* @param signal - admission cancellation signal.
* @returns core content with durable image references in wire order.
*/
async function admitAcpPrompt(ctx, agent, prompt, imageEnabled, signal) {
	const images = [];
	for (const block of prompt) switch (block.type) {
		case "text":
		case "resource_link": break;
		case "image":
			if (!imageEnabled) throw new AcpContentError("inline image prompts were not advertised by this connection", "invalid");
			images.push(decodeImage(block));
			break;
		case "audio": throw new AcpContentError("audio prompt content is not supported", "invalid");
		case "resource": throw new AcpContentError("embedded resource prompt content is not supported", "invalid");
		/* v8 ignore next 2 -- ACP ContentBlock is a closed generated union. */
		default: throw new AcpContentError("unsupported ACP prompt content", "invalid");
	}
	let refs = [];
	if (images.length > 0) {
		const attachments = ctx.get("attachments");
		if (attachments === void 0) throw new AcpContentError("no attachment store is mounted", "invalid");
		await assertImageRoute(ctx, agent, signal);
		signal.throwIfAborted();
		try {
			refs = await attachments.saveImages(images);
		} catch (error) {
			if (isImageAdmissionError(error)) throw new AcpContentError(error.message, "invalid", { cause: error });
			throw new AcpContentError("unable to persist the prompt image batch", "internal", { cause: error });
		}
		signal.throwIfAborted();
	}
	const content = [];
	let pendingText = "";
	let imageIndex = 0;
	const flushText = () => {
		if (pendingText.length === 0) return;
		content.push({
			type: "text",
			text: pendingText
		});
		pendingText = "";
	};
	for (const block of prompt) switch (block.type) {
		case "text":
			pendingText += block.text;
			break;
		case "resource_link":
			pendingText += resourceLinkText(block);
			break;
		case "image": {
			flushText();
			const ref = refs[imageIndex++];
			content.push({
				type: "image",
				attachment: ref
			});
			break;
		}
		/* v8 ignore start -- the validation pass above rejects both tags before reconstruction. */
		case "audio":
		case "resource": break;
		/* v8 ignore stop */
		/* v8 ignore next 2 -- validated by the first closed-union switch. */
		default: break;
	}
	flushText();
	if (!content.some((block) => block.type === "image" || block.type === "text" && block.text.trim().length > 0)) throw new AcpContentError("empty prompt", "invalid");
	return content;
}
/**
* Translate one committed assistant block to ACP wire content.
* Images are re-read and integrity-verified before inline base64 delivery;
* unsupported core output blocks stay off the automation wire.
* @param ctx - bridge context carrying the authoritative attachment store.
* @param block - committed core assistant block.
* @returns ACP text/image content, or undefined for non-output blocks.
*/
async function assistantBlockToAcp(ctx, block) {
	if (block.type === "text") return block.text.length === 0 ? void 0 : {
		type: "text",
		text: block.text
	};
	if (block.type !== "image") return void 0;
	const attachments = ctx.get("attachments");
	if (attachments === void 0) throw new AcpContentError("cannot deliver assistant image: no attachment store is mounted", "internal");
	let stored;
	try {
		stored = await attachments.readImage(block.attachment);
	} catch (error) {
		throw new AcpContentError("cannot deliver assistant image: the attachment is unavailable or corrupt", "internal", { cause: error });
	}
	return {
		type: "image",
		data: Buffer.from(stored.data).toString("base64"),
		mimeType: stored.ref.mediaType
	};
}
//#endregion
//#region lib/types/codec.js
/**
* Pure translation between the harness lifecycle and the automation-only ACP wire.
* @module @deepseek-ai/dsh-acp/codec
*/
/**
* Map a harness turn ending to ACP's terminal reason vocabulary.
* @param reason - harness turn outcome.
* @returns the closest legal ACP stop reason.
*/
function turnEndToStopReason(reason) {
	switch (reason.kind) {
		case "completed": return "end_turn";
		case "max-tokens": return "max_tokens";
		case "aborted": return "end_turn";
		case "interrupted": return "cancelled";
		case "blocked":
		case "error": return "end_turn";
		/* v8 ignore next 2 -- TurnEndReason is closed and every member is handled above */
		default: return "end_turn";
	}
}
//#endregion
//#region lib/types/index.js
/**
* Automation-only Agent Client Protocol server over JSON-RPC stdio.
*
* The bridge exposes fresh harness sessions to trusted programmatic clients. It
* carries prompt text/images, committed assistant text/images, cancellation,
* and one-shot permission decisions; presentation and human-interaction
* features stay with the harness's UI modules.
*
* @module @deepseek-ai/dsh-acp
*/
const name = "acp";
/** The bridge creates and owns agents; every other concern is carried by the agent composition. */
const inject = ["agents"];
/** Preserve invalid-parameter detail in the SDK wire error message. */
function invalidParams(detail) {
	return RequestError.invalidParams(void 0, detail);
}
/** Preserve failed-turn detail; plain handler errors become a generic wire internal error. */
function internalError(detail) {
	return RequestError.internalError(void 0, detail);
}
const Config = Schema.object({
	provider: Schema.string(),
	model: Schema.string()
});
/**
* Mount the automation-only ACP server.
* @param ctx - Cordis context carrying the agent factory and session events.
* @param config - Initial provider/model selection and optional test transport.
*/
function apply(ctx, config) {
	const agents = ctx.agents;
	const logger = ctx.logger;
	const sessions = /* @__PURE__ */ new Map();
	let closed = false;
	let conn;
	let imagePromptEnabled = false;
	/** Return the bridge-owned record for an agent, rejecting same-id impostors. */
	const ownedRecord = (agent) => {
		const record = sessions.get(agent.session.id);
		return record?.agent === agent ? record : void 0;
	};
	const assertOpen = () => {
		if (closed) throw internalError("the ACP bridge has been disposed");
	};
	const requireSession = (sessionId) => {
		const record = sessions.get(sessionId);
		if (record === void 0) throw invalidParams(`unknown session: ${sessionId}`);
		return record;
	};
	/** Send one ordered protocol update while containing transport-only failure. */
	const notify = async (notification) => {
		try {
			await conn.sessionUpdate(notification);
		} catch (error) {
			logger.warn(`acp: session/update failed: ${String(error)}`);
		}
		/* v8 ignore stop */
	};
	const rejectFromError = (inflight, reason) => {
		inflight.reject(internalError(`turn failed: ${reason.error.message}`));
	};
	/**
	* Settle one exact prompt only after admission, agent activity, and ordered
	* assistant delivery have all reached quiescence.
	*/
	const settleAfterQuiescence = (record, inflight) => {
		if (inflight.settlementStarted) return;
		inflight.settlementStarted = true;
		(async () => {
			await inflight.admissionDone;
			if (inflight.messageQueued) {
				await record.agent.whenIdle();
				await record.outputTail;
			}
			/* v8 ignore next -- this prompt owns the slot until this exact settlement clears it. */
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
			const end = inflight.endReason;
			if (end === void 0) inflight.resolve("cancelled");
			else if (end.kind === "error") rejectFromError(inflight, end);
			else inflight.resolve(end.kind === "max-tokens" ? "end_turn" : turnEndToStopReason(end));
		})().catch((error) => {
			if (record.inflight !== inflight) return;
			record.inflight = void 0;
			inflight.reject(internalError(`prompt settlement failed: ${errorChain(error)}`));
		});
		/* v8 ignore stop */
	};
	ctx.on("session/event", (session, event) => {
		const record = sessions.get(session.header.id);
		if (record === void 0 || record.agent.session !== session) return;
		try {
			if (event.type === "assistant/message") {
				const inflight = record.inflight?.turn === event.data.turn ? record.inflight : void 0;
				record.outputTail = record.outputTail.then(async () => {
					for (const block of event.data.message.content) {
						const content = await assistantBlockToAcp(ctx, block);
						if (content === void 0) continue;
						await notify({
							sessionId: record.agent.session.id,
							update: {
								sessionUpdate: "agent_message_chunk",
								content
							}
						});
					}
				}).catch((error) => {
					const failure = error;
					if (inflight !== void 0) inflight.outputError ??= failure;
					logger.warn(`acp: assistant output conversion failed: ${errorChain(error)}`);
				});
			}
		} finally {
			const inflight = record.inflight;
			if (inflight !== void 0 && event.type === "turn/end" && inflight.turn === event.data.turn) inflight.endReason = event.data.reason;
		}
	});
	ctx.on("agent/inbox/claimed", ({ agent, message, turn }) => {
		const inflight = ownedRecord(agent)?.inflight;
		if (inflight !== void 0 && inflight.messageId === message.id) inflight.turn = turn;
	});
	ctx.on("agent/error", ({ agent, turn, error }) => {
		const record = ownedRecord(agent);
		const inflight = record?.inflight;
		if (record === void 0 || inflight === void 0 || !inflight.messageQueued || inflight.turn === turn) return;
		inflight.agentError = new Error(errorChain(error));
		settleAfterQuiescence(record, inflight);
	});
	ctx.on("approval/request", (request, next) => {
		const record = ownedRecord(request.agent);
		if (record === void 0 || request.callId === void 0) return next();
		return conn.requestPermission({
			sessionId: record.agent.session.id,
			toolCall: { toolCallId: request.callId },
			options: [{
				optionId: "allow-once",
				name: "Allow once",
				kind: "allow_once"
			}, {
				optionId: "reject-once",
				name: "Reject",
				kind: "reject_once"
			}]
		}).then(({ outcome }) => {
			if (outcome.outcome === "cancelled") return "cancelled";
			return outcome.optionId === "allow-once" ? "allowed-once" : "rejected";
		});
	});
	const makeAgent = (connection) => {
		conn = connection;
		return {
			async initialize(_params) {
				imagePromptEnabled = await supportsAcpImagePrompts(ctx, config.provider, config.model);
				return {
					protocolVersion: PROTOCOL_VERSION,
					agentInfo: {
						name: "deepseek-harness-acp",
						version: "0.0.1"
					},
					agentCapabilities: { promptCapabilities: {
						image: imagePromptEnabled,
						audio: false,
						embeddedContext: false
					} },
					authMethods: []
				};
			},
			authenticate(_params) {
				return Promise.resolve();
			},
			async newSession(params) {
				assertOpen();
				validateSessionParams(params);
				const sessionId = SessionId(randomUUID());
				const handle = await agents.create({
					sessionId,
					meta: { cwd: params.cwd },
					agentOptions: agentOptions(config)
				});
				/* v8 ignore next 4 -- a real stdio close can race an in-flight create. */
				if (closed) {
					await handle.dispose();
					throw internalError("connection closed during session/new");
				}
				sessions.set(sessionId, {
					agent: handle.agent,
					dispose: () => handle.dispose(),
					outputTail: Promise.resolve(),
					inflight: void 0
				});
				return { sessionId };
			},
			async prompt(params) {
				assertOpen();
				const record = requireSession(SessionId(params.sessionId));
				if (record.inflight !== void 0) throw invalidParams("a prompt is already in flight for this session");
				const completion = Promise.withResolvers();
				const admission = Promise.withResolvers();
				const admissionController = new AbortController();
				const inflight = {
					resolve: completion.resolve,
					reject: completion.reject,
					messageId: void 0,
					messageQueued: false,
					turn: void 0,
					endReason: void 0,
					admissionDone: admission.promise,
					finishAdmission: admission.resolve,
					admissionController,
					cancelRequested: false,
					settlementStarted: false,
					outputError: void 0,
					agentError: void 0
				};
				record.inflight = inflight;
				let admissionFailed = false;
				let admissionFailure;
				try {
					if (ctx.agents.get(record.agent.id) !== record.agent) throw internalError("prompt was not queued: the agent was disposed outside the bridge");
					const content = await admitAcpPrompt(ctx, record.agent, params.prompt, imagePromptEnabled, admissionController.signal);
					admissionController.signal.throwIfAborted();
					if (ctx.agents.get(record.agent.id) !== record.agent) throw internalError("prompt was not queued: the agent was disposed outside the bridge");
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
				} catch (error) {
					admissionFailed = true;
					admissionFailure = error;
				} finally {
					inflight.finishAdmission();
				}
				if (inflight.cancelRequested) {
					settleAfterQuiescence(record, inflight);
					return { stopReason: await completion.promise };
				}
				if (admissionFailed) {
					record.inflight = void 0;
					if (admissionFailure instanceof AcpContentError) throw admissionFailure.kind === "invalid" ? invalidParams(admissionFailure.message) : internalError(admissionFailure.message);
					if (admissionFailure instanceof RequestError) throw admissionFailure;
					const detail = admissionFailure.message;
					throw internalError(`prompt was not queued: ${detail}`);
				}
				settleAfterQuiescence(record, inflight);
				return { stopReason: await completion.promise };
			},
			cancel(params) {
				const record = sessions.get(SessionId(params.sessionId));
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
		};
	};
	conn = new AgentSideConnection(makeAgent, config.stream ?? ndJsonStream(Writable.toWeb(process.stdout), Readable.toWeb(process.stdin)));
	let quiescing;
	const quiesce = () => {
		if (quiescing !== void 0) return quiescing;
		closed = true;
		const records = [...sessions.values()];
		sessions.clear();
		for (const record of records) {
			const inflight = record.inflight;
			if (inflight !== void 0) {
				inflight.cancelRequested = true;
				inflight.admissionController.abort(/* @__PURE__ */ new Error("ACP bridge disposed"));
				settleAfterQuiescence(record, inflight);
			}
			record.agent.cancel({ kind: "user" });
		}
		quiescing = (async () => {
			await Promise.all(records.map(async (record) => {
				await record.inflight?.admissionDone;
				await record.agent.whenIdle();
				await record.outputTail;
			}));
			const subagents = ctx.get("subagents");
			if (subagents !== void 0) try {
				await subagents.drainContinuableDescendants(records.map((record) => record.agent));
			} catch (error) {
				logger.warn(`acp: continuable subagent teardown failed: ${String(error)}`);
			}
			const disposals = await Promise.allSettled(records.map((record) => record.dispose()));
			const failures = [];
			for (const result of disposals) if (result.status === "rejected") failures.push(result.reason);
			if (failures.length > 0) {
				const detail = failures.map((failure) => errorChain(failure)).join("; ");
				throw new AggregateError(failures, `ACP agent teardown failed for ${failures.length} session(s): ${detail}`);
			}
		})();
		return quiescing;
	};
	/* v8 ignore start -- production transport rejection and teardown failure. */
	conn.closed.catch((error) => {
		logger.warn(`acp: connection closed with an error: ${String(error)}`);
	}).then(quiesce).catch((error) => {
		logger.warn(`acp: connection-close teardown failed: ${String(error)}`);
	});
	/* v8 ignore stop */
	ctx.effect(() => quiesce, "acp.connection");
}
/**
* Build per-agent options from plugin config without assigning absent optional fields.
* @param config - ACP provider/model configuration.
* @returns the configured fields only.
*/
function agentOptions(config) {
	return {
		...config.provider !== void 0 ? { provider: config.provider } : {},
		...config.model !== void 0 ? { model: config.model } : {}
	};
}
/** Reject session features outside the automation contract. */
function validateSessionParams(params) {
	if (!isAbsolute(params.cwd)) throw invalidParams(`cwd must be an absolute path: ${params.cwd}`);
	if (params.additionalDirectories !== void 0 && params.additionalDirectories.length > 0) throw invalidParams("additionalDirectories is not supported");
	if (params.mcpServers.length > 0) throw invalidParams("mcpServers is not supported");
}
//#endregion
export { Config, apply, inject, name };
