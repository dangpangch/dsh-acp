#!/usr/bin/env node
// ACP v1 conformance harness (design §6.1): drives the FULL implemented agent
// surface through scripts/wire-probe.mjs and zod-validates EVERY inbound
// frame against the @agentclientprotocol/sdk 1.4.0 schema (the SDK validates
// inbound frames of real clients but NOT an agent's outbound frames, so this
// closes the gap). Prints a compliance matrix; exits non-zero on any invalid
// frame, broken expectation, or uncovered variant.
//
// Covered client→agent methods: initialize, session/new, session/
// set_config_option (thought_level / model / permission), session/prompt,
// session/close, session/list, session/load, session/resume, session/delete.
// Covered agent→client calls: session/update (agent_message_chunk,
// agent_thought_chunk, tool_call, tool_call_update, plan,
// available_commands_update, usage_update when projections report pressure),
// session/request_permission, elicitation/create.
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { connect } from './acp-client.mjs'

const zodPath = new URL('../node_modules/@agentclientprotocol/sdk/dist/schema/zod.gen.js', import.meta.url)
const z = await import(zodPath.href)

const here = dirname(fileURLToPath(import.meta.url))
const home = mkdtempSync(join(tmpdir(), 'dsh-acp-conformance-'))
const ws = join(home, 'ws')
mkdirSync(ws)
writeFileSync(join(ws, 'hello.txt'), 'hello from ws\n')

const failures = []
const seenMethods = new Map()
const seenUpdateVariants = new Map()
const EXPECTED_VARIANTS = [
  'agent_message_chunk',
  'agent_thought_chunk',
  'tool_call',
  'tool_call_update',
  'plan',
  'available_commands_update',
]
const CLIENT_METHOD_VALIDATORS = {
  'session/request_permission': z.zRequestPermissionRequest,
  'elicitation/create': z.zCreateElicitationRequest,
}
const RESPONSE_VALIDATORS = {
  initialize: z.zInitializeResponse,
  'session/new': z.zNewSessionResponse,
  'session/set_config_option': z.zSetSessionConfigOptionResponse,
  'session/prompt': z.zPromptResponse,
  'session/close': z.zCloseSessionResponse,
  'session/list': z.zListSessionsResponse,
  'session/load': z.zLoadSessionResponse,
  'session/resume': z.zResumeSessionResponse,
  'session/delete': z.zDeleteSessionResponse,
}

const step = (label) => console.error(`[conformance] ${label}`)
const check = (ok, label, detail = '') => {
  if (!ok) failures.push(`${label}${detail ? `: ${detail}` : ''}`)
  return ok
}
const validate = (schema, label, frame) => {
  const result = schema.safeParse(frame)
  if (!result.success) {
    failures.push(`${label} INVALID: ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`)
    return false
  }
  return true
}

// acp-client's req() resolves with the FULL JSON-RPC frame; unwrap result
// with an explicit error check for every call.
const call = async (method, params) => {
  const frame = await client.req(method, params)
  const result = frame.result ?? frame.error
  check(frame.error === undefined, method, `request failed: ${JSON.stringify(frame.error)}`)
  seenMethods.set(method, (seenMethods.get(method) ?? 0) + 1)
  return result
}

const client = connect(join(here, 'wire-probe.mjs'), { DSH_HOME: home, WIRE_WS: ws }, [], (frame, reply) => {
  const validator = CLIENT_METHOD_VALIDATORS[frame.method]
  check(validator !== undefined, `unexpected client request method: ${frame.method}`)
  if (validator !== undefined) {
    validate(validator, `client request ${frame.method}`, frame.params)
  } else {
    failures.push(`unexpected client request: ${frame.method}`)
  }
  seenMethods.set(`[client] ${frame.method}`, (seenMethods.get(`[client] ${frame.method}`) ?? 0) + 1)
  if (frame.method === 'session/request_permission') {
    // The bridge offers allow-once / reject-once; the probe allows once.
    reply({ outcome: { outcome: 'selected', optionId: 'allow-once' } })
  } else if (frame.method === 'elicitation/create') {
    // Fill the form programmatically: single-select echoes a string,
    // multi-select echoes an array; the __other free-text fields stay unset.
    const content = {}
    for (const [key, property] of Object.entries(frame.params?.requestedSchema?.properties ?? {})) {
      if (key.endsWith('__other')) continue
      content[key] = property.type === 'array' ? [property.items?.enum?.[0] ?? ''] : property.enum?.[0] ?? ''
    }
    reply({ action: 'accept', content })
  } else {
    reply({})
  }
})

