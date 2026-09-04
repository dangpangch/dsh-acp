// dsh-acp-interactive: interactive ACP (Agent Client Protocol) v1 plugin for
// the DeepSeek Harness (dsh). Runs as a dsh bundle plugin inside a dsh profile
// (dsh --profile acp), opened by Zed's Agent Panel over stdio. One
// AgentSideConnection per process; one session record per ACP session;
// quiescent teardown per session and on disconnect/dispose. stdout stays
// JSON-RPC-only — every diagnostic rides ctx.logger (stderr).
//
// Mapping highlights (docs/design.zh.md §3):
//   session/new     -> ctx.agents.create (cwd + selection install), durable flush
//   session/prompt  -> single-flight text/image admission -> agent.followup
//                      -> committed assistant text streams as agent_message_chunk
//                      -> correlated turn/end settles the RPC via codec
//   cancel/close    -> per-session quiescent teardown (never touches siblings)
//   config options  -> model + thought_level selects over the llm catalog
//   per-agent plane -> agentPresets.mount (default preset, when the roster is up)
import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { randomUUID } from 'node:crypto'
import { basename, dirname, isAbsolute, join } from 'node:path'
import { Readable, Writable } from 'node:stream'
import {
  AgentSideConnection,
  PROTOCOL_VERSION,
  RequestError,
  ndJsonStream,
  type AuthenticateRequest,
  type CancelNotification,
  type CloseSessionRequest,
  type DeleteSessionRequest,
  type InitializeRequest,
  type InitializeResponse,
  type ListSessionsRequest,
  type ListSessionsResponse,
  type LoadSessionRequest,
  type NewSessionRequest,
  type NewSessionResponse,
  type PromptRequest,
  type PromptResponse,
  type ResumeSessionRequest,
  type SessionNotification,
} from '@agentclientprotocol/sdk'
import { installModelSelection, type ModelSelectionRef } from '@deepseek-ai/dsh-agent'
import { createUserMessage, errorChain, ReasoningEffortId, type ContentBlock } from '@deepseek-ai/dsh-llm'
import type { Agent, AgentCancelCause } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-user-approval'
import { SessionId as brandSessionId, type Session, type SessionEvent, type SessionId } from '@deepseek-ai/dsh-session'
import type { ImageAttachmentRef } from '@deepseek-ai/dsh-attachment'
import type { AskUserQuestionAnswer, AskUserQuestionRequest } from '@deepseek-ai/dsh-user-questions'
import { resolveDshHome } from '@deepseek-ai/dsh-home-paths'
import { rmSync } from 'node:fs'
import { readFile } from 'node:fs/promises'

import type { ContentBlock as AcpContentBlock } from '@agentclientprotocol/sdk'
import {
  AcpContentError,
  contentForPrompt,
  isImageMediaType,
  persistImages,
  scanPrompt,
} from './content.js'
import { settledStopReason, type DshTurnEndKind } from './codec.js'
import {
  SessionStore,
  createInflight,
  drainRecord,
  makeRecord,
  requestStop,
  type PromptInflight,
  type SessionRecord,
} from './session-store.js'
import {
  assistantTextChunk,
  assistantThoughtChunk,
  commandsUpdate,
  committedBlockRemainder,
  planUpdate,
  sessionNotification,
  streamTextDelta,
  toolCallContent,
  usageUpdate,
} from './updates.js'
import { replayPlanFold, replayUpdatesForEvent } from './replay.js'
import { mergeSlashCatalog, normalizeSkillSlashText, type SlashCatalogEntry, type SlashCommandEntry, type SlashSkillEntry } from './catalog.js'
import { rawInputOf, toolCallTitle, toolKindFor, toolResultCall } from './tool-cards.js'
import {
  currentEffortFor,
  guardReasoningEffort,
  modelSelectOptionList,
  permissionSelectOptions,
  PROVIDER_DEFAULT_REASONING_EFFORT,
  thoughtLevelOptionOptions,
  type CatalogProvider,
  type ModelReasoning,
} from './config-options.js'

/** Stable cordis plugin name (design.zh.md §5). */
export const name = 'dsh-acp-interactive'

/** Agent spine services this bridge programs (validated on the rc.2 baseline). */
export const inject = ['agents', 'sessions', 'sessionQuery', 'sessionPersistence']

/** Deployment route defaults; per-session config options may override. */
export interface BridgeConfig {
  provider?: string
  model?: string
}

export const Config: Schema<BridgeConfig> = Schema.object({
  provider: Schema.string(),
  model: Schema.string(),
})

const AGENT_NAME = 'dsh-acp-interactive'
const AGENT_VERSION = '0.1.0'
const CONFIG_ID_MODEL = 'model'
const CONFIG_ID_THOUGHT_LEVEL = 'thought_level'
const CONFIG_ID_PERMISSION = 'permission'
const AUTH_ENV_KEY = 'DEEPSEEK_API_KEY'

/** Canonical write-permission preset ids (mirrors the dsh-base permission row). */
const PERMISSION_PRESETS = ['read-only', 'workspace-write', 'danger-full-access'] as const

type WireConfigOptions = NonNullable<NewSessionResponse['configOptions']>

/** Agent-presets roster seam (default-preset join per session, best effort). */
interface AgentPresetsSeam {
  resolve(): { readonly id: string } | undefined
  mount(ctx: unknown, id: string): Promise<unknown>
}

/** Session-history query engine seam (session/list + load replay + titles). */
interface SessionQuerySeam {
  listSessions(signal?: AbortSignal): Promise<Array<{
    header: { id: SessionId; cwd?: string; agentPreset?: string }
    live: boolean
    persisted: boolean
  }>>
  readSession(sessionId: SessionId): Promise<{
    session: { cwd?: string; agentPreset?: string }
    events: readonly SessionEvent[]
  }>
  readTitle(sessionId: SessionId, signal?: AbortSignal): Promise<{ title: string } | undefined>
  listEvents(sessionId: SessionId, signal?: AbortSignal): Promise<Array<{ time: number }>>
}

/** Durable-session artifact locator (delete seam; the backend owns removal). */
interface PersistenceSeam {
  locate(header: { readonly id: SessionId }): { kind: string; path: string } | undefined
}

/** Write-permission preset seam (permission config option + /permission). */
interface PermissionPresetsSeam {
  set(session: Session, name: string): void
}

/** Human question UI seam for elicitation forms. */
interface UserQuestionsSeam {
  registerProvider(provider: { ask(request: unknown): Promise<{ answers: { id: string; selected: string[]; custom?: string }[] }> }): () => void
}

/** The projection read face the bridge uses for usage_update (token-meter unit). */
interface UsageProjectionService {
  snapshot(session: { readonly id: SessionId }): {
    values: { contextPressure?: { pressureTokens?: number; projectedTokens?: number; contextWindow?: number } }
  }
}

/** The dsh command runtime seam (slash commands, design §6.6). */
interface CommandRuntimeSeam {
  list(agent: Agent): readonly { name: string; description: string; input?: { hint: string } | null }[]
  execute(
    agent: Agent,
    line: string,
    images: readonly { mediaType: string; data: string }[],
    signal: AbortSignal,
  ): Promise<{ result: { kind: 'success' | 'error'; text?: string } } | undefined>
}

