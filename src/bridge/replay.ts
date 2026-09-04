// Durable-history replay conversion: stored dsh session events -> ACP wire
// updates for `session/load` (the SDK contract streams the conversation back
// to the client; `session/resume` deliberately does not replay). Only
// committed, model-visible facts travel: user prompts (source 'user' only —
// injected contexts and compaction checkpoints are not conversation turns a
// client should re-render), assistant text/reasoning blocks, tool calls and
// their terminal updates, and (via foldTodoPlan) one final plan state. Raw
// deltas, usage, titles, and private presentation data stay out — mirroring
// the live-path rules in updates.ts.
//
// Tool cards reproduce the live shapes exactly: the follow-along location
// from the call arguments (no line inference — the file has moved on since
// the logged call), and the structured diff from the persisted result meta
// or the call's own arguments. Pure and dependency-free (dsh-session types +
// sdk types only) so the whole mapping is unit-testable offline.
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import type { SessionNotification } from '@agentclientprotocol/sdk'
import { assistantTextChunk, assistantThoughtChunk, foldTodoPlan, planUpdate, toolCallContent, toolCallDiffContent, userMessageChunk } from './updates.js'
import { diffForToolCall, rawInputOf, toolCallLocation, toolCallTitle, toolKindFor, toolResultCall } from './tool-cards.js'
/** Replay context per call id: the pairing a live session keeps in the firehose. */
interface ReplayCall {
  name: string
  rawInput: unknown
}

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
export function replayUpdatesForEvent(
  event: SessionEvent,
  context: { cwd: string; calls: ReadonlyMap<string, ReplayCall> },
): SessionNotification['update'][] {
  switch (event.type) {
    case 'user/message': {
      const message = event.data as { source?: { kind?: string }; content?: unknown }
      if (message.source?.kind !== 'user') return []
      const updates: SessionNotification['update'][] = []
      const blocks = (message.content ?? []) as readonly {
        type?: string
        text?: string
        image?: { name?: string; mediaType?: string }
      }[]
      for (const block of blocks) {
        if (block.type === 'text' && block.text !== undefined && block.text.length > 0) {
          updates.push(userMessageChunk(block.text, String(event.seq)))
        } else if (block.type === 'image') {
          const name = (block.image as { name?: string } | undefined)?.name
          const mediaType = (block.image as { mediaType?: string } | undefined)?.mediaType ?? 'image'
          updates.push(userMessageChunk(`[image: ${name ?? mediaType}]`, String(event.seq)))
        }
      }
      return updates
    }
    case 'assistant/message': {
      const updates: SessionNotification['update'][] = []
      const content = event.data.message.content as readonly {
        type?: string
        text?: string
        image?: { name?: string; mediaType?: string }
        attachment?: unknown
      }[]
      for (const block of content ?? []) {
        if (block.type === 'text' && block.text !== undefined && block.text.length > 0) {
          updates.push(assistantTextChunk(block.text))
        } else if (block.type === 'reasoning' && block.text !== undefined && block.text.length > 0) {
          updates.push(assistantThoughtChunk(block.text))
        } else if (block.type === 'image') {
          const name = (block.image as { name?: string } | undefined)?.name
          const mediaType = (block.image as { mediaType?: string } | undefined)?.mediaType ?? 'image'
          updates.push(assistantTextChunk(`[image: ${name ?? mediaType}]`))
        }
      }
      return updates
    }
    case 'tool/call': {
      const rawInput = rawInputOf(event.data.arguments)
      const kind = toolKindFor(event.data.name)
      const location = toolCallLocation(rawInput, context.cwd)
      return [{
        sessionUpdate: 'tool_call',
        toolCallId: String(event.data.callId),
        title: toolCallTitle(kind, event.data.name, rawInput),
        name: event.data.name,
        kind,
        status: 'pending',
        rawInput,
        ...(location !== undefined ? { locations: [location] } : {}),
      }]
    }
    case 'tool/result': {
      const { callId, text } = toolResultCall(event.data.message)
      if (callId === '') return []
      const isError = event.data.error !== undefined
      const call = context.calls.get(callId)
      const diffs = diffForToolCall(call?.name ?? '', call?.rawInput, event.data.meta, isError)
      const textContent = toolCallContent(text)
      const content = diffs === undefined
        ? textContent
        : [...toolCallDiffContent(diffs, context.cwd), ...textContent ?? []]
      return [{
        sessionUpdate: 'tool_call_update',
        toolCallId: callId,
        status: isError ? 'failed' : 'completed',
        ...(content !== undefined ? { content } : {}),
      }]
    }
    default:
      return []
  }
}