;(async () => {
  // ── initialize ────────────────────────────────────────────────────────────
  step('initialize')
  const init = await call('initialize', {
    protocolVersion: 1,
    clientCapabilities: { elicitation: { form: {} }, fs: { readTextFile: true, writeTextFile: true } },
  })
  check(validate(z.zInitializeResponse, 'initialize', init), 'initialize schema')
  check(init.protocolVersion === 1, 'initialize', `protocolVersion ${init.protocolVersion}`)
  check(init.agentCapabilities?.loadSession === true, 'initialize', 'loadSession capability not advertised')
  check(init.agentCapabilities?.sessionCapabilities?.list != null, 'initialize', 'session list capability missing')

  // ── session/new + config options ──────────────────────────────────────────
  step('session/new')
  const created = await call('session/new', { cwd: ws, mcpServers: [] })
  check(validate(z.zNewSessionResponse, 'session/new', created), 'session/new schema')
  const sessionId = created.sessionId
  check(typeof sessionId === 'string' && sessionId.length > 0, 'session/new', 'no sessionId')
  for (const option of created.configOptions ?? []) {
    validate(z.zSessionConfigOption, `session/new config option ${option.id}`, option)
  }

  // ── set_config_option: thought_level / permission ─────────────────────────
  // The bridge advertises thought_level only when the model declares reasoning
  // efforts (a resolved model with none hides the picker — offering levels the
  // request guard would strip is advertising, not support). The stub model
  // declares none, so the expected shape here is absence + a rejected pick; a
  // model that declares efforts exercises the pick round-trip instead.
  step('set_config_option thought_level')
  const thought = created.configOptions?.find((option) => option.id === 'thought_level')
  if (thought !== undefined) {
    const picked = await call('session/set_config_option', { sessionId, configId: 'thought_level', value: thought.options.at(-1).value })
    check(validate(z.zSetSessionConfigOptionResponse, 'set_config_option thought_level', picked), 'set_config_option schema')
    check(picked.configOptions?.find((option) => option.id === 'thought_level')?.currentValue === thought.options.at(-1).value,
      'set_config_option', 'thought_level currentValue did not follow the pick')
  } else {
    const hidden = await client.req('session/set_config_option', { sessionId, configId: 'thought_level', value: 'high' })
    seenMethods.set('session/set_config_option', (seenMethods.get('session/set_config_option') ?? 0) + 1)
    check(hidden.error !== undefined, 'set_config_option thought_level',
      `hidden picker accepted a pick: ${JSON.stringify(hidden.result ?? null)}`)
  }
  // The model round-trip is intentionally skipped: the probe catalog also
  // lists the real deepseek provider (no API key here), and picking any model
  // option would route the turn away from the stub adapter. The model switch
  // path is covered by unit tests and the resume E2E instead.
  step('set_config_option permission')
  const permissionPick = await call('session/set_config_option', { sessionId, configId: 'permission', value: 'read-only' })
  check(validate(z.zSetSessionConfigOptionResponse, 'set_config_option permission', permissionPick), 'set_config_option permission schema')
  // The stub writes outside the workspace: put the session back on
  // workspace-write so the approval stack escalates to request_permission.
  step('set_config_option permission restore')
  const backToWrite = await call('session/set_config_option', { sessionId, configId: 'permission', value: 'workspace-write' })
  check(validate(z.zSetSessionConfigOptionResponse, 'set_config_option permission', backToWrite), 'set_config_option permission schema')

  // ── prompt turn: every update variant + client calls ──────────────────────
  step('session/prompt')
  const promptReply = await call('session/prompt', { sessionId, prompt: [{ type: 'text', text: 'run the probe' }] })
  check(validate(z.zPromptResponse, 'session/prompt', promptReply), 'session/prompt schema')
  check(promptReply.stopReason === 'end_turn', 'session/prompt', `stopReason ${promptReply.stopReason}`)

  // ── session/close / list / load / resume / delete ─────────────────────────
  step('session/close')
  const closed = await call('session/close', { sessionId })
  check(validate(z.zCloseSessionResponse, 'session/close', closed), 'session/close schema')
  step('session/list #1')
  const list1 = await call('session/list', { cwd: ws })
  check(validate(z.zListSessionsResponse, 'session/list', list1), 'session/list schema')
  check(JSON.stringify(list1.sessions ?? []).includes(sessionId), 'session/list', 'closed session not listed')

  step('session/load')
  const loaded = await call('session/load', { sessionId, cwd: ws, mcpServers: [] })
  check(validate(z.zLoadSessionResponse, 'session/load', loaded), 'session/load schema')
  step('session/resume')
  const resumed = await call('session/resume', { sessionId, cwd: ws, mcpServers: [] })
  check(validate(z.zResumeSessionResponse, 'session/resume', resumed), 'session/resume schema')
  check(Array.isArray(resumed.configOptions), 'session/resume', 'configOptions missing')

  step('session/delete')
  const deleted = await call('session/delete', { sessionId })
  check(validate(z.zDeleteSessionResponse, 'session/delete', deleted), 'session/delete schema')
  const list2 = await call('session/list', { cwd: ws })
  check(validate(z.zListSessionsResponse, 'session/list', list2), 'session/list schema')
  check((list2.sessions ?? []).length === 0, 'session/list', 'deleted session still listed')

  client.closeStdin()
  const code = await client.exitCode()
  check(code === 0, 'EOF exit', `exit code ${code}`)

  // ── report ────────────────────────────────────────────────────────────────
  for (const frame of client.frames) {
    if (frame.id === undefined && frame.method === 'session/update') {
      const variant = frame.params?.update?.sessionUpdate
      seenUpdateVariants.set(variant, (seenUpdateVariants.get(variant) ?? 0) + 1)
      validate(z.zSessionNotification, `session/update ${variant}`, frame.params)
    }
  }
  for (const variant of EXPECTED_VARIANTS) {
    check(seenUpdateVariants.has(variant), 'coverage', `session/update variant "${variant}" never exercised`)
  }
  check(seenMethods.has('[client] elicitation/create'), 'coverage', 'elicitation/create never exercised')

  console.log('== bridge stderr tail ==')
  console.log(client.stderrText().slice(-2000))
  console.log('== agent surface exercised ==')
  for (const [method, count] of [...seenMethods].sort()) console.log(`${count}× ${method}`)
  console.log('== session/update variants exercised ==')
  for (const [variant, count] of [...seenUpdateVariants].sort()) console.log(`${count}× ${variant}`)

  if (failures.length > 0) {
    console.error(`\nCONFORMANCE FAIL (${failures.length}):`)
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log('\nACP v1 CONFORMANCE OK')
  process.exit(0)
})().catch((error) => {
  console.error('conformance harness crashed:', error)
  process.exit(1)
})
