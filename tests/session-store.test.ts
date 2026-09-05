// session-store: single-flight prompt slot, the registry identity guard, and
// the durable model-selection fold (design.zh.md §6.2/§6.3 primitives).
import { describe, expect, it } from 'vitest'
import type { SessionEvent } from '@deepseek-ai/dsh-session'
import { createInflight, lastModelSelection, makeRecord, removeRecord, type PromptInflight, type SessionRecord } from '../src/bridge/session-store.js'

/** Minimal session event fixture (seq/time are irrelevant to the fold). */
const event = (type: string, data: unknown): SessionEvent => ({ type, seq: 0, time: 0, data }) as never

describe('removeRecord identity guard', () => {
  const recordFor = (id: string): SessionRecord => makeRecord(
    id as never,
    '/ws',
    { agent: {} as never, dispose: () => Promise.resolve() },
    { current: undefined, assembled: undefined },
  )

  it('deregisters the exact registered instance by its own id', () => {
    const store = new Map()
    const record = recordFor('a')
    store.set(record.id, record)
    removeRecord(store, record)
    expect(store.has('a')).toBe(false)
  })

  it('never removes a live entry on behalf of an impostor with the same id', () => {
    const store = new Map()
    const real = recordFor('a')
    store.set(real.id, real)
    // A superseded create racing a stale teardown carries the same id but a
    // different instance; the live record must survive.
    removeRecord(store, recordFor('a'))
    expect(store.get('a')).toBe(real)
  })
})

describe('PromptInflight (one prompt per session)', () => {
  it('resolves its stop-reason promise exactly once with the given reason', async () => {
    const inflight: PromptInflight = createInflight()
    const settled = inflight.promise.then((reason) => `ok:${reason}`)
    inflight.resolve('end_turn')
    expect(await settled).toBe('ok:end_turn')
  })

  it('rejects its promise on failure paths (admission/turn/output)', async () => {
    const inflight = createInflight()
    const failure = inflight.promise.then(
      () => 'unexpected resolve',
      (error: unknown) => `rejected:${(error as Error).message}`,
    )
    inflight.reject(new Error('turn failed'))
    expect(await failure).toBe('rejected:turn failed')
  })

  it('starts empty: no message, no turn, admission not finished, not cancelled', () => {
    const inflight = createInflight()
    expect(inflight.messageId).toBeUndefined()
    expect(inflight.messageQueued).toBe(false)
    expect(inflight.turn).toBeUndefined()
    expect(inflight.endKind).toBeUndefined()
    expect(inflight.cancelRequested).toBe(false)
    expect(inflight.settlementStarted).toBe(false)
    expect(inflight.outputError).toBeUndefined()
    expect(inflight.agentError).toBeUndefined()
  })

  it('admission completion gates settlement bookkeeping', async () => {
    const inflight = createInflight()
    let admitted = false
    void inflight.admissionDone.then(() => {
      admitted = true
    })
    await Promise.resolve()
    expect(admitted).toBe(false)
    inflight.finishAdmission()
    await inflight.admissionDone
    expect(admitted).toBe(true)
  })

  it('aborting the admission controller marks cancellation intent', () => {
    const inflight = createInflight()
    inflight.admissionController.abort(new Error('ACP prompt cancelled'))
    expect(inflight.admissionController.signal.aborted).toBe(true)
  })
})

describe('lastModelSelection (durable selection fold)', () => {
  it('returns undefined for logs without a selection snapshot', () => {
    expect(lastModelSelection([])).toBeUndefined()
    expect(lastModelSelection([
      event('turn/start', { turn: 0 }),
      event('todo/write', { todos: [] }),
    ])).toBeUndefined()
  })

  it('restores the latest snapshot, later writes winning over earlier ones', () => {
    const restored = lastModelSelection([
      event('model/selection', { provider: 'deepseek-official', model: 'deepseek-v4-flash' }),
      event('turn/start', { turn: 0 }),
      event('model/selection', { provider: 'pi-ai', model: 'claude-x', reasoningEffort: 'off' }),
    ])
    expect(restored).toEqual({ provider: 'pi-ai', model: 'claude-x', reasoningEffort: 'off' })
  })

  it('restores a provider-default snapshot without an effort key', () => {
    const restored = lastModelSelection([
      event('model/selection', { provider: 'pi-ai', model: 'claude-x', reasoningEffort: 'off' }),
      event('model/selection', { provider: 'pi-ai', model: 'claude-x' }),
    ])
    expect(restored).toEqual({ provider: 'pi-ai', model: 'claude-x' })
    expect('reasoningEffort' in restored!).toBe(false)
  })
})
