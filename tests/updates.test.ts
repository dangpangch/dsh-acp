// updates: semantic update wire shapes + replay folds (acceptance.md §4
// `plan-update`/`usage-update`; design.zh.md §6.2).
import { describe, expect, it } from 'vitest'
import type { SessionEvent, SessionEventMap, TodoItem } from '@deepseek-ai/dsh-session'
import {
  assistantTextChunk,
  assistantThoughtChunk,
  commandsUpdate,
  committedBlockRemainder,
  foldTodoPlan,
  planUpdate,
  sessionNotification,
  streamTextDelta,
  toolCallContent,
  usageUpdate,
} from '../src/bridge/updates.js'

/** Minimal session event fixture for fold tests. */
function event<T extends keyof SessionEventMap>(type: T, data: SessionEventMap[T]): SessionEvent<T> {
  return { type, seq: 0, time: 0, data } as SessionEvent<T>
}

describe('wire builders', () => {
  it('wraps updates into session/update notifications carrying the session id', () => {
    expect(sessionNotification('s1', assistantTextChunk('hi'))).toEqual({
      sessionId: 's1',
      update: { sessionUpdate: 'agent_message_chunk', content: { type: 'text', text: 'hi' } },
    })
  })

  it('sends committed assistant text as a single text content chunk', () => {
    expect(assistantTextChunk('hello')).toEqual({
      sessionUpdate: 'agent_message_chunk',
      content: { type: 'text', text: 'hello' },
    })
  })

  it('plan updates carry the full entry list with the fixed medium priority', () => {
    expect(planUpdate([{ content: 'a', status: 'in_progress' }, { content: 'b', status: 'pending' }])).toEqual({
      sessionUpdate: 'plan',
      entries: [
        { content: 'a', priority: 'medium', status: 'in_progress' },
        { content: 'b', priority: 'medium', status: 'pending' },
      ],
    })
  })

  it('usage updates carry used/size', () => {
    expect(usageUpdate(1200, 65536)).toEqual({ sessionUpdate: 'usage_update', used: 1200, size: 65536 })
  })

  it('command announcements use availableCommands with required descriptions', () => {
    expect(commandsUpdate([{ name: 'compact', description: 'Compress the transcript', input: 'optional' }])).toEqual({
      sessionUpdate: 'available_commands_update',
      availableCommands: [{ name: 'compact', description: 'Compress the transcript', input: { hint: 'optional' } }],
    })
    expect(commandsUpdate([{ name: 'goal' }])).toEqual({
      sessionUpdate: 'available_commands_update',
      availableCommands: [{ name: 'goal', description: '', input: undefined }],
    })
  })
})

describe('foldTodoPlan (load replay: todo history collapses to ONE final plan)', () => {
  const todos = (list: TodoItem[]) => event('todo/write', { todos: list })
  const turnStart = () => event('turn/start', { turn: 1 })

  it('returns the last whole-table write', () => {
    const folded = foldTodoPlan([
      todos([{ content: 'first', status: 'completed' }]),
      todos([{ content: 'second', status: 'in_progress' }]),
    ])
    expect(folded).toEqual([{ content: 'second', status: 'in_progress' }])
  })

  it('turn/start clears the table (completed lists hide on a new turn)', () => {
    const folded = foldTodoPlan([
      todos([{ content: 'done', status: 'completed' }]),
      turnStart(),
    ])
    expect(folded).toBeUndefined()
  })

  it('a write after the clearing turn/start wins', () => {
    const folded = foldTodoPlan([
      todos([{ content: 'old', status: 'completed' }]),
      turnStart(),
      todos([{ content: 'fresh', status: 'in_progress' }]),
    ])
    expect(folded).toEqual([{ content: 'fresh', status: 'in_progress' }])
  })

  it('sessions that never wrote a plan fold to nothing (no fabricated frames)', () => {
    expect(foldTodoPlan([turnStart(), event('turn/end', { turn: 1, reason: { kind: 'completed' } })])).toBeUndefined()
    expect(foldTodoPlan([])).toBeUndefined()
  })
})

describe('delta streaming (dedupe against committed messages)', () => {
  it('streams only fresh suffixes of one block as it accumulates', () => {
    const acc = new Map<string, string>()
    const first = streamTextDelta(acc, '1:1:0', 'Hel', assistantTextChunk)
    const second = streamTextDelta(acc, '1:1:0', 'lo wor', assistantTextChunk)
    const third = streamTextDelta(acc, '1:1:0', 'ld', assistantTextChunk)
    expect(first).toEqual(assistantTextChunk('Hel'))
    expect(second).toEqual(assistantTextChunk('lo wor'))
    expect(third).toEqual(assistantTextChunk('ld'))
  })

  it('skips empty deltas and treats reasoning deltas separately', () => {
    const acc = new Map<string, string>()
    expect(streamTextDelta(acc, '1:1:0', '', assistantTextChunk)).toBeUndefined()
    const reasoning = streamTextDelta(acc, '1:1:0', 'think', assistantThoughtChunk)
    expect(reasoning).toEqual(assistantThoughtChunk('think'))
  })

  it('committed blocks resend only the unstreamed tail', () => {
    const acc = new Map<string, string>()
    streamTextDelta(acc, '1:1:0', 'Hel', assistantTextChunk)
    expect(committedBlockRemainder(acc, '1:1:0', 'Hello')).toBe('lo')
    expect(committedBlockRemainder(acc, '1:1:0', 'Hello wor')).toBe('lo wor')
    expect(committedBlockRemainder(acc, '1:1:0', 'Hello')).toBe('lo') // repeat read is stable
    streamTextDelta(acc, '1:1:0', 'lo wor', assistantTextChunk)
    expect(committedBlockRemainder(acc, '1:1:0', 'Hello wor')).toBeUndefined() // fully streamed
  })

  it('never duplicates when stream and commit diverge', () => {
    const acc = new Map<string, string>()
    streamTextDelta(acc, '1:1:0', 'Hel', assistantTextChunk)
    expect(committedBlockRemainder(acc, '1:1:0', 'Different text')).toBeUndefined()
  })

  it('committed blocks without any streamed deltas go whole', () => {
    expect(committedBlockRemainder(new Map(), '9:9:0', 'whole')).toBe('whole')
    expect(committedBlockRemainder(new Map(), '9:9:0', '')).toBeUndefined()
  })

  it('tool card content truncates huge results and keeps empty results off the wire', () => {
    const content = toolCallContent('x'.repeat(10_000))
    expect(content).toBeDefined()
    const text = (content![0] as { content: { text: string } }).content.text
    expect(text.length).toBeLessThan(8_200)
    expect(text.endsWith('… [truncated]')).toBe(true)
    expect(toolCallContent('')).toBeUndefined()
  })
})
