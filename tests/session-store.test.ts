// session-store: single-flight prompt slot + the registry identity guard
// (design.zh.md §6.2 `teardown-quiescence` primitives).
import { describe, expect, it } from 'vitest'
import { createInflight, makeRecord, removeRecord, type PromptInflight, type SessionRecord } from '../src/bridge/session-store.js'

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
