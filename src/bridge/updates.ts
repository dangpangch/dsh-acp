// Semantic update serialization: committed assistant text / tool lifecycle /
// plan / usage facts — never raw provider deltas or private dsh presentation
// data (docs/design.zh.md §3). Wire variant names follow the v1 `SessionUpdate`
// union exactly (sdk 1.4.0 schema/types.gen.d.ts); delivery ordering
// (per-session serial chain) is the bridge's concern, these are pure builders
// and folds, unit-testable offline.
import type { SessionNotification, SessionConfigOption } from '@agentclientprotocol/sdk'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
// TodoItem and the `todo/write` SessionEventMap entry are owned by the todo
// tool package since dsh 0.1.2 (DSH-0.1.2-A1/R-11); importing the types pulls
// the official module augmentation into the program.
import type { TodoItem } from '@deepseek-ai/dsh-tool-todo'
import { isAbsolute, resolve } from 'node:path'

/** One committed assistant text block as an `agent_message_chunk`. */
export function assistantTextChunk(text: string): SessionNotification['update'] {
  return { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text } }
}

/**
 * One committed user text block as a `user_message_chunk`. `messageId` groups
 * a replayed message's blocks client-side (Zed merges adjacent user chunks
 * that share it), so every block of one stored message passes the same id.
 */
export function userMessageChunk(text: string, messageId: string): SessionNotification['update'] {
  return { sessionUpdate: 'user_message_chunk', content: { type: 'text', text }, messageId }
}

/** Reasoning text as an `agent_thought_chunk`. */
export function assistantThoughtChunk(text: string): SessionNotification['update'] {
  return { sessionUpdate: 'agent_thought_chunk', content: { type: 'text', text } }
}

/** Whole-list `plan` replacement (ACP replaces the entire plan per update). */
export function planUpdate(entries: readonly { content: string; status: 'pending' | 'in_progress' | 'completed' }[]): SessionNotification['update'] {
  return {
    sessionUpdate: 'plan',
    entries: entries.map((entry) => ({ content: entry.content, priority: 'medium', status: entry.status })),
  }
}

/** Context-window `usage_update` (used/size; unknown sides never emit). */
export function usageUpdate(used: number, size: number): SessionNotification['update'] {
  return { sessionUpdate: 'usage_update', used, size }
}

/**
 * Whole-list `config_option_update` replacement: the full set of config
 * options and their current values (ACP v1 full-snapshot semantics — clients
 * replace, never merge). Emitted when the model catalog changes under live
 * sessions so the client's model/thought/permission selects stay truthful.
 */
export function configOptionsUpdate(configOptions: readonly SessionConfigOption[]): SessionNotification['update'] {
  return { sessionUpdate: 'config_option_update', configOptions: [...configOptions] }
}

/**
 * Session-metadata `session_info_update` (partial update; the bridge only
 * streams titles). Lets the client's session list show the session's own
 * title — generated or renamed — without re-listing sessions.
 */
export function sessionInfoUpdate(title: string): SessionNotification['update'] {
  return { sessionUpdate: 'session_info_update', title }
}

/** Slash/command catalog announcement. */
export function commandsUpdate(commands: readonly { name: string; description?: string | null; input?: string | null }[]): SessionNotification['update'] {
  return {
    sessionUpdate: 'available_commands_update',
    availableCommands: commands.map((command) => ({
      name: command.name,
      description: command.description ?? '',
      input: command.input === undefined || command.input === null
        ? undefined
        : { hint: command.input },
    })),
  }
}

/**
 * Fold one streamed delta onto the per-(turn,step,index) accumulation and
 * return the wire chunk to send. Deltas of one block concatenate; every
 * already-accumulated prefix was delivered, so the fresh text goes out whole.
 * An empty delta sends nothing.
 */
export function streamTextDelta(
  acc: Map<string, string>,
  key: string,
  text: string,
  chunk: (text: string) => SessionNotification['update'],
): SessionNotification['update'] | undefined {
  if (text.length === 0) return undefined
  acc.set(key, (acc.get(key) ?? '') + text)
  return chunk(text)
}

/**
 * Drop every accumulation whose key starts with `prefix`. A replacement
 * assistant attempt (`agent/assistant-stream` start / abandoned end) restarts
 * its delta indices for the same turn/step, so the previous attempt's
 * accumulations must not survive into the committed-block remainder check.
 */