/**
 * The dsh skill registry read seam (user-invocable slash skills, design §6.6).
 * Skills are layered per agent scope, so the bridge lists through the live
 * record's agent (mirroring how dsh-tool-skill builds its lookup). Only
 * `userInvocable` skills are announced: they are the human-facing slash
 * surface whose `/name` gesture dsh's pre-step hook expands into the skill
 * body for the model.
 */
interface SkillRegistrySeam {
  list(options?: {
    cwd?: string | undefined
    scope?: unknown
    signal?: AbortSignal | undefined
  }): Promise<readonly {
    name: string
    description: string
    invocation: { readonly modelInvocable: boolean; readonly userInvocable: boolean }
  }[]>
}

/** Preserve invalid-parameter detail in the SDK wire error message. */
function invalidParams(detail: string): RequestError {
  return RequestError.invalidParams(undefined, detail)
}

/** Preserve failed-turn detail; plain handler errors become a generic wire internal error. */
function internalError(detail: string): RequestError {
  return RequestError.internalError(undefined, detail)
}

interface LlmCatalogService {
  listProviders(): Promise<Array<{ id: string; name?: string }>>
  listModels(providerId: string): Promise<Array<{ id: string; name?: string; description?: string | null }>>
  resolveModelInfo(
    providerId: string,
    modelId: string,
    signal?: AbortSignal,
  ): Promise<{
    inputModalities?: readonly string[]
    reasoning?: { efforts: readonly { id: string; name: string; description?: string | null }[]; defaultEffort?: string }
  }>
}

type AttachmentsService = {
  readonly imageLimits: { readonly mediaTypes: readonly string[] }
  saveImages(inputs: readonly { mediaType: string; data: Uint8Array }[]): Promise<readonly ImageAttachmentRef[]>
}

/** The slash-command line when the prompt starts with '/', else undefined. */
function slashLine(prompt: readonly AcpContentBlock[]): string | undefined {
  let text = ''
  for (const block of prompt) {
    if (block.type === 'text') text += block.text
  }
  const line = text.trimEnd()
  return line.startsWith('/') ? line : undefined
}

/** Original wire image blocks as encoded attachments for the command plane. */
function encodedImages(prompt: readonly AcpContentBlock[]): { mediaType: string; data: string }[] {
  const images: { mediaType: string; data: string }[] = []
  for (const block of prompt) {
    if (block.type === 'image') images.push({ mediaType: block.mimeType, data: block.data })
  }
  return images
}

/**
 * Apply the bridge. On a serving invocation the app already published
 * readiness (stdin is ours); open the AgentSideConnection over stdin/stdout
 * and route session/* to per-session agent records.
 */
