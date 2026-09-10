#!/usr/bin/env node
// Wire-frame probe (design §6.1): boots the full dev composition plus a stub
// LLM adapter that issues one real `bash` tool call, then serves the ACP
// bridge on stdin/stdout so a parent client (conformance.mjs, via
// acp-client.mjs) can drive a prompt and dump every session/update frame —
// reproducing exactly what a Zed client sees for the bash card: title (the
// command line), status, and the result's text content.
import { mkdirSync, writeFileSync } from 'node:fs'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { boot, installFailLoud, loadOverlayPatches } from '@deepseek-ai/dsh-app-boot'
import { createRequire } from 'node:module'

const NAME = 'dsh-acp-wire-probe'
const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const home = process.env.DSH_HOME
if (home === undefined) throw new Error('DSH_HOME must be set (isolated probe home)')
const ws = process.env.WIRE_WS
if (ws === undefined) throw new Error('WIRE_WS must be set (probe workspace)')
mkdirSync(ws, { recursive: true })
writeFileSync(join(ws, 'hello.txt'), 'hello from ws\n')

installFailLoud(NAME)

// dsh-base patch ops + our bundle patch + fixture preset root (dev-bin recipe)
// + a stub-adapter plugin row (relative name resolves inside this package's
// module graph) + the default model route pointed at the stub.
const require = createRequire(import.meta.url)
const baseDir = dirname(require.resolve('@deepseek-ai/dsh-base/package.json'))
const baseManifest = JSON.parse(readFileSync(join(baseDir, 'package.json'), 'utf8'))
// The committed stub LLM adapter: first call asks for one bash invocation,
// then one read, then answers plain text and stops.
const stubModule = join(here, 'wire-stub-adapter.mjs')
const patches = [
  ...loadOverlayPatches(NAME, join(baseDir, baseManifest.dsh?.bundle?.patch)),
  ...loadOverlayPatches(NAME, join(root, 'cordis.patch.yml')),
  { id: 'agent-presets', config: { default: 'standard', roots: [{ path: join(dirname(require.resolve('@deepseek-ai/dsh-agent-presets/package.json')), 'presets'), trust: 'system' }] } },
  { id: 'agent-default-model', config: { provider: 'stub', model: 'stub-model' } },
  { id: 'dsh-acp-v1', config: { provider: 'stub', model: 'stub-model' } },
  { insert: [{ id: 'wire-stub-llm', name: stubModule }] },
]

await boot(NAME, join(root, 'boot.yml'), patches)
console.error('wire-probe: booted')

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))
process.stdin.resume()
// Probe-only EOF path: a frame-dump parent closing stdin ends the probe —
// no graceful teardown needed (isolated DSH_HOME, nothing durable).
process.stdin.on('end', () => process.exit(0))