function clearStreamKeys(acc: Map<string, string>, prefix: string): void {
  for (const key of [...acc.keys()]) {
    if (key.startsWith(prefix)) acc.delete(key)
  }
}

/** The live-frame shape the bridge folds; structural, so tests need no harness. */
export type LiveStreamChunk = { type: string; index?: number; text?: string }
/** One `agent/assistant-stream` publication (dsh 0.1.5-rc.1 Agent event). */
export type LiveStreamFrame =
  | { type: 'start'; attemptId: string; turn: number; step: number }
  | { type: 'chunk'; attemptId: string; chunk: LiveStreamChunk }
  | { type: 'end'; attemptId: string; outcome: { kind: 'committed' } | { kind: 'abandoned' } }

/** Mutable live-stream bookkeeping owned by one session record. */
export interface LiveStreamState {
  /** Attempt id -> the turn/step its start frame named (only start carries them). */
  attempts: Map<string, { turn: number; step: number }>
  /** Streamed text per `turn:step:block` (delta accumulation). */
  text: Map<string, string>
  /** Streamed reasoning per `turn:step:block` (delta accumulation). */
  reasoning: Map<string, string>
}

/**
 * Fold one live Assistant frame into the record's stream state and return the
 * chunk to stream with its owning turn/step, when there is one.
 *
 * A start frame records the attempt (and clears the turn/step's previous
 * accumulations: a retry/replacement attempt restarts its delta indices, and
 * keeping the abandoned text would make the committed-block remainder check
 * compare against the wrong prefix and send nothing). An end frame forgets the
 * attempt, and an abandoned end additionally drops its accumulations. Chunks
 * of an unknown attempt (a record created after its start, or a frame that
 * raced teardown) are ignored.
 */
export function foldStreamFrame(
  state: LiveStreamState,
  frame: LiveStreamFrame,
): { turn: number; step: number; chunk: LiveStreamChunk } | undefined {
  if (frame.type === 'start') {
    const prefix = `${frame.turn}:${frame.step}:`
    clearStreamKeys(state.text, prefix)
    clearStreamKeys(state.reasoning, prefix)
    state.attempts.set(frame.attemptId, { turn: frame.turn, step: frame.step })
    return undefined
  }
  const attempt = state.attempts.get(frame.attemptId)
  if (frame.type === 'end') {
    state.attempts.delete(frame.attemptId)
    if (frame.outcome.kind === 'abandoned' && attempt !== undefined) {
      const prefix = `${attempt.turn}:${attempt.step}:`
      clearStreamKeys(state.text, prefix)
      clearStreamKeys(state.reasoning, prefix)
    }
    return undefined
  }
  return attempt === undefined ? undefined : { turn: attempt.turn, step: attempt.step, chunk: frame.chunk }
}

/**
 * Decide what still needs delivering when a committed block lands: blocks that
 * never streamed go whole; streamed blocks only resend the missing tail; a
 * mismatch (stream and commit diverged) sends nothing rather than duplicating.
 */
export function committedBlockRemainder(
  acc: Map<string, string>,
  key: string,
  fullText: string,
): string | undefined {
  const streamed = acc.get(key)
  if (streamed === undefined) return fullText.length > 0 ? fullText : undefined
  if (fullText.startsWith(streamed)) {
    const tail = fullText.slice(streamed.length)
    return tail.length > 0 ? tail : undefined
  }
  return undefined
}

/**
 * Terminal tool-call card content: one content block, truncated so a huge raw
 * result cannot flood the client frame.
 */
export function toolCallContent(text: string): { type: 'content'; content: { type: 'text'; text: string } }[] | undefined {
  const maxChars = 8000
  const trimmed = text.length > maxChars ? `${text.slice(0, maxChars)}\n… [truncated]` : text
  if (trimmed.length === 0) return undefined
  return [{ type: 'content', content: { type: 'text', text: trimmed } }]
}

/**
 * Wrap text in one markdown code fence, so the client renders it as a
 * monospace block (Zed renders rawInput strings as markdown verbatim). The
 * fence grows past any backtick run inside the text, so fence-collision
 * cannot break the block. Trailing newlines are dropped (the closing fence
 * replaces them); an empty input stays an honest empty block.
 */
