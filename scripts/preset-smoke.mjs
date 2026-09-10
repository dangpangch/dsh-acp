#!/usr/bin/env node
// P1-4 preset smoke: boots the repo's own dev composition (lib/dev-bin.js —
// dsh-base + this bundle, the same seat layout a CLI profile installs) under
// an isolated DSH_HOME and asserts the bridge's preset surface:
//   DSH_ACP_PRESET=__bogus  -> session/new fails with a readable invalidParams
//                              listing the available presets
//   DSH_ACP_PRESET=smoke    -> session/new succeeds, the persisted session
//                              header records agentPreset "smoke", and the
//                              preset config option starts on "smoke" (a preset
//                              authored into the temp $DSH_HOME user root, so
//                              the case needs no host plugin)
//   unset                   -> session/new succeeds with agentPreset "standard"
//   blank session           -> the preset select round-trips to the authored
//                              preset and the pick survives close + resume
//                              (dsh reads the `agentPreset` projection, not the
//                              creation header, which keeps saying "standard")
// Run from the repo root:  node scripts/preset-smoke.mjs
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { zstdDecompressSync } from 'node:zlib'
import { connect } from './acp-client.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const BIN = join(here, '..', 'lib', 'dev-bin.js')

const failures = []
const check = (ok, label, detail = '') => {
  if (!ok) failures.push(`${label}${detail ? `: ${detail}` : ''}`)
  console.error(`[preset-smoke] ${ok ? 'ok' : 'FAIL'} — ${label}${detail ? ` (${detail})` : ''}`)
  return ok
}

const newestSessionHeader = (home) => {
  const sessionsRoot = join(home, 'sessions')
  if (!existsSync(sessionsRoot)) return undefined
  const files = readdirSync(sessionsRoot, { recursive: true })
    .map((path) => join(sessionsRoot, path))
    .filter((path) => path.endsWith('.jsonl.zstd'))
  if (files.length === 0) return undefined
  const withTime = files.map((path) => ({
    header: JSON.parse(zstdDecompressSync(readFileSync(path)).toString('utf8').split('\n')[0]),
    path,
  }))
  const latest = withTime.sort((a, b) => b.header.createdAt - a.header.createdAt)[0].header
  return latest
}

/** The preset select of one session's config options (undefined when absent). */
const presetSelect = (result) => (result?.configOptions ?? []).find((option) => option.id === 'preset')

/** Boot the dev composition once and drive initialize + session/new. */
const handshake = async (home, extraEnv, expectNewError) => {
  const client = connect(BIN, { ...extraEnv, DSH_HOME: home })
  try {
    const init = await client.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
    check(init.result?.protocolVersion === 1, 'initialize', JSON.stringify(init.error ?? null))
    const created = await client.req('session/new', { cwd: home, mcpServers: [] })
    const errorText = created.error !== undefined ? JSON.stringify(created.error) : ''
    if (expectNewError) {
      check(created.error !== undefined, 'session/new rejects unknown preset', errorText.slice(0, 300))
      check(/preset unavailable/.test(errorText), 'readable invalidParams', errorText.slice(0, 300))
      check(/available:/.test(errorText), 'error lists available presets', errorText.slice(0, 300))
    } else {
      check(created.error === undefined && typeof created.result?.sessionId === 'string', 'session/new', errorText || JSON.stringify(created.result ?? null))
    }
    client.closeStdin()
    const code = await client.exitCode()
    check(code === 0, 'EOF exit', `exit ${code}`)
    return { header: newestSessionHeader(home), created: created.result }
  } finally {
    client.closeStdin()
    await client.exitCode().catch(() => {})
  }
}

/**
 * A blank session may switch preset: the select is advertised, the switch is
 * recorded in the durable log, and a reload must compose the SAME preset even
 * though the creation header keeps naming the original default.
 */
