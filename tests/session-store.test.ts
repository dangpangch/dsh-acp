// session-store: bridge session registry + single-flight prompt slot
// (acceptance.md §4 `session-list-load`/`teardown-quiescence` primitives).
import { describe, expect, it } from 'vitest'
import { createInflight, SessionStore, type PromptInflight } from '../src/bridge/session-store.js'

describe('SessionStore registry', () => {
  it('stores, looks up, and removes records by session id', () => {
    const store = new SessionStore()
    const record = { id: 'a' } as never
    store.add(record as never)
    expect(store.has('a' as never)).toBe(true)
    expect(store.get('a' as never)).toBe(record)
    store.remove('a' as never, record as never)
    expect(store.has('a' as never)).toBe(false)
    expect(store.size).toBe(0)
  })

  it('remove only deletes the exact record instance (no impostor removal)', () => {
    const store = new SessionStore()
    const real = { id: 'a' } as never
    store.add(real as never)
    store.remove('a' as never, { id: 'a' } as never)
    expect(store.get('a' as never)).toBe(real)
  })

  it('lists records in insertion order and size tracks the map', () => {
    const store = new SessionStore()
    const first = { id: '1' } as never
    const second = { id: '2' } as never
    store.add(first as never)
    store.add(second as never)
    expect(store.list().map((r) => (r as { id: string }).id)).toEqual(['1', '2'])
    expect(store.size).toBe(2)
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
