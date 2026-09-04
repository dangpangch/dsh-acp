// Pure turn-ending -> ACP stopReason mapping (docs/design.zh.md §3.3). Kept
// dependency-free so the whole table is unit-testable without a harness or
// protocol SDK.
//
// The rc.2 harness closes a turn with a `reason.kind` from this closed
// vocabulary (dsh-session TurnEndReasonMap); ACP v1 (sdk 1.4.0 schema) closes
// a prompt with one of its own terminal reasons. The mapping below targets the
// CURRENT v1 wire union (schema/types.gen.d.ts `StopReason`):
//   completed   -> end_turn          (ordinary quiescence)
//   aborted     -> end_turn          (a hook/other-owner abort is ordinary
//                                     quiescence; `cancelled` is reserved for
//                                     explicit client cancel)
//   interrupted -> cancelled         (the driver's interrupted ending IS the
//                                     cancel path)
//   blocked     -> end_turn          (pre-step rejection; surfaced as a normal
//                                     stop)
//   error       -> (never a stopReason — the caller rejects the RPC; see below)
//   max-tokens  -> end_turn          (a token-limit ending is not terminal:
//                                     the harness keeps the session usable,
//                                     matching the reference bridges' rule)
//
// NOTE: the prompt settlement path never maps `error` through this function —
// an error-ending turn rejects the inflight `session/prompt` with an internal
// error instead of returning a stopReason (v1 has no `error` stop reason).

/** rc.2 harness turn-end reason kinds (closed vocabulary). */
export type DshTurnEndKind =
  | 'completed'
  | 'max-tokens'
  | 'aborted'
  | 'interrupted'
  | 'blocked'
  | 'error'

/** ACP v1 terminal prompt stop reasons (sdk 1.4.0 `StopReason` union). */
export type AcpStopReason = 'end_turn' | 'max_tokens' | 'max_turn_requests' | 'refusal' | 'cancelled'

/**
 * Prompt-level settlement decision for a correlated turn ending: the ACP
 * stopReason, or null when the caller should reject instead — `error` endings
 * reject the inflight request with an internal error (v1 has no `error` stop
 * reason).
 */
export function settledStopReason(kind: DshTurnEndKind): AcpStopReason | null {
  switch (kind) {
    case 'completed':
    case 'aborted':
    case 'blocked':
    case 'max-tokens':
      return 'end_turn'
    case 'interrupted':
      return 'cancelled'
    case 'error':
      return null
  }
}
