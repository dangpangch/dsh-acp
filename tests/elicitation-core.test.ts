// P0-3b: the two elicitation exits that cannot be driven over the wire
// (no live session, aborted signal) plus the remaining coded exits, tested
// directly against the elicitation.ts seam with a fake store + conn. The
// wire-drivable paths (unsupported / decline / cancel) stay covered by
// tests/elicitation-gate.test.ts.
import { describe, expect, it } from 'vitest'
import type { AgentSideConnection } from '@agentclientprotocol/sdk'
import type { AskUserQuestionRequest } from '@deepseek-ai/dsh-user-questions'
import { askViaForm, type ElicitationBridge } from '../src/bridge/elicitation.js'

const bridgeFor = (overrides: Partial<ElicitationBridge> & { outcome?: unknown }): ElicitationBridge => {
  const conn = {
    createElicitation: async () => overrides.outcome ?? { action: 'accept', content: {} },
  } as unknown as AgentSideConnection
  const store = new Map([['s1', { id: 's1', closed: false }]]) as unknown as ElicitationBridge['store']
  return {
    store,
    askCall: new Map(),
    getConn: () => conn,
    formsEnabled: () => true,
    ...overrides,
  }
}

const requestFor = (overrides: Record<string, unknown> = {}): AskUserQuestionRequest =>
  ({
    agent: { session: { id: 's1' } },
    questions: [{ id: 'proceed', question: 'Proceed?' }],
    signal: undefined,
    ...overrides,
  }) as unknown as AskUserQuestionRequest

const expectCode = async (bridge: ElicitationBridge, request: AskUserQuestionRequest, code: string): Promise<void> => {
  await expect(askViaForm(request, bridge)).rejects.toThrow(`[${code}]`)
}

describe('elicitation seam (unit: internal exits + mapping)', () => {
  it('no live session fails with ELICITATION_NO_SESSION instead of hanging', async () => {
    const bridge = bridgeFor({})
    await expectCode(bridge, requestFor({ agent: { session: { id: 'no-such-session' } } }), 'ELICITATION_NO_SESSION')
  })

  it('a closed record fails with ELICITATION_NO_SESSION', async () => {
    const store = new Map([['s1', { id: 's1', closed: true }]]) as unknown as ElicitationBridge['store']
    await expectCode(bridgeFor({ store }), requestFor(), 'ELICITATION_NO_SESSION')
  })

  it('an aborted signal fails with ELICITATION_ABORTED', async () => {
    const controller = new AbortController()
    controller.abort()
    await expectCode(bridgeFor({}), requestFor({ signal: controller.signal }), 'ELICITATION_ABORTED')
  })

  it('missing elicitation.form capability fails with ELICITATION_UNSUPPORTED', async () => {
    await expectCode(bridgeFor({ formsEnabled: () => false }), requestFor(), 'ELICITATION_UNSUPPORTED')
  })

  it('a declined form fails with ELICITATION_DECLINED', async () => {
    await expectCode(bridgeFor({ outcome: { action: 'decline' } }), requestFor(), 'ELICITATION_DECLINED')
  })

  it('a cancelled form fails with ELICITATION_CANCELLED', async () => {
    await expectCode(bridgeFor({ outcome: { action: 'cancel' } }), requestFor(), 'ELICITATION_CANCELLED')
  })

  it('maps accepted content back into answers (single select, multi select, __other, free text)', async () => {
    const bridge = bridgeFor({
      outcome: {
        action: 'accept',
        content: { pick: 'A', extras: ['x', 'y'], 'pick__other': 'other text', why: 'free text' },
      },
    })
    const request = requestFor({
      questions: [
        { id: 'pick', question: 'Pick?', options: [{ label: 'A' }, { label: 'B' }] },
        { id: 'extras', question: 'Extras?', options: [{ label: 'x' }, { label: 'y' }], multiSelect: true },
        { id: 'why', question: 'Why?' },
      ],
    })
    const answer = await askViaForm(request, bridge)
    expect(answer.answers).toEqual([
      { id: 'pick', selected: ['A'], custom: 'other text' },
      { id: 'extras', selected: ['x', 'y'] },
      { id: 'why', selected: [], custom: 'free text' },
    ])
  })
})