export function codeFence(text: string, info = ''): string {
  const body = text.replace(/\n+$/, '')
  const fence = '`'.repeat(Math.max(3, ...(body.match(/`+/g) ?? []).map((run) => run.length + 1)))
  return `${fence}${info}\n${body}\n${fence}`
}

/**
 * Structured diff card content (ACP `ToolCallContent {type: 'diff'}`): the
 * client renders a real diff view instead of raw tool text. The model-facing
 * confirmation text still rides alongside, so clients without diff support
 * degrade to the plain text card. Paths are absolutized against the session
 * cwd (the diff vocabulary uses the model-facing, possibly relative path).
 */
export function toolCallDiffContent(
  diffs: readonly { path: string; oldText: string | null; newText: string }[],
  cwd: string,
): { type: 'diff'; path: string; oldText?: string | null; newText: string }[] {
  return diffs.map((diff) => ({
    type: 'diff' as const,
    path: isAbsolute(diff.path) ? diff.path : resolve(cwd, diff.path),
    ...(diff.oldText !== null ? { oldText: diff.oldText } : {}),
    newText: diff.newText,
  }))
}

/**
 * Fold a session log's todo history into ONE final plan update:
 * `todo/write` replaces the whole table (last write wins) and `turn/start`
 * clears it. Returns undefined when nothing ever rendered a plan — callers
 * then send nothing (replay never fabricates frames).
 */
export function foldTodoPlan(events: readonly SessionEvent[]): readonly { content: string; status: 'pending' | 'in_progress' | 'completed' }[] | undefined {
  let current: TodoItem[] | undefined
  for (const event of events) {
    if (event.type === 'todo/write') current = event.data.todos
    else if (event.type === 'turn/start') current = []
  }
  if (current === undefined || current.length === 0) return undefined
  return current
}

/**
 * The `session/request_permission` request for one bridge-owned tool call:
 * allow-once / allow-always / reject, per the design's one-shot permission
 * answerer. An allow-always pick is honored bridge-side for the rest of the
 * session (dsh's approval vocabulary is one-shot; see the approval/request
 * answerer in the bridge module).
 */
export function requestPermissionRequest(sessionId: string, toolCallId: string): {
  sessionId: string
  toolCall: { toolCallId: string }
  options: { optionId: string; name: string; kind: 'allow_once' | 'allow_always' | 'reject_once' }[]
} {
  return {
    sessionId,
    toolCall: { toolCallId },
    options: [
      { optionId: 'allow-once', name: 'Allow once', kind: 'allow_once' },
      { optionId: 'allow-always', name: 'Always allow', kind: 'allow_always' },
      { optionId: 'reject-once', name: 'Reject', kind: 'reject_once' },
    ],
  }
}

/**
 * The v1 `elicitation/create` form request for one ask_user_question call:
 * single-select questions become string enums, multi-select become string
 * arrays, every option question gains an `__other` free-text sibling, and
 * option-less questions are required. Field name per the v1 schema:
 * `requestedSchema` (not the legacy `schema`).
 */
export function elicitationRequestFor(
  request: { questions: readonly { id: string; question: string; detail?: string; options?: readonly { label: string }[]; multiSelect?: boolean }[] },
  sessionId: string,
  toolCallId: string | undefined,
): {
  mode: 'form'
  sessionId: string
  toolCallId?: string
  message: string
  requestedSchema: { type: 'object'; properties: Record<string, unknown>; required: string[] }
} {
  const properties: Record<string, unknown> = {}
  const required: string[] = []
  const messages: string[] = []
  for (const item of request.questions) {
    messages.push(item.question)
    const base = {
      title: item.question,
      ...(item.detail !== undefined && item.detail.length > 0 ? { description: item.detail } : {}),
    }
    const options = item.options ?? []
    if (options.length > 0) {
      const labels = options.map((option) => option.label)
      properties[item.id] = item.multiSelect === true
        ? { type: 'array', items: { type: 'string', enum: labels }, ...base }
        : { type: 'string', enum: labels, ...base }
      properties[`${item.id}__other`] = { type: 'string', title: 'Other' }
    } else {
      properties[item.id] = { type: 'string', ...base }
      required.push(item.id)
    }
  }
  return {
    mode: 'form',
    sessionId,
    ...(toolCallId !== undefined ? { toolCallId } : {}),
    message: messages.join(' '),
    requestedSchema: { type: 'object', properties, required },
  }
}
