// Elicitation bridge seam (design §6.4, optimization plan P0-3b/P2-8): the
// dsh ask_user_question tool <-> ACP form answerer. Extracted from the bridge
// composition root so its five exits (no session / capability missing /
// aborted / decline / cancel) are unit-testable with a fake store + conn —
// the wire integration paths are covered by tests/elicitation-gate.test.ts.
import type { AgentSideConnection } from '@agentclientprotocol/sdk'
import type { SessionId } from '@deepseek-ai/dsh-session'
import type { AskUserQuestionAnswer, AskUserQuestionRequest } from '@deepseek-ai/dsh-user-questions'
import { codedError, ELICITATION_ABORTED, ELICITATION_CANCELLED, ELICITATION_DECLINED, ELICITATION_NO_SESSION, ELICITATION_UNSUPPORTED } from './errors.js'
import type { SessionRegistry } from './session-store.js'
import { elicitationRequestFor } from './updates.js'

/** The bridge surface askViaForm needs; the composition root wires it. */
export interface ElicitationBridge {
  /** Live sessions by id (record.closed marks a torn-down session). */
  store: SessionRegistry
  /** Latest ask_user_question call id per session (form tie). */
  askCall: Map<SessionId, string>
  /** The agent connection, once opened (undefined before/after serving). */
  getConn(): AgentSideConnection | undefined
  /** Whether the client declared `clientCapabilities.elicitation.form`. */
  formsEnabled(): boolean
}

/** Answer one ask_user_question request through an ACP form, or fail the ask
 * tool with a coded error instead of hanging the round. */
export const askViaForm = async (
  request: AskUserQuestionRequest,
  bridge: ElicitationBridge,
): Promise<AskUserQuestionAnswer> => {
  const agent = request.agent
  const conn = bridge.getConn()
  const record = agent !== undefined ? bridge.store.get(agent.session.id) : undefined
  if (record === undefined || record.closed || conn === undefined) {
    throw codedError(ELICITATION_NO_SESSION, 'no live ACP session for this question')
  }
  if (!bridge.formsEnabled()) {
    throw codedError(ELICITATION_UNSUPPORTED, 'this ACP client does not support elicitation forms; answer the question inline instead')
  }
  const signal = request.signal
  if (signal !== undefined && signal.aborted) throw codedError(ELICITATION_ABORTED, 'question aborted')
  const callId = bridge.askCall.get(record.id)
  let outcome
  try {
    outcome = await conn.createElicitation(elicitationRequestFor(request, record.id, callId))
  } finally {
    bridge.askCall.delete(record.id)
  }
  if (outcome.action === 'decline') throw codedError(ELICITATION_DECLINED, 'the user declined the question')
  if (outcome.action === 'cancel') throw codedError(ELICITATION_CANCELLED, 'the question was cancelled')
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
}
