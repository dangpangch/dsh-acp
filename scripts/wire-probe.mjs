#!/usr/bin/env node
// Wire-frame probe (design §6.1): boots the full dev composition plus a stub
// LLM adapter that issues one real `bash` tool call, then serves the ACP
// bridge on stdin/stdout so a parent client (conformance.mjs, via
// acp-client.mjs) can drive a prompt and dump every session/update frame —
// reproducing exactly what a Zed client sees for the bash card: title (the
// command line), status, and the result's text content. The boot recipe
// (dsh-base + every dsh.bundle.patch layer + the dev overlay) comes from the
// built lib/dev-boot.js so this probe and lib/dev-bin.js cannot drift apart.
import { mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { boot, installFailLoud } from '@deepseek-ai/dsh-app-boot'
import { basePatchOps, devOverlayOps, ownPatchOps, rootEntriesPath } from '../lib/dev-boot.js'

const NAME = 'dsh-acp-wire-probe'
const here = dirname(fileURLToPath(import.meta.url))
const home = process.env.DSH_HOME
if (home === undefined) throw new Error('DSH_HOME must be set (isolated probe home)')
const ws = process.env.WIRE_WS
if (ws === undefined) throw new Error('WIRE_WS must be set (probe workspace)')
mkdirSync(ws, { recursive: true })
writeFileSync(join(ws, 'hello.txt'), 'hello from ws\n')

installFailLoud(NAME)

// Dev boot recipe + a stub-adapter plugin row (the relative path resolves
// inside this package's module graph) + the default model route at the stub.
// The committed stub LLM adapter: first call asks for one bash invocation,
// then one read, then answers plain text and stops.
const stubModule = join(here, 'wire-stub-adapter.mjs')
const patches = [
  ...basePatchOps(NAME),
  ...ownPatchOps(NAME),
  ...devOverlayOps(NAME),
  { id: 'agent-default-model', config: { provider: 'stub', model: 'stub-model' } },
  { id: 'dsh-acp-v1', config: { provider: 'stub', model: 'stub-model' } },
  { insert: [{ id: 'wire-stub-llm', name: stubModule }] },
]

// EOF race guard (same shape as lib/dev-bin.ts): a client that closes stdin
// while boot is still composing emits `end` before a post-boot listener
// exists — and an unlistened `end` is lost forever, leaving the probe alive
// with no exit path. Attach the listener before boot and register `resume()`
// after it; the flag covers the end that lands during composition.
let stdinEnded = false
const stdinEndExits = () => {
  setTimeout(() => process.exit(0), 400)
}
process.stdin.on('end', () => {
  stdinEnded = true
  stdinEndExits()
})

await boot(NAME, rootEntriesPath(NAME), patches)
console.error('wire-probe: booted')

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))
process.stdin.resume()
if (stdinEnded) stdinEndExits()
// Probe-only EOF path: a frame-dump parent closing stdin ends the probe —
// no graceful teardown needed (isolated DSH_HOME, nothing durable); the
// pre-boot `end` listener above arms the same exit.
