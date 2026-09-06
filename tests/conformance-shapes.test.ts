// ACP v1 schema conformance for the agent→client request builders that the
// probe environment cannot trigger live (session/request_permission needs an
// approval escalation the sandbox resolves by denial). The builders are the
// exact objects the bridge sends; validating them against the SDK's generated
// zod schemas pins the wire shapes.
import { describe, expect, it } from 'vitest'
import { configOptionsUpdate, elicitationRequestFor, requestPermissionRequest, sessionInfoUpdate } from '../src/bridge/updates.js'

// The SDK does not re-export zod.gen from its entry point; import the module
// by path (same package instance the bridge ships with).
const zod = await import(new URL('../node_modules/@agentclientprotocol/sdk/dist/schema/zod.gen.js', import.meta.url).href)

describe('requestPermissionRequest', () => {
  it('validates against the v1 schema', () => {
    const request = requestPermissionRequest('sess-1', 'call-9')
    const parsed = zod.zRequestPermissionRequest.safeParse(request)
    expect(parsed.success).toBe(true)
  })

  it('offers allow-once and reject-once with v1 permission kinds', () => {
    const request = requestPermissionRequest('sess-1', 'call-9')
    expect(request.options.map((option) => option.kind)).toEqual(['allow_once', 'reject_once'])
  })
})

describe('configOptionsUpdate', () => {
  it('validates the whole-snapshot notification against the v1 schema', () => {
    const notification = {
      sessionId: 'sess-1',
      update: configOptionsUpdate([{
        type: 'select',
        id: 'model',
        name: 'Model',
        description: 'Model used for new requests in this session.',
        category: 'model',
        currentValue: 'deepseek-official/deepseek-v4-flash',
        options: [{ value: 'deepseek-official/deepseek-v4-flash', name: 'DeepSeek / Flash', description: null }],
      }]),
    }
    const parsed = zod.zSessionNotification.safeParse(notification)
    expect(parsed.success).toBe(true)
  })
})

describe('sessionInfoUpdate', () => {
  it('validates the title notification against the v1 schema', () => {
    const notification = { sessionId: 'sess-1', update: sessionInfoUpdate('Fix the login flow') }
    const parsed = zod.zSessionNotification.safeParse(notification)
    expect(parsed.success).toBe(true)
  })
})

describe('elicitationRequestFor', () => {
  it('validates against the v1 schema (requestedSchema, not legacy schema)', () => {
    const request = elicitationRequestFor({
      questions: [
        { id: 'proceed', question: 'Proceed?' },
        { id: 'mode', question: 'Pick a mode', options: [{ label: 'Fast' }, { label: 'Deep' }] },
        { id: 'extras', question: 'Extras', options: [{ label: 'A' }, { label: 'B' }], multiSelect: true },
      ],
    }, 'sess-1', 'call-4')
    const parsed = zod.zCreateElicitationRequest.safeParse(request)
    expect(parsed.success).toBe(true)
    expect('schema' in request).toBe(false)
    expect(request.requestedSchema.required).toEqual(['proceed'])
  })

  it('carries per-question titles and the __other free-text siblings', () => {
    const request = elicitationRequestFor({
      questions: [{ id: 'q', question: 'Q?', detail: 'more', options: [{ label: 'A' }] }],
    }, 'sess-1', undefined)
    expect(request.requestedSchema.properties.q).toMatchObject({ type: 'string', enum: ['A'], title: 'Q?', description: 'more' })
    expect(request.requestedSchema.properties.q__other).toEqual({ type: 'string', title: 'Other' })
    expect(request.toolCallId).toBeUndefined()
  })
})
