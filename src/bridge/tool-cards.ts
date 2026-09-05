// Pure tool-card presentation helpers shared by the live path
// (bridge/index.ts `deliverToolCall`) and the durable-history replay path
// (replay.ts), so both produce byte-identical wire cards and stay
// unit-testable offline without a harness or protocol SDK (design.zh.md §3.4,
// §6.2).
//
// ACP kind classification: coarse `ToolKind` choice drives the client's icon
// AND its layout. Zed 1.18 renders `kind: execute` cards as terminal-style
// cards whose textual content sits behind a hover-only chevron (an external
// agent cannot set the card's is_open flag), while non-execute kinds render
// the title plus a collapsed, click-to-expand content block. Execute cards
// therefore present like every other tool: the title carries the model-written
// command description ("bash Show file contents", mirroring "read
// src/bridge/index.ts"; the raw command line is the fallback and stays in
// rawInput), and the captured output rides as plain text content that folds
// away. The title is the card's primary text on every kind (SDK:
// "Human-readable title describing what the tool is doing"); only
// argument-less tools fall back to the bare name.
import { isAbsolute, resolve, sep } from 'node:path'
import { codeFence } from './updates.js'

/** First tool-result call id + concatenated visible text of one result message. */
export function toolResultCall(message: {
  content: readonly unknown[]
}): { callId: string; text: string } {
  let callId = ''
  let text = ''
  const collect = (blocks: readonly unknown[]) => {
    for (const block of blocks) {
      const typed = block as { type?: string; text?: string; toolCallId?: string; content?: unknown }
      if (typed.type === 'text') text += typed.text ?? ''
      else if (typed.type === 'tool-result') {
        if (callId === '') callId = typed.toolCallId ?? ''
        if (Array.isArray(typed.content)) collect(typed.content as readonly unknown[])
      }
    }
  }
  collect(message.content)
  return { callId, text }
}

/** ACP tool-kind vocabulary used by the wire cards (schema `ToolKind`). */
export type ToolKindName = 'execute' | 'edit' | 'search' | 'read' | 'delete' | 'other'

/** Coarse ACP tool-kind classification for the generic card icon. */
export function toolKindFor(name: string): ToolKindName {
  if (name === 'write' || name === 'edit' || name === 'str_replace' || name === 'str_replace_editor') return 'edit'
  if (name === 'read_image' || name === 'read') return 'read'
  if (name.startsWith('search') || name === 'grep' || name === 'glob' || name === 'fs_search') return 'search'
  if (name.includes('delete') || name === 'rm') return 'delete'
  return 'other'
}

/**
 * Command-runner tools: their result text is captured process output (not a
 * tool-authored confirmation), so the expanded card fences it as a code block.
 */
export function isCommandTool(name: string): boolean {
  return name === 'bash' || name === 'pwsh'
}

/**
 * The card body of one tool result. A `read` result carries a
 * `<path>/<type>/<content>` envelope whose header lines are card noise (the
 * path already shows in the title and the follow-along location) — keep only
 * the `<content>` body. Any other shape passes through unchanged.
 */
export function resultCardText(name: string, text: string): string {
  if (name !== 'read') return text
  const match = /<content>\n?([\s\S]*?)\n?<\/content>/.exec(text)
  return match === null ? text : match[1]!
}

/**
 * The fenced card body of one tool result: extract the display text
 * (`resultCardText`) and wrap it in a code fence. Empty results stay empty —
 * an invisible tool result must not turn into an empty code block.
 */
