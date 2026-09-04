// Semantic update serialization: committed assistant text / tool lifecycle /
// plan / usage facts — never raw provider deltas or private dsh presentation
// data (docs/design.zh.md §3). Wire variant names follow the v1 `SessionUpdate`
// union exactly (sdk 1.4.0 schema/types.gen.d.ts); delivery ordering
// (per-session serial chain) is the bridge's concern, these are pure builders
// and folds, unit-testable offline.
import type { SessionNotification } from '@agentclientprotocol/sdk'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
// TodoItem and the `todo/write` SessionEventMap entry are owned by the todo
// tool package since dsh 0.1.2 (DSH-0.1.2-A1/R-11); importing the types pulls
// the official module augmentation into the program.
import type { TodoItem } from '@deepseek-ai/dsh-tool-todo'
import { isAbsolute, resolve } from 'node:path'

export type SessionIdLike = string

/** One wire `session/update` notification for a session. */
export function sessionNotification(sessionId: SessionIdLike, update: SessionNotification['update']): SessionNotification {
  return { sessionId, update }
}

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
 * already-accumulated prefix was delivered, so only the fresh suffix goes out.
 */
export function streamTextDelta(
  acc: Map<string, string>,
  key: string,
  text: string,
  chunk: (text: string) => SessionNotification['update'],
): SessionNotification['update'] | undefined {
  const prior = acc.get(key) ?? ''
  const next = prior + text
  acc.set(key, next)
  if (next.length === 0 || !next.startsWith(prior)) return undefined
  return chunk(next.slice(prior.length))
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
