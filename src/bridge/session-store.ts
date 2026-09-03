// Adapted from the zed-dsh project (https://github.com/dangpangch/zed-dsh, MIT) —
// same-author port into the dsh-acp-interactive bundle. See package LICENSE.
// Per-session bridge records: the live registry plus teardown/quiescence
// primitives (design.zh.md §6.1, protocol-map.md §2). Teardown invariant:
// stop new work -> cancel admission/agent -> drain ordered updates -> dispose
// the agent -> flush persistence, scoped to the addressed session only. The
// registry and inflight state transitions are unit-testable without a harness
// (acceptance.md §4 `session-list-load`, `teardown-quiescence`).
import type { Agent, AgentHandle, ModelSelectionRef } from '@deepseek-ai/dsh-agent'
import type { AgentCancelCause, SessionId } from '@deepseek-ai/dsh-session'
import type { AcpStopReason } from './codec.js'

/** One in-flight `session/prompt`: the exact settlement bookkeeping. */
export interface PromptInflight {
  /** The RPC's stop-reason settlement promise (resolved/rejected once). */
  readonly promise: Promise<AcpStopReason>
  /** Settle the RPC with a terminal stop reason. */
  resolve(stopReason: AcpStopReason): void
  /** Reject the RPC (failed admission/turn/output — never a stop reason). */
  reject(error: unknown): void
  /** Message id of the queued user message, once queued. */
  messageId: string | undefined
  /** Whether the user message reached the agent inbox (agent work may follow). */
  messageQueued: boolean
  /** Owning turn, correlated via `agent/inbox/claimed`. */
  turn: number | undefined
  /** Kind of the correlated `turn/end` reason, once observed. */
  endKind: string | undefined
  /** Failure message detail when the correlated turn ended in `error`. */
  endMessage: string | undefined
  /** Client asked to cancel this prompt (session/cancel or teardown). */
  cancelRequested: boolean
  /** Whether settlement has already begun (idempotence guard). */
  settlementStarted: boolean
  /** Admission/queue phase promise; settlement awaits it first. */
  admissionDone: Promise<void>
  /** Completes the admission phase. */
  finishAdmission(): void
  /** Abort signal for admission work (image persistence etc.). */
  admissionController: AbortController
  /** First failure while serializing assistant output to the wire. */
  outputError: Error | undefined
  /** First agent failure correlated to this prompt. */
  agentError: Error | undefined
  /** Slash-command prompts settle against agent quiescence, not a turn. */
  waitForIdle: boolean | undefined
  /** A slash command that ran without a model turn may end without turn/end. */
  noTurnExpected: boolean | undefined
  /** Whether a slash command executed (no user message was queued). */
  commandExecuted: boolean | undefined
}

/** Live record for one ACP session. */
export interface SessionRecord {
  readonly id: SessionId
  /** Validated absolute cwd (SessionHeader.cwd). */
  readonly cwd: string
  /** The live dsh agent this ACP session drives. */
  readonly agent: Agent
  /** Owner disposer from the agent factory handle. */
  dispose(): Promise<void>
  /** Serialized update-delivery tail; settlement and close await it. */
  outputTail: Promise<void>
  /** Mutable model selection installed on the agent scope (set_config_option). */
  selection: ModelSelectionRef
  /** Currently open prompt, if any (single-flight per session). */
  inflight: PromptInflight | undefined
  /** Closed once this record is torn down (guards late settlement). */
  closed: boolean
  /** Reasoning efforts the current model declares (undefined = unknown). */
  supportedEfforts: ReadonlySet<string> | undefined
  /** Effective write-permission preset name (config option + /permission). */
  permission: string | undefined
  /** Whole-table plan fold most recently delivered on the wire. */
  sentPlanFold: string | undefined
  /** Whether a plan was ever sent (turn/start clearing only after one). */
  everSentPlan: boolean
  /** Accumulated streamed text per turn/step/block (delta dedupe). */
  streamedText: Map<string, string>
  /** Accumulated streamed reasoning per turn/step/block (delta dedupe). */
  streamedReasoning: Map<string, string>
  /** True while the record streams historical replay (no live output yet). */
  replaying: boolean
  /** Client-facing capabilities snapshot captured at initialize. */
  capabilities: unknown
}

/** Registry of every live bridge session, keyed by shared agent/session id. */
export class SessionStore {
  private readonly records = new Map<SessionId, SessionRecord>()

  has(id: SessionId): boolean {
    return this.records.has(id)
  }

  get(id: SessionId): SessionRecord | undefined {
    return this.records.get(id)
  }

  /** Return the bridge-owned record for a session id (impostor guard). */
  owned(id: SessionId, agent?: Agent): SessionRecord | undefined {
    const record = this.records.get(id)
    if (record === undefined) return undefined
    if (agent !== undefined && record.agent !== agent) return undefined
    return record
  }

  add(record: SessionRecord): void {
    this.records.set(record.id, record)
  }

  remove(id: SessionId, record: SessionRecord): void {
    if (this.records.get(id) === record) this.records.delete(id)
  }

  list(): SessionRecord[] {
    return [...this.records.values()]
  }

  get size(): number {
    return this.records.size
  }
}

/** Promise + externally callable resolvers (ES2023 lib has no withResolvers). */
function resolvers<T>(): {
  promise: Promise<T>
  resolve(value: T): void
  reject(error: unknown): void
} {
  let resolve!: (value: T) => void
  let reject!: (error: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

/** Allocate a fresh single-flight prompt slot (factory keeps transitions honest). */
export function createInflight(): PromptInflight {
  const admission = resolvers<void>()
  const completion = resolvers<AcpStopReason>()
  return {
    promise: completion.promise,
    resolve: (stopReason: AcpStopReason) => completion.resolve(stopReason),
    reject: (error: unknown) => completion.reject(error),
    messageId: undefined,
    messageQueued: false,
    turn: undefined,
    endKind: undefined,
    endMessage: undefined,
    cancelRequested: false,
    settlementStarted: false,
    admissionDone: admission.promise,
    finishAdmission: () => admission.resolve(),
    admissionController: new AbortController(),
    outputError: undefined,
    agentError: undefined,
    waitForIdle: undefined,
    noTurnExpected: undefined,
    commandExecuted: undefined,
  }
}

/** Build a live session record from a resolved agent factory handle. */
export function makeRecord(
  id: SessionId,
  cwd: string,
  handle: AgentHandle,
  selection: ModelSelectionRef,
  capabilities: unknown,
): SessionRecord {
  return {
    id,
    cwd,
    agent: handle.agent,
    dispose: () => handle.dispose(),
    outputTail: Promise.resolve(),
    selection,
    inflight: undefined,
    closed: false,
    supportedEfforts: undefined,
    permission: undefined,
    sentPlanFold: undefined,
    everSentPlan: false,
    replaying: false,
    capabilities,
    streamedText: new Map(),
    streamedReasoning: new Map(),
  }
}

/** Await the record's quiescence: admission, agent idle, and output drain. */
export async function drainRecord(record: SessionRecord): Promise<void> {
  await record.inflight?.admissionDone
  await record.agent.whenIdle()
  await record.outputTail
}

/** Cancel everything a record owns and request the agent stop. */
export function requestStop(record: SessionRecord, cause: AgentCancelCause): void {
  const inflight = record.inflight
  if (inflight !== undefined) {
    inflight.cancelRequested = true
    inflight.admissionController.abort(new Error(`ACP ${cause.kind} stop`))
  }
  record.agent.cancel(cause)
}