export function resultBody(name: string, text: string): string {
  const extracted = resultCardText(name, text)
  return extracted.length === 0 ? extracted : codeFence(extracted)
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
export function displayRawInput(name: string, rawInput: unknown, cwd: string): unknown {
  const command = (typeof rawInput === 'string' ? rawInput : commandOf(rawInput))?.trim()
  if (isCommandTool(name) && command !== undefined && command.length > 0) {
    return codeFence(`${cwd} $ ${command}`, 'sh')
  }
  if (typeof rawInput !== 'object' || rawInput === null) return rawInput
  const record = rawInput as Record<string, unknown>
  const fragment = titleArgumentOf(toolKindFor(name), record, cwd)
  if (fragment === undefined) return rawInput
  const extras = ['offset', 'limit', 'view_range', 'insert_line']
    .filter((key) => record[key] !== undefined)
    .map((key) => `${key}=${JSON.stringify(record[key])}`)
  return codeFence([name, fragment, ...extras].join(' '))
}

/** Raw tool-argument JSON as displayed input (unparsable stays verbatim). */
export function rawInputOf(argumentsJson: string): unknown {
  try {
    return JSON.parse(argumentsJson)
  } catch {
    return argumentsJson
  }
}

// ── follow-along locations (design.zh.md §3.4) ─────────────────────────────
// ACP `ToolCallLocation` (path + optional 1-based line) powers client
// "follow-along": Zed highlights/jumps to the file the agent is touching as
// each tool card streams. The harness filesystem tools all carry a single
// model-facing path argument (`file_path` on read/write/edit/read_image,
// `path` on str_replace_editor); a `read`'s `offset` and str_replace_editor's
// `view_range`/`insert_line` give a 1-based focus line, and an `edit`'s unique
// `old_string` is matched against the current file to infer the touched line
// when the caller supplies the file's current text.

/** The model-facing path argument shared by every harness filesystem tool. */
export function toolPathOf(rawInput: unknown): string | undefined {
  if (typeof rawInput !== 'object' || rawInput === null) return undefined
  const record = rawInput as Record<string, unknown>
  for (const key of ['file_path', 'path']) {
    const value = record[key]
    if (typeof value === 'string' && value.length > 0) return value
  }
  return undefined
}

/**
 * 1-based line of the first occurrence of `needle` in `text`, or undefined
 * when absent or ambiguous (pi-acp's rule: a repeated match carries no focus).
 */
export function uniqueLineOfText(text: string, needle: string): number | undefined {
  if (needle.length === 0) return undefined
  const first = text.indexOf(needle)
  if (first < 0 || text.indexOf(needle, first + needle.length) >= 0) return undefined
  let line = 1
  for (let index = 0; index < first; index += 1) {
    if (text.charCodeAt(index) === 10) line += 1
  }
  return line
}

/** First 1-based line of a str_replace_editor `view_range` window ([11,12]→11). */
function viewRangeLine(viewRange: unknown): number | undefined {
  if (!Array.isArray(viewRange)) return undefined
  const start = viewRange[0]
  return typeof start === 'number' && Number.isInteger(start) && start >= 1 ? start : undefined
}

/**
 * The follow-along location for one tool call, resolved against the session
 * cwd. `readText` (the file's current content) lets an `edit`-shaped input
 * report the exact line its `old_string` matches; other tools derive their
 * line purely from arguments. Returns undefined when the arguments name no
 * file (a bash/grep/todo card follows nothing).
 */
export function toolCallLocation(
  rawInput: unknown,
  cwd: string,
  readText?: (path: string) => string | undefined,
): { path: string; line?: number } | undefined {
  const path = toolPathOf(rawInput)
  if (path === undefined) return undefined
  const absolute = isAbsolute(path) ? path : resolve(cwd, path)
  if (typeof rawInput !== 'object' || rawInput === null) return { path: absolute }
  const record = rawInput as Record<string, unknown>
  // read: the window's first line (offset, 1-based in the tool schema).
  const offset = record['offset']
  if (typeof offset === 'number' && Number.isInteger(offset) && offset >= 1) {
    return { path: absolute, line: offset }
  }
  // str_replace_editor view: the requested window's first line.
  const viewLine = viewRangeLine(record['view_range'])
  if (viewLine !== undefined) return { path: absolute, line: viewLine }
  // str_replace_editor insert: inserts AFTER line N, so N+1 is the first
  // changed line (0 → the new line 1).
  if (typeof record['command'] === 'string' && record['command'] === 'insert') {
    const insertLine = record['insert_line']
    if (typeof insertLine === 'number' && Number.isInteger(insertLine) && insertLine >= 0) {
      return { path: absolute, line: insertLine + 1 }
    }
  }
  // edit / str_replace_editor str_replace: the (unique) old-string match line.
  const oldString = record['old_string'] ?? record['old_str']
  if (typeof oldString === 'string' && readText !== undefined) {
    const current = readText(absolute)
    if (current !== undefined) {
      const line = uniqueLineOfText(current, oldString)
      if (line !== undefined) return { path: absolute, line }
    }
  }
  return { path: absolute }
}

// ── structured diff cards (design.zh.md §3.4) ──────────────────────────────
// ACP `ToolCallContent {type: 'diff'}` renders a real client-side diff view.
// The harness fs tools already project their applied hunks into the durable
// `tool/result` event `meta` (`{ diffs: FileDiff[] }`, contextual hunks for
// edit/overwrite, `[]` for a fresh create — the create's whole-file content
// comes from the call arguments instead); str_replace_editor publishes no
// meta, but its arguments ARE the diff (`old_str`→`new_str`, `file_text` for
// a create). Both sources narrow through one pure shape so live and replay
// produce byte-identical cards.

/** One validated `FileDiff` as the tools' presentation vocabulary defines it. */
export interface FileDiffLike {
  path: string
  oldText: string | null
  newText: string
}

/** Structural guard for one opaque meta diff entry (malformed entries drop). */
function isFileDiffLike(value: unknown): value is FileDiffLike {
  if (typeof value !== 'object' || value === null) return false
  const record = value as Record<string, unknown>
  return typeof record['path'] === 'string'
    && (record['oldText'] === null || typeof record['oldText'] === 'string')
    && typeof record['newText'] === 'string'
}

/** Narrow opaque `tool/result` meta to validated file diffs ([] is valid). */
export function fileDiffsFromMeta(meta: unknown): FileDiffLike[] | undefined {
  if (typeof meta !== 'object' || meta === null || Array.isArray(meta)) return undefined
  const diffs = (meta as Record<string, unknown>)['diffs']
  if (!Array.isArray(diffs) || !diffs.every(isFileDiffLike)) return undefined
  return diffs
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
export function diffForToolCall(
  name: string,
  rawInput: unknown,
  meta: unknown,
  isError: boolean,
): FileDiffLike[] | undefined {
  if (isError) return undefined
  const fromMeta = fileDiffsFromMeta(meta)
  if (fromMeta !== undefined && fromMeta.length > 0) return fromMeta
  if (typeof rawInput !== 'object' || rawInput === null) return undefined
  const record = rawInput as Record<string, unknown>
  const path = toolPathOf(rawInput)
  if (path === undefined) return undefined
  // A create-shaped argument set: the whole new content, no before-image.
  const fileText = record['content'] ?? record['file_text']
  if ((name === 'write' || name === 'str_replace_editor') && typeof fileText === 'string') {
    return [{ path, oldText: null, newText: fileText }]
  }
  // An edit-shaped argument set: literal old → new.
  const oldText = record['old_string'] ?? record['old_str']
  const newText = record['new_string'] ?? record['new_str']
  if (typeof oldText === 'string' && typeof newText === 'string') {
    return [{ path, oldText, newText }]
  }
  return undefined
}

/**
 * Max title length for any tool card. Keeps a pathological heredoc, an
 * absolute path outside the workspace, or a generated regex from blowing up
 * the card header; ordinary arguments pass through untouched.
 */
export const TOOL_CARD_TITLE_MAX = 400

/** The model-written command line of a bash/pwsh call, or undefined. */
function commandOf(rawInput: unknown): string | undefined {
  if (typeof rawInput !== 'object' || rawInput === null) return undefined
  const command = (rawInput as Record<string, unknown>).command
  return typeof command === 'string' ? command : undefined
}

/** First non-blank string argument among the keys, or undefined. */
function firstStringArg(rawInput: Record<string, unknown>, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = rawInput[key]
    if (typeof value === 'string' && value.trim().length > 0) return value
  }
  return undefined
}

/**
 * Display form of a model-facing path: cwd-relative when the model passed an
 * absolute path under the session cwd, verbatim otherwise (a relative
 * argument already IS the short form, and tools run against that cwd).
 */
function displayPathOf(path: string, cwd: string | undefined): string {
  if (cwd === undefined || !isAbsolute(path)) return path
  const prefix = cwd.endsWith(sep) ? cwd : cwd + sep
  return path.startsWith(prefix) ? path.slice(prefix.length) : path
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
function titleArgumentOf(kind: ToolKindName, rawInput: Record<string, unknown>, cwd: string | undefined): string | undefined {
  if (kind === 'search') {
    // The host's own search cards read "Glob <pattern> in <path>" — same shape.
    const pattern = firstStringArg(rawInput, ['pattern', 'query', 'regex'])
    if (pattern !== undefined) {
      const scope = firstStringArg(rawInput, ['path'])
      return scope !== undefined ? `${pattern} in ${scope}` : pattern
    }
  }
  const path = toolPathOf(rawInput)
  if (path !== undefined) return displayPathOf(path, cwd)
  const description = firstStringArg(rawInput, ['description'])
  if (description !== undefined) return description
  const command = commandOf(rawInput)?.trim()
  if (command !== undefined && command.length > 0) return command
  return undefined
}

/** Human card title for one tool call (see module header for the rationale). */
export function toolCallTitle(kind: ToolKindName, name: string, rawInput: unknown, cwd?: string): string {
  const argument = typeof rawInput === 'object' && rawInput !== null
    ? titleArgumentOf(kind, rawInput as Record<string, unknown>, cwd)
    : undefined
  if (argument === undefined) return name
  const title = `${name} ${argument}`
  return title.length <= TOOL_CARD_TITLE_MAX ? title : `${title.slice(0, TOOL_CARD_TITLE_MAX)}…`
}
