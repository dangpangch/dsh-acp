// codec-stop-reasons: turn-ending -> ACP stop reason settlement table
// (design.zh.md §3.3/§6.2).
import { describe, expect, it } from 'vitest'
import {
  settledStopReason,
  type AcpStopReason,
  type DshTurnEndKind,
} from '../src/bridge/codec.js'

const KINDS: readonly DshTurnEndKind[] = ['completed', 'max-tokens', 'aborted', 'interrupted', 'blocked', 'error']

describe('settledStopReason (prompt settlement decision)', () => {
  it('is total over the rc.2 turn-end vocabulary', () => {
    for (const kind of KINDS) {
      const reason = settledStopReason(kind)
      expect(reason === null || ['end_turn', 'max_tokens', 'max_turn_requests', 'refusal', 'cancelled'].includes(reason)).toBe(true)
    }
  })

  it('rejects error endings (returns null so the caller chooses the RequestError path)', () => {
    expect(settledStopReason('error')).toBeNull()
  })

  it('reports a token-limited turn as end_turn (session stays usable)', () => {
    expect(settledStopReason('max-tokens')).toBe('end_turn')
  })

  it('maps ordinary quiescence to end_turn', () => {
    expect(settledStopReason('completed')).toBe('end_turn')
    expect(settledStopReason('aborted')).toBe('end_turn')
    expect(settledStopReason('blocked')).toBe('end_turn')
  })

  it('reserves cancelled for interrupted endings (the client cancel path)', () => {
    expect(settledStopReason('interrupted')).toBe('cancelled')
  })

  it('never returns a reason outside the v1 StopReason union', () => {
    const reasons = KINDS.map(settledStopReason).filter((r): r is AcpStopReason => r !== null)
    for (const reason of reasons) {
      expect(['end_turn', 'max_tokens', 'max_turn_requests', 'refusal', 'cancelled']).toContain(reason)
    }
  })
})
