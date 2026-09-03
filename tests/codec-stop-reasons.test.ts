// codec-stop-reasons: turn-ending -> ACP stop reason mapping
// (acceptance.md §4 `codec-stop-reasons`; design.zh.md §6.2, protocol-map.md §3).
import { describe, expect, it } from 'vitest'
import {
  settledStopReason,
  turnEndToStopReason,
  type AcpStopReason,
  type DshTurnEndKind,
} from '../src/bridge/codec.js'

const KINDS: readonly DshTurnEndKind[] = ['completed', 'max-tokens', 'aborted', 'interrupted', 'blocked', 'error']

describe('turnEndToStopReason (faithful table)', () => {
  it('is total over the rc.2 turn-end vocabulary and always yields a v1 wire reason', () => {
    for (const kind of KINDS) {
      const reason = turnEndToStopReason(kind)
      expect(['end_turn', 'max_tokens', 'max_turn_requests', 'refusal', 'cancelled'] as const).toContain(reason)
    }
  })

  it('maps ordinary quiescence to end_turn', () => {
    expect(turnEndToStopReason('completed')).toBe('end_turn')
    expect(turnEndToStopReason('aborted')).toBe('end_turn')
    expect(turnEndToStopReason('blocked')).toBe('end_turn')
  })

  it('reserves cancelled for interrupted endings (the client cancel path)', () => {
    expect(turnEndToStopReason('interrupted')).toBe('cancelled')
  })

  it('maps max-tokens to the wire max_tokens reason', () => {
    expect(turnEndToStopReason('max-tokens')).toBe('max_tokens')
  })
})

describe('settledStopReason (prompt settlement decision)', () => {
  it('rejects error endings (returns null so the caller chooses the RequestError path)', () => {
    expect(settledStopReason('error')).toBeNull()
  })

  it('reports a token-limited turn as end_turn (session stays usable)', () => {
    expect(settledStopReason('max-tokens')).toBe('end_turn')
  })

  it('keeps every other quiescent ending', () => {
    expect(settledStopReason('completed')).toBe('end_turn')
    expect(settledStopReason('interrupted')).toBe('cancelled')
    expect(settledStopReason('aborted')).toBe('end_turn')
  })

  it('never returns a reason outside the v1 StopReason union', () => {
    const reasons = KINDS.map(settledStopReason).filter((r): r is AcpStopReason => r !== null)
    for (const reason of reasons) {
      expect(['end_turn', 'max_tokens', 'max_turn_requests', 'refusal', 'cancelled']).toContain(reason)
    }
  })
})
