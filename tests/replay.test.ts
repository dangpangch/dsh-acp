// replay: durable session history -> wire update conversion for session/load
// (design.zh.md §4 `session-list-load`; design §6.2). Pure mapping tests:
// committed assistant content streams whole, direct user prompts replay as
// user_message_chunk (synthetic user-role contexts stay out), tool cards
// reproduce (with follow-along locations and structured diffs), todo history
// folds to one final plan, raw deltas never leak.
import { describe, expect, it } from 'vitest'
import { SessionSeq, type SessionEvent, type SessionEventMap } from '@deepseek-ai/dsh-session'
import { foldTodoPlan, planUpdate } from '../src/bridge/updates.js'
import { replayUpdatesForEvent } from '../src/bridge/replay.js'
import { rawInputOf } from '../src/bridge/tool-cards.js'

/** Minimal session event fixture (payloads are intentionally untyped shapes). */
function event(type: keyof SessionEventMap, data: unknown): SessionEvent {
  return { type, seq: 0, time: 0, data } as unknown as SessionEvent
}

/** Replay context: call-id pairing built as the log walks, like the bridge. */
class Calls {
  private readonly map = new Map<string, { name: string; rawInput: unknown }>()
  add(callEvent: SessionEvent): void {
    if (callEvent.type !== 'tool/call') return
    const data = callEvent.data as { callId: unknown; name: string; arguments: string }
    this.map.set(String(data.callId), { name: data.name, rawInput: rawInputOf(data.arguments) })
  }
  readonly view = { cwd: '/ws', calls: this.map }
}

function replay(events: readonly SessionEvent[]): { calls: Calls; updatesFor(callEvent: SessionEvent): ReturnType<typeof replayUpdatesForEvent> } {
  const calls = new Calls()
  for (const one of events) calls.add(one)
  return { calls, updatesFor: (callEvent: SessionEvent) => replayUpdatesForEvent(callEvent, calls.view) }
}

