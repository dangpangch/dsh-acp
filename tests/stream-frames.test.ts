// Live assistant stream frames: the 0.1.5-rc.1 `agent/assistant-stream`
// start/chunk/end fold (design.zh.md §3.3). The reducer is pure so the
// interesting rules — attempt-scoped turn/step resolution, replacement-attempt
// resets, abandoned-attempt cleanup — are testable without a harness.
import { describe, expect, it } from 'vitest'
import {
  foldStreamFrame,
  type LiveStreamState,
} from '../src/bridge/updates.js'

const state = (): LiveStreamState => ({
  attempts: new Map(),
  text: new Map(),
  reasoning: new Map(),
})

const start = (attemptId: string, turn: number, step: number) => ({ type: 'start', attemptId, turn, step }) as const
const chunk = (attemptId: string, text: string, index = 0) =>
  ({ type: 'chunk', attemptId, chunk: { type: 'text-delta', index, text } }) as const

describe('foldStreamFrame', () => {
  it('records the attempt on start and streams nothing', () => {
    const s = state()
    expect(foldStreamFrame(s, start('a1', 2, 3))).toBeUndefined()
    expect(s.attempts.get('a1')).toEqual({ turn: 2, step: 3 })
  })

  it('resolves a chunk through the attempt recorded by its start frame', () => {
    const s = state()
    foldStreamFrame(s, start('a1', 2, 3))
    expect(foldStreamFrame(s, chunk('a1', 'hi'))).toEqual({
      turn: 2,
      step: 3,
      chunk: { type: 'text-delta', index: 0, text: 'hi' },
    })
  })

  it('ignores a chunk whose attempt never started', () => {
    expect(foldStreamFrame(state(), chunk('ghost', 'hi'))).toBeUndefined()
  })

  it('forgets the attempt on end, so a later chunk is ignored', () => {
    const s = state()
    foldStreamFrame(s, start('a1', 0, 0))
    foldStreamFrame(s, { type: 'end', attemptId: 'a1', outcome: { kind: 'committed' } })
    expect(s.attempts.has('a1')).toBe(false)
    expect(foldStreamFrame(s, chunk('a1', 'late'))).toBeUndefined()
  })

  it('clears the same turn/step accumulations when a replacement attempt starts', () => {
    const s = state()
    foldStreamFrame(s, start('a1', 0, 0))
    s.text.set('0:0:0', 'abandoned text')
    s.reasoning.set('0:0:0', 'abandoned reasoning')
    s.text.set('0:1:0', 'other step')
    foldStreamFrame(s, start('a2', 0, 0))
    expect(s.text.has('0:0:0')).toBe(false)
    expect(s.reasoning.has('0:0:0')).toBe(false)
    // A different step of the same turn is untouched.
    expect(s.text.get('0:1:0')).toBe('other step')
  })

  it('clears accumulations on an abandoned end but keeps them on a committed end', () => {
    const committed = state()
    foldStreamFrame(committed, start('a1', 0, 0))
    committed.text.set('0:0:0', 'kept')
    foldStreamFrame(committed, { type: 'end', attemptId: 'a1', outcome: { kind: 'committed' } })
    expect(committed.text.get('0:0:0')).toBe('kept')

    const abandoned = state()
    foldStreamFrame(abandoned, start('a2', 0, 0))
    abandoned.text.set('0:0:0', 'dropped')
    abandoned.reasoning.set('0:0:0', 'dropped')
    foldStreamFrame(abandoned, { type: 'end', attemptId: 'a2', outcome: { kind: 'abandoned' } })
    expect(abandoned.text.has('0:0:0')).toBe(false)
    expect(abandoned.reasoning.has('0:0:0')).toBe(false)
  })

  it('keeps per-step attempts independent', () => {
    const s = state()
    foldStreamFrame(s, start('a1', 0, 0))
    foldStreamFrame(s, chunk('a1', 'one'))
    foldStreamFrame(s, { type: 'end', attemptId: 'a1', outcome: { kind: 'committed' } })
    foldStreamFrame(s, start('a2', 0, 1))
    expect(foldStreamFrame(s, chunk('a2', 'two'))?.step).toBe(1)
  })
})
