// Durable-history replay conversion: stored dsh session events -> ACP wire
// updates for `session/load` (the SDK contract streams the conversation back
// to the client; `session/resume` deliberately does not replay). Only
// committed, model-visible facts travel: assistant text/reasoning blocks, tool
// calls and their terminal updates, and (via foldTodoPlan) one final plan
// state. Raw deltas, usage, titles, and private presentation data stay out —
// mirroring the live-path rules in updates.ts.
//
// Pure and dependency-free (dsh-session types + sdk types only) so the whole
// mapping is unit-testable offline.
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import type { SessionNotification } from '@agentclientprotocol/sdk'
import { assistantTextChunk, assistantThoughtChunk, foldTodoPlan, toolCallContent } from './updates.js'

/** Coarse ACP tool-kind classification (same table as the live path). */
function toolKindFor(name: string): 'execute' | 'edit' | 'search' | 'read' | 'delete' | 'think' | 'other' {
  if (name === 'bash' || name === 'pwsh') return 'execute'
  if (name === 'write' || name === 'edit' || name === 'str_replace' || name === 'str_replace_editor') return 'edit'
  if (name === 'read_image' || name === 'read') return 'read'
  if (name.startsWith('search') || name === 'grep' || name === 'glob' || name === 'fs_search') return 'search'
  if (name.includes('delete') || name === 'rm') return 'delete'
  return 'other'
}

/** Raw tool-argument JSON as displayed input (unparsable stays verbatim). */
function rawInputOf(argumentsJson: string): unknown {
  try {
    return JSON.parse(argumentsJson)
  } catch {
    return argumentsJson
  }
}

/** First tool-result call id + concatenated visible text of a result message. */
function toolResultCall(message: { content: readonly unknown[] }): { callId: string; text: string } {
  let callId = ''
  let text = ''
  const collect = (blocks: readonly { type?: string; text?: string; toolCallId?: string; content?: unknown }[]) => {
    for (const block of blocks) {
      if (block.type === 'text') text += block.text ?? ''
      else if (block.type === 'tool-result') {
        if (callId === '') callId = block.toolCallId ?? ''
        if (Array.isArray(block.content)) collect(block.content as { type?: string; text?: string; toolCallId?: string; content?: unknown }[])
      }
    }
  }
  collect(message.content as { type?: string; text?: string; toolCallId?: string; content?: unknown }[])
  return { callId, text }
}

/**
 * Map one stored session event to the wire updates a `session/load` replay
 * should send. Assistant committed content streams whole (replay never
 * re-streams raw deltas); image blocks degrade to a bracketed placeholder.
 * Returns an empty array for events with no client-visible face.
 */
export function replayUpdatesForEvent(event: SessionEvent): SessionNotification['update'][] {
  switch (event.type) {
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
    case 'tool/call':
      return [{
        sessionUpdate: 'tool_call',
        toolCallId: String(event.data.callId),
        title: event.data.name,
        name: event.data.name,
        kind: toolKindFor(event.data.name),
        status: 'pending',
        rawInput: rawInputOf(event.data.arguments),
      }]
    case 'tool/result': {
      const { callId, text } = toolResultCall(event.data.message)
      if (callId === '') return []
      const isError = event.data.error !== undefined
      return [{
        sessionUpdate: 'tool_call_update',
        toolCallId: callId,
        status: isError ? 'failed' : 'completed',
        ...(text.length > 0 ? { content: toolCallContent(text) } : {}),
      }]
    }
    default:
      return []
  }
}

/**
 * The one plan update a replay ends with (todo history folded to its final
 * state), or undefined when the log never rendered a plan — replay never
 * fabricates frames.
 */
export function replayPlanFold(events: readonly SessionEvent[]): SessionNotification['update'] | undefined {
  const entries = foldTodoPlan(events)
  if (entries === undefined || entries.length === 0) return undefined
  return { sessionUpdate: 'plan', entries: entries.map((entry) => ({ content: entry.content, priority: 'medium', status: entry.status })) }
}