const switchThenResume = async (home) => {
  let sessionId
  const client = connect(BIN, { DSH_HOME: home })
  try {
    const init = await client.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
    check(init.result?.protocolVersion === 1, 'initialize (switch)', JSON.stringify(init.error ?? null))
    const created = await client.req('session/new', { cwd: home, mcpServers: [] })
    sessionId = created.result?.sessionId
    if (!check(typeof sessionId === 'string', 'session/new (switch)', JSON.stringify(created.error ?? null))) return
    const option = presetSelect(created.result)
    if (!check(option !== undefined, 'preset select advertised on a blank session',
      JSON.stringify((created.result?.configOptions ?? []).map((entry) => entry.id)))) return
    check(option.currentValue === 'standard', 'preset select starts on the deployment default', String(option.currentValue))
    check(option.options.some((entry) => entry.value === 'smoke'), 'authored preset offered',
      JSON.stringify(option.options.map((entry) => entry.value)))
    const picked = await client.req('session/set_config_option', { sessionId, configId: 'preset', value: 'smoke' })
    check(presetSelect(picked.result)?.currentValue === 'smoke', 'blank-session preset switch',
      JSON.stringify(picked.error ?? null))
    const closed = await client.req('session/close', { sessionId })
    check(closed.error === undefined, 'session/close (switch)', JSON.stringify(closed.error ?? null))
  } finally {
    client.closeStdin()
    await client.exitCode().catch(() => {})
  }
  if (sessionId === undefined) return

  // The header is a creation fact: it must still name the original default,
  // which is exactly why resume cannot read it (dsh reads the projection).
  check(newestSessionHeader(home)?.agentPreset === 'standard', 'creation header keeps the original default',
    JSON.stringify(newestSessionHeader(home)?.agentPreset))

  const resumed = connect(BIN, { DSH_HOME: home })
  try {
    const init = await resumed.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
    check(init.result?.protocolVersion === 1, 'initialize (resume)', JSON.stringify(init.error ?? null))
    const reloaded = await resumed.req('session/resume', { sessionId, cwd: home, mcpServers: [] })
    check(reloaded.error === undefined, 'session/resume', JSON.stringify(reloaded.error ?? null))
    check(presetSelect(reloaded.result)?.currentValue === 'smoke', 'resume restores the last selected preset',
      JSON.stringify(presetSelect(reloaded.result)?.currentValue ?? null))
    await resumed.req('session/close', { sessionId })
  } finally {
    resumed.closeStdin()
    await resumed.exitCode().catch(() => {})
  }
}

const run = async () => {
  const home = mkdtempSync(join(tmpdir(), 'dsh-acp-preset-'))
  try {
    const base = { DSH_HOME: home }
    const bogus = await handshake(home, { ...base, DSH_ACP_PRESET: '__bogus' }, true)
    check(bogus.header === undefined, 'bogus preset leaves no session header')

    // A preset authored into the harness-home user root ($DSH_HOME/.agent-presets).
    const smokeDir = join(home, '.agent-presets', 'smoke')
    mkdirSync(smokeDir, { recursive: true })
    writeFileSync(join(smokeDir, 'agent.cordis.yml'), [
      '# smoke preset: persona only, no host-plugin rows.',
      '- id: persona',
      "  name: '@deepseek-ai/dsh-persona'",
      '  config:',
      '    prefix: smoke preset',
      '',
    ].join('\n'))
    const smoke = await handshake(home, { ...base, DSH_ACP_PRESET: 'smoke' }, false)
    check(smoke.header?.agentPreset === 'smoke', 'DSH_ACP_PRESET=smoke honored', JSON.stringify(smoke.header))
    check(presetSelect(smoke.created)?.currentValue === 'smoke', 'preset select follows DSH_ACP_PRESET',
      JSON.stringify(presetSelect(smoke.created)?.currentValue ?? null))

    const fallback = await handshake(home, base, false)
    check(fallback.header?.agentPreset === 'standard', 'unset env falls back to standard', JSON.stringify(fallback.header))
    check(presetSelect(fallback.created)?.currentValue === 'standard', 'preset select follows the roster default',
      JSON.stringify(presetSelect(fallback.created)?.currentValue ?? null))

    await switchThenResume(home)
  } finally {
    rmSync(home, { recursive: true, force: true })
  }

  if (failures.length > 0) {
    console.error(`\nPRESET SMOKE FAIL (${failures.length}):`)
    for (const failure of failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log('\nPRESET SMOKE OK')
}

run().catch((error) => {
  console.error('preset smoke crashed:', error)
  process.exit(1)
})