describe('replayUpdatesForEvent', () => {
  const ctx = { cwd: '/ws', calls: new Map<string, { name: string; rawInput: unknown }>() }

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
    }), ctx)
    expect(updates).toEqual([
      { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'hello' } },
      { sessionUpdate: 'agent_thought_chunk', content: { type: 'text', text: 'thinking...' } },
    ])
  })

  it('replays a direct user prompt as user_message_chunk (messageId from seq)', () => {
    const userEvent = event('user/message', {
      content: [{ type: 'text', text: 'fix the bug' }],
      source: { kind: 'user' },
    }) as SessionEvent & { seq: number }
    userEvent.seq = SessionSeq(7)
    const updates = replayUpdatesForEvent(userEvent, ctx)
    expect(updates).toEqual([
      { sessionUpdate: 'user_message_chunk', content: { type: 'text', text: 'fix the bug' }, messageId: '7' },
    ])
  })

  it('groups one user message\'s blocks under a shared messageId and degrades images', () => {
    const userEvent = event('user/message', {
      content: [
        { type: 'text', text: 'look at this' },
        { type: 'image', image: { name: 'shot.png', mediaType: 'image/png' } },
      ],
      source: { kind: 'user' },
    }) as SessionEvent & { seq: number }
    userEvent.seq = SessionSeq(3)
    const updates = replayUpdatesForEvent(userEvent, ctx)
    expect(updates).toEqual([
      { sessionUpdate: 'user_message_chunk', content: { type: 'text', text: 'look at this' }, messageId: '3' },
      { sessionUpdate: 'user_message_chunk', content: { type: 'text', text: '[image: shot.png]' }, messageId: '3' },
    ])
  })

  it('stays silent for synthetic user-role events (injected contexts, goal rounds, compaction checkpoints)', () => {
    for (const source of [
      { kind: 'plugin', plugin: 'dsh-agent-instructions', form: 'instructions' },
      { kind: 'goal', goalId: 'g', revision: 1, round: 2 },
      { kind: 'plugin', plugin: 'compact', compactionId: 'c1' },
    ]) {
      const updates = replayUpdatesForEvent(event('user/message', {
        content: [{ type: 'text', text: 'synthetic context' }],
        source,
      }), ctx)
      expect(updates).toEqual([])
    }
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
    }), ctx)
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
    }), ctx)
    expect(updates[0]).toMatchObject({
      sessionUpdate: 'tool_call',
      toolCallId: 'call-1',
      title: 'bash ls',
      name: 'bash',
      kind: 'other',
      status: 'pending',
      rawInput: '```sh\n/ws $ ls\n```',
    })
  })

  it('carries the concrete command in the bash card title (read-style fold-out)', () => {
    const updates = replayUpdatesForEvent(event('tool/call', {
      turn: 0,
      step: 0,
      callId: 'call-9',
      name: 'bash',
      arguments: JSON.stringify({ command: 'git status --short' }),
    }), ctx)
    expect(updates[0]).toMatchObject({ sessionUpdate: 'tool_call', title: 'bash git status --short', kind: 'other' })
  })

  it('follows along with an absolute location for file tools (read window line)', () => {
    const updates = replayUpdatesForEvent(event('tool/call', {
      turn: 0,
      step: 0,
      callId: 'call-2',
      name: 'read',
      arguments: JSON.stringify({ file_path: 'src/a.ts', offset: 4, limit: 10 }),
    }), { cwd: '/ws', calls: new Map() })
    expect(updates[0]).toMatchObject({
      kind: 'read',
      locations: [{ path: '/ws/src/a.ts', line: 4 }],
    })
  })

  it('completes tool calls with result text (truncated content), failed on error', () => {
    const { updatesFor } = replay([event('tool/call', {
      turn: 0,
      step: 0,
      callId: 'call-1',
      name: 'bash',
      arguments: JSON.stringify({ command: 'ls' }),
    })])
    const updates = updatesFor(event('tool/result', {
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
      content: [{ type: 'content', content: { type: 'text', text: '```\nresult\n```' } }],
    })
    const failed = updatesFor(event('tool/result', {
      turn: 0,
      step: 0,
      message: { content: [{ type: 'tool-result', toolCallId: 'call-2', content: [] }] },
      error: { name: 'E', code: 'X' },
    }))
    expect(failed[0]).toMatchObject({ sessionUpdate: 'tool_call_update', toolCallId: 'call-2', status: 'failed' })
  })

  it('fences tool-run output for command and read tools alike', () => {
    const bash = replay([event('tool/call', {
      turn: 0, step: 0, callId: 'c1', name: 'bash',
      arguments: JSON.stringify({ command: 'cat hello.txt', description: 'Show file contents' }),
    })])
    const bashUpdates = bash.updatesFor(event('tool/result', {
      turn: 0, step: 0,
      message: { content: [{ type: 'tool-result', toolCallId: 'c1', content: [{ type: 'text', text: 'hello\n' }] }] },
    }))
    expect(bashUpdates[0]).toMatchObject({
      content: [{ type: 'content', content: { type: 'text', text: '```\nhello\n```' } }],
    })

    const read = replay([event('tool/call', {
      turn: 0, step: 0, callId: 'c2', name: 'read',
      arguments: JSON.stringify({ file_path: 'a.ts' }),
    })])
    const readUpdates = read.updatesFor(event('tool/result', {
      turn: 0, step: 0,
      message: { content: [{ type: 'tool-result', toolCallId: 'c2', content: [{ type: 'text', text: '<path>/ws/a.ts</path>\n<type>file</type>\n<content>\nplain\n</content>' }] }] },
    }))
    expect(readUpdates[0]).toMatchObject({
      content: [{ type: 'content', content: { type: 'text', text: '```\nplain\n```' } }],
    })
  })

  it('renders a structured diff card from the persisted result meta (edit hunks)', () => {
    const callEvent = event('tool/call', {
      turn: 0,
      step: 0,
      callId: 'call-5',
      name: 'edit',
      arguments: JSON.stringify({ file_path: 'src/b.ts', old_string: 'a', new_string: 'b' }),
    })
    const { calls, updatesFor } = replay([callEvent])
    const updates = updatesFor(event('tool/result', {
      turn: 0,
      step: 0,
      message: { content: [{ type: 'tool-result', toolCallId: 'call-5', content: [{ type: 'text', text: 'done' }] }] },
      meta: { diffs: [{ path: 'src/b.ts', oldText: 'ctx\na\n', newText: 'ctx\nb\n' }] },
    }))
    expect(updates[0]).toMatchObject({
      sessionUpdate: 'tool_call_update',
      status: 'completed',
      content: [
        { type: 'diff', path: '/ws/src/b.ts', oldText: 'ctx\na\n', newText: 'ctx\nb\n' },
        { type: 'content', content: { type: 'text', text: '```\ndone\n```' } },
      ],
    })
    expect(calls.view.calls.get('call-5')).toEqual({ name: 'edit', rawInput: { file_path: 'src/b.ts', old_string: 'a', new_string: 'b' } })
  })

  it('falls back to the arguments-described diff when no meta was persisted (str_replace_editor)', () => {
    const { updatesFor } = replay([event('tool/call', {
      turn: 0,
      step: 0,
      callId: 'call-6',
      name: 'str_replace_editor',
      arguments: JSON.stringify({ command: 'create', path: 'new.ts', file_text: 'hi' }),
    })])
    const updates = updatesFor(event('tool/result', {
      turn: 0,
      step: 0,
      message: { content: [{ type: 'tool-result', toolCallId: 'call-6', content: [{ type: 'text', text: 'created' }] }] },
    }))
    expect(updates[0]).toMatchObject({
      content: [
        { type: 'diff', path: '/ws/new.ts', newText: 'hi' }, // no oldText on a create
        { type: 'content', content: { type: 'text', text: '```\ncreated\n```' } },
      ],
    })
  })

  it('sends the diff card alone when the tool result carried no visible text', () => {
    const { updatesFor } = replay([event('tool/call', {
      turn: 0,
      step: 0,
      callId: 'call-7',
      name: 'edit',
      arguments: JSON.stringify({ file_path: 'a.ts', old_string: 'x', new_string: 'y' }),
    })])
    const updates = updatesFor(event('tool/result', {
      turn: 0,
      step: 0,
      message: { content: [{ type: 'tool-result', toolCallId: 'call-7', content: [] }] },
      meta: { diffs: [{ path: 'a.ts', oldText: 'x', newText: 'y' }] },
    }))
    expect(updates[0]).toMatchObject({
      sessionUpdate: 'tool_call_update',
      content: [{ type: 'diff', path: '/ws/a.ts', oldText: 'x', newText: 'y' }],
    })
  })

  it('emits nothing for non-visual events (turn boundaries, deltas, usage)', () => {
    expect(replayUpdatesForEvent(event('turn/start', { turn: 0 }), ctx)).toEqual([])
    expect(replayUpdatesForEvent(event('turn/end', { turn: 0, reason: { kind: 'completed' } }), ctx)).toEqual([])
    expect(replayUpdatesForEvent(event('todo/write', { todos: [] }), ctx)).toEqual([])
  })
})
