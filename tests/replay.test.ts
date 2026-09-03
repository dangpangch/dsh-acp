// replay: durable session history -> wire update conversion for session/load
// (acceptance.md §4 `session-list-load`; design §6.1/6.2). Pure mapping tests:
// committed assistant content streams whole, tool cards reproduce, todo
// history folds to one final plan, raw deltas never leak.
import { describe, expect, it } from 'vitest'
import type { SessionEvent, SessionEventMap } from '@deepseek-ai/dsh-session'
import { replayPlanFold, replayUpdatesForEvent } from '../src/bridge/replay.js'

/** Minimal session event fixture (payloads are intentionally untyped shapes). */
function event(type: keyof SessionEventMap, data: unknown): SessionEvent {
  return { type, seq: 0, time: 0, data } as unknown as SessionEvent
}

describe('replayUpdatesForEvent', () => {
  it('streams committed assistant text and reasoning blocks whole', () => {
    const updates = replayUpdatesForEvent(event('assistant/message', {
      turn: 0,
      step: 0,
      message: {
        content: [
          { type: 'text', text: 'hello' },
          { type: 'reasoning', text: 'thinking...' },
        ],
      },
    }))
    expect(updates).toEqual([
      { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'hello' } },
      { sessionUpdate: 'agent_thought_chunk', content: { type: 'text', text: 'thinking...' } },
    ])
  })

  it('degrades replayed image blocks to a bracketed placeholder', () => {
    const updates = replayUpdatesForEvent(event('assistant/message', {
      turn: 0,
      step: 0,
      message: {
        content: [
          { type: 'image', image: { name: 'shot.png', mediaType: 'image/png' } },
        ],
      },
    }))
    expect(updates).toEqual([
      { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: '[image: shot.png]' } },
    ])
  })

  it('reproduces tool calls as pending cards with parsed raw input', () => {
    const updates = replayUpdatesForEvent(event('tool/call', {
      turn: 0,
      step: 0,
      callId: 'call-1',
      name: 'bash',
      arguments: JSON.stringify({ command: 'ls' }),
    }))
    expect(updates[0]).toMatchObject({
      sessionUpdate: 'tool_call',
      toolCallId: 'call-1',
      title: 'ls',
      name: 'bash',
      kind: 'execute',
      status: 'pending',
      rawInput: { command: 'ls' },
    })
  })

  it('carries the concrete command in the execute-card title (bash card body)', () => {
    const updates = replayUpdatesForEvent(event('tool/call', {
      turn: 0,
      step: 0,
      callId: 'call-9',
      name: 'bash',
      arguments: JSON.stringify({ command: 'git status --short' }),
    }))
    expect(updates[0]).toMatchObject({ sessionUpdate: 'tool_call', title: 'git status --short', kind: 'execute' })
  })

  it('completes tool calls with result text (truncated content), failed on error', () => {
    const updates = replayUpdatesForEvent(event('tool/result', {
      turn: 0,
      step: 0,
      message: {
        content: [
          { type: 'tool-result', toolCallId: 'call-1', content: [{ type: 'text', text: 'result' }] },
        ],
      },
    }))
    expect(updates[0]).toMatchObject({
      sessionUpdate: 'tool_call_update',
      toolCallId: 'call-1',
      status: 'completed',
      content: [{ type: 'content', content: { type: 'text', text: 'result' } }],
    })
    const failed = replayUpdatesForEvent(event('tool/result', {
      turn: 0,
      step: 0,
      message: { content: [{ type: 'tool-result', toolCallId: 'call-2', content: [] }] },
      error: { name: 'E', code: 'X' },
    }))
    expect(failed[0]).toMatchObject({ sessionUpdate: 'tool_call_update', toolCallId: 'call-2', status: 'failed' })
  })

  it('emits nothing for non-visual events (turn boundaries, deltas, usage)', () => {
    expect(replayUpdatesForEvent(event('turn/start', { turn: 0 }))).toEqual([])
    expect(replayUpdatesForEvent(event('turn/end', { turn: 0, reason: { kind: 'completed' } }))).toEqual([])
    expect(replayUpdatesForEvent(event('todo/write', { todos: [] }))).toEqual([])
  })
})

describe('replayPlanFold', () => {
  it('folds todo history into one final plan update', () => {
    const fold = replayPlanFold([
      event('todo/write', { todos: [{ content: 'a', status: 'pending' }] }),
      event('todo/write', { todos: [{ content: 'a', status: 'completed' }, { content: 'b', status: 'in_progress' }] }),
      event('turn/start', { turn: 1 }),
      event('todo/write', { todos: [{ content: 'c', status: 'pending' }] }),
    ])
    expect(fold).toEqual({
      sessionUpdate: 'plan',
      entries: [{ content: 'c', priority: 'medium', status: 'pending' }],
    })
  })

  it('returns nothing when no plan was ever rendered', () => {
    expect(replayPlanFold([event('turn/start', { turn: 0 })])).toBeUndefined()
    expect(replayPlanFold([])).toBeUndefined()
  })
})
