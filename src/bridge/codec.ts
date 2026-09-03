// Adapted from the zed-dsh project (https://github.com/dangpangch/zed-dsh, MIT) —
// same-author port into the dsh-acp-interactive bundle. See package LICENSE.
// Pure turn-ending -> ACP stopReason mapping (design.zh.md §6.2, protocol-map.md
// §3, acceptance.md §4 `codec-stop-reasons`). Kept dependency-free so the whole
// table is unit-testable without a harness or protocol SDK.
//
// The rc.2 harness closes a turn with a `reason.kind` from this closed
// vocabulary (dsh-session TurnEndReasonMap); ACP v1 (sdk 1.4.0 schema) closes a
// prompt with one of its own terminal reasons. The mapping below targets the
// CURRENT v1 wire union (schema/types.gen.d.ts `StopReason`):
//   completed   -> end_turn          (ordinary quiescence)
//   aborted     -> end_turn          (a hook/other-owner abort is ordinary
//                                     quiescence; `cancelled` is reserved for
//                                     explicit client cancel)
//   interrupted -> cancelled         (the driver's interrupted ending IS the
//                                     cancel path)
//   blocked     -> end_turn          (pre-step rejection; surfaced as a normal
//                                     stop)
//   error       -> end_turn          (fallback only — see below)
//   max-tokens  -> max_tokens
//
// NOTE: the prompt settlement path never maps `error` through this function —
// an error-ending turn rejects the inflight `session/prompt` with an internal
// error instead of returning a stopReason (v1 has no `error` stop reason).
// See `settledStopReason` for that caller-facing decision table.

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

/** Faithful kind -> ACP stopReason table (no prompt-level special-casing). */
export function turnEndToStopReason(kind: DshTurnEndKind): AcpStopReason {
  switch (kind) {
    case 'completed':
    case 'aborted':
    case 'blocked':
    case 'error':
      return 'end_turn'
    case 'max-tokens':
      return 'max_tokens'
    case 'interrupted':
      return 'cancelled'
  }
}

/**
 * Prompt-level settlement decision for a correlated turn ending.
 *
 * Only quiescent endings settle the prompt with a stopReason; `error` endings
 * must reject the inflight request (returned as null so the caller chooses the
 * RequestError path), and a token-limit ending is not a prompt-level terminal
 * state — the harness keeps the session usable, so it reports `end_turn`
 * (matches the reference bridges' `max-tokens ? 'end_turn'` rule).
 *
 * @returns the ACP stopReason, or null when the caller should reject instead.
 */
export function settledStopReason(kind: DshTurnEndKind): AcpStopReason | null {
  if (kind === 'error') return null
  return kind === 'max-tokens' ? 'end_turn' : turnEndToStopReason(kind)
}