export function apply(ctx: Context, config: BridgeConfig = {}): void {
  const agents = ctx.agents
  const logger = ctx.logger
  const sessions = ctx.sessions
  const llm = ctx.get('llm') as LlmCatalogService | undefined
  const attachments = ctx.get('attachments') as AttachmentsService | undefined
  const commands = ctx.get('commands') as CommandRuntimeSeam | undefined
  const skills = ctx.get('skills') as SkillRegistrySeam | undefined
  const projections = ctx.get('sessionProjections') as UsageProjectionService | undefined
  const presets = ctx.get('agentPresets') as AgentPresetsSeam | undefined
  const query = ctx.get('sessionQuery') as SessionQuerySeam | undefined
  const persistence = ctx.get('sessionPersistence') as PersistenceSeam | undefined
  const permissionPresets = ctx.get('permissionPresets') as PermissionPresetsSeam | undefined
  const userQuestions = ctx.get('userQuestions') as UserQuestionsSeam | undefined
  const store = new SessionStore()
  let closed = false
  let imagePromptEnabled = false
  let clientCapabilities: NonNullable<InitializeRequest['clientCapabilities']> | undefined
  // In-flight ACP request handlers: quiescence awaits them so a client that
  // closes stdin right after its requests still receives every reply before
  // the process exits (acceptance.md §2 immediate-EOF smoke).
  const activeRequests = new Set<Promise<unknown>>()
  // Latest ask_user_question tool call per session (elicitation tool tie).
  const askCall = new Map<SessionId, string>()
  const elicitationFormsEnabled = (): boolean => {
    const capabilities = clientCapabilities as { elicitation?: { form?: unknown } } | undefined
    return capabilities?.elicitation?.form !== undefined
  }

  const assertOpen = (): void => {
    if (closed) throw internalError('the ACP bridge has been disposed')
  }

  const requireSession = (sessionId: SessionId): SessionRecord => {
    const record = store.get(sessionId)
    if (record === undefined) throw invalidParams(`unknown session: ${sessionId}`)
    return record
  }

  // ── output delivery (serialized per session) ──────────────────────────────
  let conn: AgentSideConnection | undefined
  const notify = async (notification: SessionNotification): Promise<void> => {
    if (conn === undefined) return
    try {
      await conn.sessionUpdate(notification)
    } catch (error: unknown) {
      logger.warn(`dsh-acp-interactive: session/update failed: ${String(error)}`)
    }
  }

  /** Chain one wire update onto the record's ordered delivery tail. */
  const deliver = (record: SessionRecord, update: SessionNotification['update']): void => {
    record.outputTail = record.outputTail.then(async () => {
      if (record.closed) return
      await notify(sessionNotification(record.id, update))
    }).catch((error: unknown) => {
      const inflight = record.inflight
      if (inflight !== undefined) inflight.outputError ??= new Error(String(error))
      logger.warn(`dsh-acp-interactive: output delivery failed: ${errorChain(error)}`)
    })
  }

  /** Settle one prompt after admission, agent quiescence, and output drain. */
  const settleAfterQuiescence = (record: SessionRecord, inflight: PromptInflight): void => {
    if (inflight.settlementStarted) return
    inflight.settlementStarted = true
    void (async () => {
      await drainRecord(record)
      if (record.inflight !== inflight) return
      record.inflight = undefined
      if (inflight.cancelRequested) {
        inflight.resolve('cancelled')
        return
      }
      if (inflight.outputError !== undefined) {
        inflight.reject(internalError(`assistant output delivery failed: ${inflight.outputError.message}`))
        return
      }
      if (inflight.agentError !== undefined) {
        inflight.reject(internalError(`turn failed: ${inflight.agentError.message}`))
        return
      }
      const kind = inflight.endKind as DshTurnEndKind | undefined
      if (kind === undefined) {
        // A slash command that ran without a model turn has no turn/end to
        // correlate; it still settles end_turn once the agent is quiet.
        inflight.resolve(inflight.noTurnExpected === true ? 'end_turn' : 'cancelled')
        return
      }
      const stop = settledStopReason(kind)
      if (stop === null) {
        inflight.reject(internalError(`turn failed: ${inflight.endMessage ?? 'unknown'}`))
        return
      }
      inflight.resolve(stop)
    })().catch((error: unknown) => {
      if (record.inflight !== inflight) return
      record.inflight = undefined
      inflight.reject(internalError(`prompt settlement failed: ${errorChain(error)}`))
    })
  }

  /** Chain one synchronous serialization task onto the delivery tail. */
  const serialize = (record: SessionRecord, task: () => Promise<void>): void => {
    record.outputTail = record.outputTail.then(task).catch((error: unknown) => {
      const inflight = record.inflight
      if (inflight !== undefined) inflight.outputError ??= new Error(String(error))
      logger.warn(`dsh-acp-interactive: output conversion failed: ${errorChain(error)}`)
    })
  }

  /** Push a usage_update ring whenever both sides of the window are known. */
  const pushUsage = (record: SessionRecord): void => {
    if (projections === undefined) return
    const pressure = projections.snapshot(record.agent.session).values.contextPressure
    if (pressure === undefined) return
    const used = pressure.projectedTokens ?? pressure.pressureTokens
    const size = pressure.contextWindow
    if (used === undefined || size === undefined) return
    deliver(record, usageUpdate(used, size))
  }

  /** Map a committed assistant message, resending only unstreamed remainders. */
  const deliverAssistantMessage = (record: SessionRecord, turn: number, step: number, blocks: readonly ContentBlock[]): void => {
    serialize(record, async () => {
      if (record.closed || record.replaying) return
      for (let index = 0; index < blocks.length; index += 1) {
        const block = blocks[index]!
        const key = `${turn}:${step}:${index}`
        if (block.type === 'text') {
          const remainder = committedBlockRemainder(record.streamedText, key, block.text)
          if (remainder !== undefined) await notify(sessionNotification(record.id, assistantTextChunk(remainder)))
        } else if (block.type === 'reasoning') {
          const remainder = committedBlockRemainder(record.streamedReasoning, key, block.text)
          if (remainder !== undefined) await notify(sessionNotification(record.id, assistantThoughtChunk(remainder)))
        }
      }
      pushUsage(record)
    })
  }

  /** Deliver streamed deltas (thought/message) as they arrive. */
  const deliverStreamChunk = (record: SessionRecord, turn: number, step: number, chunk: { type: string; index?: number; text?: string }): void => {
    if (chunk.type === 'text-delta' && chunk.index !== undefined && chunk.text !== undefined && chunk.text.length > 0) {
      const key = `${turn}:${step}:${chunk.index}`
      const wire = streamTextDelta(record.streamedText, key, chunk.text, assistantTextChunk)
      if (wire !== undefined) deliver(record, wire)
    } else if (chunk.type === 'reasoning-delta' && chunk.index !== undefined && chunk.text !== undefined && chunk.text.length > 0) {
      const key = `${turn}:${step}:${chunk.index}`
      const wire = streamTextDelta(record.streamedReasoning, key, chunk.text, assistantThoughtChunk)
      if (wire !== undefined) deliver(record, wire)
    }
  }

  /** Deliver the whole-table todo plan (and its turn/start clear). */
  const deliverPlan = (record: SessionRecord, todos: readonly { content: string; status: 'pending' | 'in_progress' | 'completed' }[]): void => {
    const fold = JSON.stringify(todos)
    if (fold === record.sentPlanFold) return
    record.sentPlanFold = fold
    record.everSentPlan = true
    deliver(record, planUpdate(todos))
  }

  const deliverPlanClear = (record: SessionRecord): void => {
    if (!record.everSentPlan || record.sentPlanFold === '[]') return
    record.sentPlanFold = '[]'
    deliver(record, planUpdate([]))
  }

  /** Deliver a generic tool card on call and its terminal update on result. */
  const deliverToolCall = (record: SessionRecord, call: { callId: string; name: string; arguments: string }): void => {
    const rawInput = rawInputOf(call.arguments)
    const kind = toolKindFor(call.name)
    serialize(record, async () => {
      if (record.closed || record.replaying) return
      await notify(sessionNotification(record.id, {
        sessionUpdate: 'tool_call',
        toolCallId: call.callId,
        title: toolCallTitle(kind, call.name, rawInput),
        name: call.name,
        kind,
        status: 'pending',
        rawInput,
      }))
    })
  }

  const deliverToolResult = (
    record: SessionRecord,
    result: { callId: string; text: string; isError: boolean },
  ): void => {
    serialize(record, async () => {
      if (record.closed || record.replaying) return
      await notify(sessionNotification(record.id, {
        sessionUpdate: 'tool_call_update',
        toolCallId: result.callId,
        status: result.isError ? 'failed' : 'completed',
        ...(result.text.length > 0 ? { content: toolCallContent(result.text) } : {}),
      }))
      pushUsage(record)
    })
  }

  /**
   * Announce the session's slash catalog as one `available_commands_update`.
   * The list merges the dsh command plane (`ctx.commands`, e.g. goal /
   * permission / plan / compact / feedback) with **user-invocable skills**
   * (`ctx.skills`, sourced from the same global/project roots Zed reads —
   * `~/.agents/skills` and `<project>/.agents/skills`), because Zed 1.18 only
   * surfaces slash entries for an external ACP agent through
   * `available_commands_update` and validates any typed `/name` against that
   * list. Commands win name collisions; skills the user may not invoke stay
   * out. Execution needs no extra bridge code: a picked skill reaches the
   * prompt as a plain `/name` user text, and dsh's `tool-skill` pre-step hook
   * expands that gesture into the skill body for the model — exactly the dsh
   * Web "/"-menu behavior.
   */
  const slashCatalogFor = async (record: SessionRecord): Promise<SlashCatalogEntry[]> => {
    const commandEntries: SlashCommandEntry[] = []
    if (commands !== undefined) {
      for (const descriptor of commands.list(record.agent)) {
        commandEntries.push({
          name: descriptor.name,
          description: descriptor.description,
          ...(descriptor.input?.hint !== undefined && descriptor.input.hint.length > 0
            ? { inputHint: descriptor.input.hint }
            : {}),
        })
      }
    }
    let skillEntries: SlashSkillEntry[] = []
    if (skills !== undefined) {
      try {
        const summaries = await skills.list({ cwd: record.cwd, scope: record.agent })
        skillEntries = summaries.map((skill) => ({
          name: skill.name,
          description: skill.description,
          userInvocable: skill.invocation.userInvocable,
        }))
      } catch (error: unknown) {
        logger.warn(`dsh-acp-interactive: skill catalog unavailable for slash list: ${errorChain(error)}`)
      }
    }
    return mergeSlashCatalog(commandEntries, skillEntries)
  }

  /** Deferred slash-catalog announcement (Zed ignores unknown-session updates). */
  const announceSlashCatalog = (record: SessionRecord): void => {
    setTimeout(() => {
      void slashCatalogFor(record)
        .then((entries) => {
          if (entries.length === 0 || record.closed) return
          deliver(record, commandsUpdate(entries))
        })
        .catch((error: unknown) => {
          logger.warn(`dsh-acp-interactive: slash catalog announcement failed: ${errorChain(error)}`)
        })
    }, 0)
  }

  // Keep every open session's slash popup fresh when either catalog source
  // changes (a skill installed into ~/.agents/skills or <project>/.agents/skills
  // while a Zed thread is open must appear without recreating the thread).
  // The registry change events ride the same host context the rows mount on.
  if (commands !== undefined || skills !== undefined) {
    const refreshAll = (): void => {
      for (const record of store.list()) announceSlashCatalog(record)
    }
    // `skills/change` and `commands/change` are declared on the host-plane
    // registry modules (@deepseek-ai/dsh-skill, @deepseek-ai/dsh-commands) that
    // this bundle does not import; subscribe through the untyped context.
    const host = ctx as unknown as { on(event: string, listener: () => void): unknown }
    host.on('skills/change', refreshAll)
    host.on('commands/change', refreshAll)
  }

  // ── dsh event firehose -> wire updates ────────────────────────────────────
  ctx.on('session/event', (session, event) => {
    const record = store.get(session.header.id)
    if (record === undefined || record.agent.session !== session) return
    const inflight = record.inflight
    switch (event.type) {
      case 'assistant/chunk':
        deliverStreamChunk(record, event.data.turn, event.data.step, event.data.chunk)
        break
      case 'assistant/message':
        deliverAssistantMessage(record, event.data.turn, event.data.step, event.data.message.content)
        break
      case 'tool/call':
        if (event.data.name === 'ask_user_question') askCall.set(record.id, String(event.data.callId))
        deliverToolCall(record, event.data)
        break
      case 'tool/result': {
        const call = toolResultCall(event.data.message)
        deliverToolResult(record, { callId: call.callId, text: call.text, isError: event.data.error !== undefined })
        break
      }
      case 'todo/write':
        deliverPlan(record, event.data.todos)
        break
      case 'turn/start':
        deliverPlanClear(record)
        break
      case 'turn/end': {
        if (inflight !== undefined && inflight.turn === event.data.turn) {
          inflight.endKind = event.data.reason.kind
          if (event.data.reason.kind === 'error') {
            const failure = (event.data.reason as { error?: { message?: string } }).error
            inflight.endMessage = failure?.message ?? ''
          }
          settleAfterQuiescence(record, inflight)
        }
        pushUsage(record)
        break
      }
      default:
        break
    }
  })

  // One-shot permission answerer: bridge-owned approval requests become ACP
  // session/request_permission with allow-once / reject-once choices; foreign
  // or call-less requests delegate (design §6.1).
  ctx.on('approval/request', (request, next) => {
    if (conn === undefined) return next()
    const record = store.get(request.agent.session.id)
    if (record === undefined || record.agent !== request.agent || request.callId === undefined) {
      return next()
    }
    const callId = request.callId
    return drainRecord(record).then(() =>
      conn!.requestPermission({
        sessionId: record.id,
        toolCall: { toolCallId: callId },
        options: [
          { optionId: 'allow-once', name: 'Allow once', kind: 'allow_once' },
          { optionId: 'reject-once', name: 'Reject', kind: 'reject_once' },
        ],
      }),
    ).then(({ outcome }) => {
      if (outcome.outcome === 'cancelled') return 'cancelled'
      return outcome.optionId === 'allow-once' ? 'allowed-once' : 'rejected'
    })
  })

  ctx.on('agent/inbox/claimed', ({ agent, message, turn }) => {
    const record = store.get(agent.session.id)
    const inflight = record?.inflight
    if (inflight !== undefined && inflight.messageId === message.id) inflight.turn = turn
  })

  ctx.on('agent/error', ({ agent, turn, error }) => {
    const record = store.get(agent.session.id)
    const inflight = record?.inflight
    if (record === undefined || inflight === undefined || !inflight.messageQueued || inflight.turn === turn) return
    inflight.agentError = new Error(errorChain(error))
    settleAfterQuiescence(record, inflight)
  })

  // ── scoped teardown: stop, drain, dispose, flush; session-scoped only ─────
  const closing = new WeakMap<SessionRecord, Promise<void>>()
  const closeOne = (record: SessionRecord, cause: AgentCancelCause): Promise<void> => {
    const pending = closing.get(record)
    if (pending !== undefined) return pending
    const run = (async () => {
      if (record.closed) return
      requestStop(record, cause)
      await drainRecord(record)
      await record.dispose()
      try {
        await sessions.flush(record.agent.session)
      } catch (error: unknown) {
        logger.warn(`dsh-acp-interactive: persistence flush failed on close: ${String(error)}`)
      }
      record.closed = true
    })()
    closing.set(record, run)
    return run
  }

  // ── config options (P1): model + thought_level selects ────────────────────
  const defaultSelection = (): { provider?: string; model?: string } => ({
    ...(config.provider !== undefined ? { provider: config.provider } : {}),
    ...(config.model !== undefined ? { model: config.model } : {}),
  })

  const reasoningFor = async (provider: string, model: string): Promise<ModelReasoning | undefined> => {
    if (llm === undefined) return undefined
    try {
      const resolved = await llm.resolveModelInfo(provider, model)
      if (resolved.reasoning === undefined) return undefined
      return {
        efforts: resolved.reasoning.efforts.map((effort) => ({
          id: String(effort.id),
          name: effort.name,
          description: effort.description ?? null,
        })),
        ...(resolved.reasoning.defaultEffort !== undefined ? { defaultEffort: String(resolved.reasoning.defaultEffort) } : {}),
      }
    } catch (error: unknown) {
      logger.warn(`dsh-acp-interactive: reasoning catalog for ${provider}/${model} failed: ${String(error)}`)
      return undefined
    }
  }

  const refreshConfigOptions = async (record: SessionRecord): Promise<WireConfigOptions> => {
    const current = record.selection.current
    if (llm === undefined || current === undefined || current.provider === undefined || current.model === undefined) {
      return []
    }
    const out: WireConfigOptions = []
    try {
      const providers = await llm.listProviders()
      const catalog: CatalogProvider[] = []
      for (const provider of providers) {
        let models: CatalogProvider['models'] = []
        try {
          models = (await llm.listModels(provider.id)) as CatalogProvider['models']
        } catch (error: unknown) {
          logger.warn(`dsh-acp-interactive: model catalog for ${provider.id} failed: ${String(error)}`)
        }
        catalog.push({ id: provider.id, name: provider.name, models })
      }
      const flat = modelSelectOptionList(catalog, { provider: current.provider, model: current.model })
      if (flat !== null && flat.options.length > 0) {
        out.push({
          type: 'select',
          id: CONFIG_ID_MODEL,
          name: 'Model',
          description: 'Model used for new requests in this session.',
          category: 'model',
          currentValue: flat.currentValue,
          options: flat.options,
        })
      }
    } catch (error: unknown) {
      logger.warn(`dsh-acp-interactive: provider catalog failed: ${String(error)}`)
    }
    const reasoning = await reasoningFor(current.provider, current.model)
    const offered = thoughtLevelOptionOptions(reasoning)
    if (offered.length > 0) {
      // Remember exactly which efforts the current model honors so a stale
      // pick never reaches request assembly (design §6.3 request guard).
      record.supportedEfforts = reasoning?.efforts !== undefined
        ? new Set(reasoning.efforts.map((effort) => effort.id))
        : undefined
      const currentEffort = currentEffortFor(
        current.reasoningEffort !== undefined ? String(current.reasoningEffort) : undefined,
        reasoning?.defaultEffort !== undefined ? String(reasoning.defaultEffort) : undefined,
      )
      out.push({
        type: 'select',
        id: CONFIG_ID_THOUGHT_LEVEL,
        name: 'Thought Level',
        description: 'Reasoning effort for models that support selectable levels.',
        category: 'thought_level',
        currentValue: currentEffort,
        options: offered.map((effort) => ({ value: effort.id, name: effort.name, description: effort.description })),
      })
    }
    if (permissionPresets !== undefined) {
      const names = PERMISSION_PRESETS as readonly string[]
      const currentValue = record.permission ?? (process.env.DSH_PERMISSION_MODE ?? 'workspace-write')
      out.push({
        type: 'select',
        id: CONFIG_ID_PERMISSION,
        name: 'Write permission',
        description: 'One-shot permission preset for this session (sandbox mode + approval policy).',
        category: 'permission',
        currentValue: names.includes(currentValue) ? currentValue : names[1]!,
        options: permissionSelectOptions(names),
      })
    }
    return out
  }

  /** Apply one validated config change; takes effect on the next turn. */
  const applyConfigOption = async (record: SessionRecord, configId: string, value: unknown): Promise<void> => {
    const current = record.selection.current
    if (current === undefined || current.provider === undefined || current.model === undefined) {
      throw invalidParams('config options are unavailable: the session has no model route')
    }
    if (typeof value !== 'string') throw invalidParams(`config option "${configId}" expects a select value id`)
    if (configId === CONFIG_ID_MODEL) {
      const slash = value.indexOf('/')
      if (slash <= 0 || slash === value.length - 1) throw invalidParams(`unknown model value: ${value}`)
      // Switching models clears the effort: the new model's provider default
      // governs until the user picks another level.
      record.selection.current = { provider: value.slice(0, slash), model: value.slice(slash + 1) }
      return
    }
    if (configId === CONFIG_ID_THOUGHT_LEVEL) {
      const reasoning = await reasoningFor(current.provider, current.model)
      const offered = thoughtLevelOptionOptions(reasoning)
      if (!offered.some((effort) => effort.id === value)) throw invalidParams(`unknown thought_level value: ${value}`)
      if (value === PROVIDER_DEFAULT_REASONING_EFFORT) {
        const { reasoningEffort: _stripped, ...rest } = current
        record.selection.current = rest
        return
      }
      record.selection.current = { ...current, reasoningEffort: ReasoningEffortId(value) }
      return
    }
    if (configId === CONFIG_ID_PERMISSION) {
      if (permissionPresets === undefined) throw invalidParams('permission presets are not mounted')
      if (!(PERMISSION_PRESETS as readonly string[]).includes(value)) throw invalidParams(`unknown permission preset: ${value}`)
      record.permission = value
      permissionPresets.set(record.agent.session, value)
      return
    }
    throw invalidParams(`unknown config option: ${configId}`)
  }

  /** Strip a reasoning effort the current model cannot honor before queueing. */
  const guardCurrentEffort = (record: SessionRecord): void => {
    const current = record.selection.current
    if (current?.reasoningEffort === undefined) return
    const supported = record.supportedEfforts
    if (supported === undefined) return
    const guarded = guardReasoningEffort({ reasoningEffort: String(current.reasoningEffort) }, supported)
    if (guarded.reasoningEffort === undefined) {
      const { reasoningEffort: _stripped, ...rest } = current
      record.selection.current = rest
    }
  }

  // ── advertise images only when the attachment store and model agree ───────
  const supportsImages = async (): Promise<boolean> => {
    if (attachments === undefined || llm === undefined || config.provider === undefined || config.model === undefined) return false
    if (!attachments.imageLimits.mediaTypes.some((mediaType) => isImageMediaType(mediaType))) return false
    try {
      const info = await llm.resolveModelInfo(config.provider, config.model)
      return info.inputModalities?.includes('image') === true
    } catch {
      return false
    }
  }

  const validateWorkspaceParams = (params: {
    cwd: string
    additionalDirectories?: readonly unknown[] | null
    mcpServers?: readonly unknown[] | null
  }): void => {
    if (!isAbsolute(params.cwd)) throw invalidParams(`cwd must be an absolute path: ${params.cwd}`)
    if (params.additionalDirectories !== undefined && params.additionalDirectories !== null && params.additionalDirectories.length > 0) {
      throw invalidParams('additionalDirectories is not supported')
    }
    if (params.mcpServers !== undefined && params.mcpServers !== null && params.mcpServers.length > 0) {
      throw invalidParams('mcpServers is not supported')
    }
  }

  // ── session history: list / load / resume / delete helpers ─────────────────
  /** Look a persisted session up by id and return its stored header facts. */
  const persistedHeader = async (sessionId: SessionId): Promise<{ cwd: string; agentPreset?: string } | undefined> => {
    if (query === undefined) return undefined
    const records = await query.listSessions()
    const record = records.find((entry) => entry.header.id === sessionId && entry.persisted)
    if (record === undefined) return undefined
    const cwd = record.header.cwd
    return cwd !== undefined && cwd.length > 0 ? { cwd, agentPreset: record.header.agentPreset } : undefined
  }

  /** Latest activity time of one session as an ISO string (best effort). */
  const updatedAtFor = async (sessionId: SessionId): Promise<string | undefined> => {
    if (query === undefined) return undefined
    try {
      const events = await query.listEvents(sessionId)
      let latest = 0
      for (const event of events) if (event.time > latest) latest = event.time
      return latest > 0 ? new Date(latest).toISOString() : undefined
    } catch {
      return undefined
    }
  }

  /** Display title of one session (best effort; none -> undefined). */
  const titleFor = async (sessionId: SessionId): Promise<string | undefined> => {
    if (query === undefined) return undefined
    try {
      return (await query.readTitle(sessionId))?.title
    } catch {
      return undefined
    }
  }

  /** Dispose and deregister a live bridge record for the id, if any. */
  const releaseOnline = async (sessionId: SessionId): Promise<void> => {
    const record = store.get(sessionId)
    if (record === undefined) return
    store.remove(sessionId, record)
    await closeOne(record, { kind: 'disposed' })
  }

  /**
   * Publish a freshly built record (session/new and load/resume share the
   * tail): register, build config options, kick off the background durability
   * flush and the deferred slash-catalog announcement, and roll the record
   * back loudly on failure.
   */
  const registerRecord = async (
    record: SessionRecord,
    replay?: () => Promise<void>,
  ): Promise<WireConfigOptions> => {
    store.add(record)
    try {
      assertOpen()
      const configOptions = await refreshConfigOptions(record)
      assertOpen()
      // Durability for an empty session is a background concern: the
      // persistence checkpoint also runs at teardown (closeOne) and after
      // real turns. Flushing here would block the response on disk I/O and
      // lose the reply to a client that closes stdin right after its
      // requests (acceptance.md §2 immediate-EOF smoke).
      void sessions.flush(record.agent.session).catch((error: unknown) => {
        logger.warn(`dsh-acp-interactive: background persistence flush failed: ${String(error)}`)
      })
      // Slash catalog (commands + user-invocable skills): deferred past the
      // session/new response — Zed ignores notifications for session ids it
      // does not know yet (design §6.6).
      announceSlashCatalog(record)
      if (replay !== undefined) await replay()
      return configOptions
    } catch (error: unknown) {
      if (store.get(record.id) === record) store.remove(record.id, record)
      await closeOne(record, { kind: 'disposed' }).catch(() => {})
      throw error
    }
  }

  /**
   * Stream one persisted session's history to the client as wire updates
   * (session/load semantics). Committed assistant content and tool cards from
   * the raw log, ending with the folded plan state; raw deltas and usage never
   * replay. Each frame is awaited in order so the load response never races it.
   */
  const replayHistory = async (record: SessionRecord, events: readonly SessionEvent[]): Promise<void> => {
    record.replaying = true
    try {
      for (const event of events) {
        if (record.closed) return
        for (const update of replayUpdatesForEvent(event)) {
          await notify(sessionNotification(record.id, update))
        }
      }
      const plan = replayPlanFold(events)
      if (plan !== undefined && !record.closed) await notify(sessionNotification(record.id, plan))
    } finally {
      record.replaying = false
    }
  }

  /** One ordered "create-or-resume" agent handle for history loads. */
  const resumeAgentFor = async (
    sessionId: SessionId,
    selection: ModelSelectionRef,
    agentPreset: string | undefined,
  ): Promise<Awaited<ReturnType<typeof agents.create>>> => {
    const defaults = defaultSelection()
    if (defaults.provider !== undefined && defaults.model !== undefined) {
      selection.current = { provider: defaults.provider, model: defaults.model }
    }
    let presetId = agentPreset
    if (presetId === undefined) {
      try {
        presetId = presets?.resolve()?.id
      } catch (error: unknown) {
        logger.warn(`dsh-acp-interactive: default agent preset unavailable: ${errorChain(error)}`)
      }
    }
    const agentOptions = defaults.provider !== undefined || defaults.model !== undefined
      ? { provider: defaults.provider, model: defaults.model } as { provider?: string; model?: string }
      : undefined
    return agents.resume({
      resumeSessionId: sessionId,
      agentOptions,
      setup: async (agentCtx) => {
        installModelSelection(agentCtx, selection)
        if (presetId !== undefined && presets !== undefined) {
          await presets.mount(agentCtx, presetId)
        }
      },
    })
  }

  /** Best-effort durable delete of one session artifact (idempotent). */
  const deletePersisted = (header: { id: SessionId; cwd?: string }): void => {
    if (persistence === undefined) return
    if (header.cwd === undefined || header.cwd.length === 0) {
      logger.warn(`dsh-acp-interactive: durable delete skipped: session cwd is unknown`)
      return
    }
    let location
    try {
      location = persistence.locate(header as { id: SessionId })
    } catch (error: unknown) {
      logger.warn(`dsh-acp-interactive: persistence locate failed: ${errorChain(error)}`)
      return
    }
    if (location === undefined) return
    const sessionsRoot = join(resolveDshHome(), 'sessions')
    const artifact = location.path
    if (!artifact.startsWith(sessionsRoot)) {
      logger.warn(`dsh-acp-interactive: refusing to delete artifact outside the sessions root: ${artifact}`)
      return
    }
    const sessionDir = dirname(artifact)
    if (!/^(session-)?[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(basename(sessionDir))) {
      logger.warn(`dsh-acp-interactive: refusing to delete unexpected artifact layout: ${artifact}`)
      return
    }
    try {
      rmSync(sessionDir, { recursive: true, force: true })
    } catch (error: unknown) {
      logger.warn(`dsh-acp-interactive: durable delete failed: ${errorChain(error)}`)
    }
  }

  // ── Agent implementation (SDK 1.4.0 Agent interface) ──────────────────────
  const implementation = {
    async initialize(params: InitializeRequest): Promise<InitializeResponse> {
      clientCapabilities = params.clientCapabilities ?? undefined
      imagePromptEnabled = await supportsImages()
      // Truthful capability surface (protocol-map.md §1): session history is
      // available whenever the session-query engine is composed; image prompts
      // only when the attachment store and the default route both accept them;
      // elicitation forms only when the client declared form support AND a
      // question provider can be bridged. Nothing un-implemented is advertised.
      const history = query !== undefined
      return {
        protocolVersion: PROTOCOL_VERSION,
        agentInfo: { name: AGENT_NAME, version: AGENT_VERSION },
        agentCapabilities: {
          loadSession: history,
          promptCapabilities: { image: imagePromptEnabled, audio: false, embeddedContext: false },
          sessionCapabilities: {
            close: {},
            ...(history ? { list: {}, delete: {}, resume: {} } : {}),
          },
        },
        authMethods: [{
          id: 'env-deepseek-api-key',
          name: 'DeepSeek API key',
          description:
            'Set the ' + AUTH_ENV_KEY + ' environment variable (or configure the key in the ' +
            'dsh web Models settings / ~/.dsh/.credentials.yaml) and restart the agent.',
        }],
      }
    },

    async authenticate(_params: AuthenticateRequest): Promise<void> {
      if (process.env[AUTH_ENV_KEY]?.trim()) return
      const homeKey = process.env.DSH_HOME ?? resolveDshHome()
      try {
        const credentials = await readFile(join(homeKey, '.credentials.yaml'), 'utf8')
        if (credentials.includes('apiKey') || credentials.includes('deepseek')) return
      } catch {
        /* missing credentials document — fall through to authRequired */
      }
      throw RequestError.authRequired(
        undefined,
        'no API key is configured: set ' + AUTH_ENV_KEY + ' in the agent environment, or add a ' +
          'DeepSeek API key through the dsh web Models settings (' + join(homeKey, '.credentials.yaml') + ') and restart.',
      )
    },

    async newSession(params: NewSessionRequest): Promise<NewSessionResponse> {
      assertOpen()
      validateWorkspaceParams(params)
      const sessionId = brandSessionId(randomUUID())
      const defaults = defaultSelection()
      const selection: ModelSelectionRef = { current: undefined, assembled: undefined }
      if (defaults.provider !== undefined && defaults.model !== undefined) {
        selection.current = { provider: defaults.provider, model: defaults.model }
      }
      const agentOptions = defaults.provider !== undefined || defaults.model !== undefined
        ? { provider: defaults.provider, model: defaults.model } as { provider?: string; model?: string }
        : undefined
      // Best-effort default-preset join (agent plane tools/prompt sections).
      // The roster (shipped + user roots) is our own bundle's agent-presets
      // row; an absent roster or a default that no root supplies must not
      // take the session down — the agent still runs on the global layer.
      let presetId: string | undefined
      try {
        presetId = presets?.resolve()?.id
      } catch (error: unknown) {
        logger.warn(`dsh-acp-interactive: default agent preset unavailable: ${errorChain(error)}`)
      }
      let handle
      try {
        handle = await agents.create({
          sessionId,
          meta: { cwd: params.cwd, ...(presetId !== undefined ? { agentPreset: presetId } : {}) },
          agentOptions,
          setup: async (agentCtx) => {
            installModelSelection(agentCtx, selection)
            if (presetId !== undefined && presets !== undefined) {
              // The roster is our own row; a broken default must fail this
              // session's creation loudly instead of half-composing it.
              await presets.mount(agentCtx, presetId)
            }
          },
        })
      } catch (error: unknown) {
        // Agent creation failures are internal (composition/route issues).
        throw internalError(`session creation failed: ${errorChain(error)}`)
      }
      if (closed) {
        await handle.dispose().catch(() => {})
        throw internalError('connection closed during session/new')
      }
      const configOptions = await registerRecord(makeRecord(sessionId, params.cwd, handle, selection))
      return { sessionId, configOptions }
    },

    async listSessions(params: ListSessionsRequest): Promise<ListSessionsResponse> {
      assertOpen()
      if (query === undefined) throw invalidParams('session history is not available on this connection')
      const records = await query.listSessions()
      const want = params.cwd !== undefined && params.cwd !== null ? params.cwd : undefined
      const sessions = []
      for (const record of records) {
        const cwd = record.header.cwd
        if (cwd === undefined || cwd.length === 0) continue
        if (want !== undefined && cwd !== want) continue
        const id = record.header.id
        const [title, updatedAt] = await Promise.all([titleFor(id), updatedAtFor(id)])
        sessions.push({
          sessionId: id,
          cwd,
          ...(title !== undefined ? { title } : {}),
          ...(updatedAt !== undefined ? { updatedAt } : {}),
        })
      }
      return { sessions }
    },

    /** Shared admission for load/resume over a persisted session. */
    async prepareHistoryResume(params: { sessionId: string; cwd: string; replay: boolean }) {
      assertOpen()
      const sessionId = brandSessionId(params.sessionId)
      const header = await persistedHeader(sessionId)
      if (header === undefined) throw invalidParams(`unknown session: ${params.sessionId}`)
      if (header.cwd !== params.cwd) {
        throw invalidParams(`session ${params.sessionId} belongs to ${header.cwd}, not ${params.cwd}`)
      }
      await releaseOnline(sessionId)
      const selection: ModelSelectionRef = { current: undefined, assembled: undefined }
      const handle = await resumeAgentFor(sessionId, selection, header.agentPreset)
      if (closed) {
        await handle.dispose().catch(() => {})
        throw internalError('connection closed during session load/resume')
      }
      const record = makeRecord(sessionId, params.cwd, handle, selection)
      const configOptions = await registerRecord(record, params.replay && query !== undefined
        ? async () => {
            const snapshot = await query.readSession(sessionId)
            await replayHistory(record, snapshot.events)
          }
        : undefined)
      return { configOptions }
    },

    async loadSession(params: LoadSessionRequest) {
      validateWorkspaceParams(params)
      return this.prepareHistoryResume({ sessionId: params.sessionId, cwd: params.cwd, replay: true })
    },

    async resumeSession(params: ResumeSessionRequest) {
      validateWorkspaceParams(params)
      return this.prepareHistoryResume({ sessionId: params.sessionId, cwd: params.cwd, replay: false })
    },

    async deleteSession(params: DeleteSessionRequest) {
      assertOpen()
      const sessionId = brandSessionId(params.sessionId)
      const online = store.get(sessionId)
      let cwd = online?.cwd
      if (cwd === undefined && query !== undefined) {
        const header = await persistedHeader(sessionId)
        cwd = header?.cwd
      }
      if (online !== undefined) {
        store.remove(sessionId, online)
        await closeOne(online, { kind: 'user' }).catch(() => {})
      }
      deletePersisted({ id: sessionId, cwd })
      return {}
    },

    async closeSession(params: CloseSessionRequest): Promise<Record<string, never>> {
      assertOpen()
      const sessionId = brandSessionId(params.sessionId)
      const record = requireSession(sessionId)
      try {
        await closeOne(record, { kind: 'user' })
      } catch (error: unknown) {
        throw internalError(`session close failed: ${errorChain(error)}`)
      } finally {
        store.remove(sessionId, record)
      }
      return {}
    },

    async setSessionConfigOption(params: {
      sessionId: string
      configId: string
      value: unknown
    }): Promise<{ configOptions: WireConfigOptions }> {
      assertOpen()
      const record = requireSession(brandSessionId(params.sessionId))
      await applyConfigOption(record, params.configId, params.value)
      return { configOptions: await refreshConfigOptions(record) }
    },

    async prompt(params: PromptRequest): Promise<PromptResponse> {
      assertOpen()
      const record = requireSession(brandSessionId(params.sessionId))
      if (record.inflight !== undefined) throw invalidParams('a prompt is already in flight for this session')
      guardCurrentEffort(record)
      const inflight = createInflight()
      record.inflight = inflight
      // Picked `/skill:<name>` entries arrive as literal prompt text; rewrite
      // each text block's word-bounded `skill:<name>` tokens back to the bare
      // `/name` gesture dsh's tool-skill pre-step expands (its gesture regex
      // accepts only `/kebab-name`), so a skill picked from the Zed popup
      // loads exactly like the dsh Web "/" menu one.
      const prompt = params.prompt.map((block) =>
        block.type === 'text' ? { ...block, text: normalizeSkillSlashText(block.text) } : block,
      )
      let admissionFailed = false
      let admissionFailure: unknown
      try {
        if (agents.get(record.agent.id) !== record.agent) {
          throw internalError('prompt was not queued: the agent was disposed outside the bridge')
        }
        // Slash commands run on the command plane and never enter the model
        // history (design §6.6); an unknown or malformed slash falls back to
        // an ordinary prompt below.
        const line = slashLine(prompt)
        if (line !== undefined) {
          if (commands === undefined) throw internalError('no command runtime is mounted')
          inflight.noTurnExpected = true
          const exec = await commands.execute(
            record.agent,
            line,
            encodedImages(prompt),
            inflight.admissionController.signal,
          )
          if (exec !== undefined) {
            inflight.commandExecuted = true
            if (exec.result.text !== undefined && exec.result.text.length > 0) {
              deliver(record, assistantTextChunk(exec.result.text))
            }
          } else {
            inflight.noTurnExpected = false
          }
        }
        if (inflight.commandExecuted !== true) {
          const images = scanPrompt(prompt, imagePromptEnabled)
          inflight.admissionController.signal.throwIfAborted()
          let imageRefs: readonly ImageAttachmentRef[] = []
          if (images.length > 0) {
            if (attachments === undefined) throw invalidParams('no attachment store is mounted')
            imageRefs = await persistImages(attachments, images, inflight.admissionController.signal)
          }
          inflight.admissionController.signal.throwIfAborted()
          if (agents.get(record.agent.id) !== record.agent) {
            throw internalError('prompt was not queued: the agent was disposed outside the bridge')
          }
          const content = contentForPrompt(prompt, imageRefs)
          const message = createUserMessage({
            content: content as unknown as ContentBlock[],
            source: { kind: 'user' },
          })
          inflight.messageId = message.id
          inflight.messageQueued = true
          try {
            record.agent.followup(message)
          } catch (error: unknown) {
            inflight.messageQueued = false
            throw error
          }
        }
      } catch (error: unknown) {
        admissionFailed = true
        admissionFailure = error
      } finally {
        inflight.finishAdmission()
      }
      if (inflight.cancelRequested) {
        settleAfterQuiescence(record, inflight)
        return { stopReason: await inflight.promise }
      }
      if (admissionFailed) {
        record.inflight = undefined
        if (admissionFailure instanceof AcpContentError) {
          throw admissionFailure.kind === 'invalid' ? invalidParams(admissionFailure.message) : internalError(admissionFailure.message)
        }
        if (admissionFailure instanceof RequestError) throw admissionFailure
        const detail = (admissionFailure as Error | undefined)?.message ?? String(admissionFailure)
        throw internalError(`prompt was not queued: ${detail}`)
      }
      settleAfterQuiescence(record, inflight)
      return { stopReason: await inflight.promise }
    },

    cancel(params: CancelNotification): Promise<void> {
      const record = store.get(brandSessionId(params.sessionId))
      if (record === undefined) return Promise.resolve()
      const inflight = record.inflight
      if (inflight !== undefined) {
        inflight.cancelRequested = true
        inflight.admissionController.abort(new Error('ACP prompt cancelled'))
        settleAfterQuiescence(record, inflight)
      }
      if (inflight === undefined || inflight.messageQueued) record.agent.cancel({ kind: 'user' })
      return Promise.resolve()
    },
  }

  // Track started request handlers so quiescence can drain them (see quiesce).
  const trackedImplementation = new Proxy(implementation, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver)
      if (typeof value !== 'function') return value
      return (...args: unknown[]) => {
        const result = value.apply(target, args as never[])
        if (result instanceof Promise) {
          activeRequests.add(result)
          void result.catch(() => undefined).finally(() => { activeRequests.delete(result) })
        }
        return result
      }
    },
  }) as typeof implementation

  conn = new AgentSideConnection(
    (connection) => {
      conn = connection
      return trackedImplementation
    },
    ndJsonStream(
      Writable.toWeb(process.stdout) as WritableStream<Uint8Array>,
      Readable.toWeb(process.stdin) as ReadableStream<Uint8Array>,
    ),
  )

  let quiescing: Promise<void> | undefined
  const quiesce = (): Promise<void> => {
    if (quiescing !== undefined) return quiescing
    closed = true
    for (const record of store.list()) {
      const inflight = record.inflight
      if (inflight !== undefined) {
        inflight.cancelRequested = true
        inflight.admissionController.abort(new Error('ACP bridge disposed'))
        settleAfterQuiescence(record, inflight)
      }
      record.agent.cancel({ kind: 'disposed' })
    }
    quiescing = (async () => {
      // A client that closed stdin right after its requests still gets every
      // reply: drain the started handlers (prompts settle 'cancelled', other
      // handlers finish normally) before any record teardown begins.
      await Promise.allSettled([...activeRequests])
      const records = store.list()
      const failures: unknown[] = []
      for (const record of records) {
        try {
          await closeOne(record, { kind: 'disposed' })
        } catch (error: unknown) {
          failures.push(error)
        }
        store.remove(record.id, record)
      }
      if (failures.length > 0) {
        const detail = failures.map((failure) => errorChain(failure)).join('; ')
        throw new AggregateError(failures, `dsh-acp-interactive: teardown failed for ${failures.length} session(s): ${detail}`)
      }
    })()
    return quiescing
  }

  // Connection end == serving session over: under the dsh CLI profile boot the
  // composition owns process lifetime (the launcher wires SIGINT/SIGTERM but
  // nothing exits when the client closes stdin), so once our quiescent
  // teardown drained every reply, request a bounded tree shutdown through the
  // launcher-published `ctx.appExit` (immediate-EOF smoke: exit 0). The same
  // chain also covers EOF that arrives before this plugin applies — the SDK
  // closes the connection the moment its input stream ends.
  const appExit = ctx.get('appExit') as ((code?: number) => void) | undefined
  let exitStarted = false
  void conn.closed.catch((error: unknown) => {
    logger.warn(`dsh-acp-interactive: connection closed with an error: ${String(error)}`)
  }).then(async () => {
    await quiesce()
    if (appExit !== undefined && !exitStarted) {
      exitStarted = true
      appExit(0)
    }
  }).catch((error: unknown) => {
    logger.warn(`dsh-acp-interactive: connection-close teardown failed: ${String(error)}`)
  })
  ctx.effect(() => quiesce, 'dsh-acp-interactive.connection')

  // ── elicitation: dsh ask_user_question <-> ACP form ───────────────────────
  // One active provider per context (user-questions seam). A form is only
  // attempted when the client declared `clientCapabilities.elicitation.form`;
  // otherwise the provider rejects immediately so the ask tool reports the
  // failure to the model instead of hanging the turn (design §6.4).
  if (userQuestions !== undefined) {
    const disposer = userQuestions.registerProvider({
      ask: async (request: AskUserQuestionRequest): Promise<AskUserQuestionAnswer> => {
        const agent = request.agent
        const record = agent !== undefined ? store.get(agent.session.id) : undefined
        if (record === undefined || record.closed || conn === undefined) {
          throw new Error('no live ACP session for this question')
        }
        if (!elicitationFormsEnabled()) {
          throw new Error('this ACP client does not support elicitation forms; answer the question inline instead')
        }
        const signal = request.signal
        if (signal !== undefined && signal.aborted) throw new Error('question aborted')
        const properties: Record<string, Record<string, unknown>> = {}
        const required: string[] = []
        const messages: string[] = []
        for (const item of request.questions) {
          messages.push(item.question)
          const base = {
            title: item.question,
            ...(item.detail !== undefined && item.detail.length > 0 ? { description: item.detail } : {}),
          }
          const options = item.options ?? []
          if (options.length > 0) {
            const labels = options.map((option) => option.label)
            properties[item.id] = item.multiSelect === true
              ? { type: 'array', items: { type: 'string', enum: labels }, ...base }
              : { type: 'string', enum: labels, ...base }
            properties[`${item.id}__other`] = { type: 'string', title: 'Other' }
          } else {
            properties[item.id] = { type: 'string', ...base }
            required.push(item.id)
          }
        }
        const callId = askCall.get(record.id)
        let outcome
        try {
          outcome = await conn.createElicitation({
            mode: 'form',
            sessionId: record.id,
            ...(callId !== undefined ? { toolCallId: callId } : {}),
            message: messages.join(' '),
            schema: { type: 'object', properties, required },
          })
        } finally {
          askCall.delete(record.id)
        }
        if (outcome.action === 'decline') throw new Error('the user declined the question')
        if (outcome.action === 'cancel') throw new Error('the question was cancelled')
        let content: Record<string, unknown> = {}
        if (outcome.action === 'accept' && outcome.content !== undefined && outcome.content !== null) {
          content = outcome.content as Record<string, unknown>
        }
        const answers: AskUserQuestionAnswer['answers'] = []
        for (const item of request.questions) {
          const value = content[item.id]
          const other = content[`${item.id}__other`]
          const hasOptions = (item.options ?? []).length > 0
          const selected = value === undefined ? [] : Array.isArray(value) ? value.map(String) : [String(value)]
          answers.push({
            id: item.id,
            selected: hasOptions ? selected : [],
            ...(typeof other === 'string' && other.length > 0
              ? { custom: other }
              : (!hasOptions && typeof value === 'string' && value.length > 0 ? { custom: value } : {})),
          })
        }
        return { answers }
      },
    })
    ctx.effect(() => disposer, 'dsh-acp-interactive.user-questions')
  }
}
