#!/usr/bin/env node
// Wire-frame probe (design §6.1): boots the full dev composition plus a stub
// LLM adapter that issues one real `bash` tool call, then serves the ACP
// bridge on stdin/stdout so a parent client (wire-drive.mjs) can drive a
// prompt and dump every session/update frame — reproducing exactly what a
// Zed client sees for the bash card: title (the command line), status, and
// the result's text content. Run through scripts/wire-drive.mjs, not directly.
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
// A stub LLM adapter (generated at runtime, gitignored): first call asks for
// one bash invocation, then one read, then answers plain text and stops.
// Kept as a template literal so this file stays the single source of truth
// for the probe's canned model behavior.
const stubModule = join(here, 'wire-stub-adapter.mjs')
// Must exist before boot imports the stub plugin row below.
writeFileSync(stubModule, stubAdapterSource())
const patches = [
  ...loadOverlayPatches(NAME, join(baseDir, baseManifest.dsh?.bundle?.patch)),
  ...loadOverlayPatches(NAME, join(root, 'cordis.patch.yml')),
  { id: 'agent-presets', config: { default: 'standard', roots: [{ path: join(dirname(require.resolve('@deepseek-ai/dsh-agent-presets/package.json')), 'presets'), trust: 'system' }] } },
  { id: 'agent-default-model', config: { provider: 'stub', model: 'stub-model' } },
  { id: 'dsh-acp-interactive', config: { provider: 'stub', model: 'stub-model' } },
  { insert: [{ id: 'wire-stub-llm', name: stubModule }] },
]

await boot(NAME, join(root, 'boot.yml'), patches)
console.error('wire-probe: booted')

process.on('SIGTERM', () => process.exit(0))
process.on('SIGINT', () => process.exit(0))
process.stdin.resume()

// The stub adapter module body. Kept as a template literal so this file stays
// the single source of truth for the probe's canned model behavior. Declared
// as a hoisted function because it is written out before this line runs.
function stubAdapterSource() {
  return `
import { LlmAdapter } from '@deepseek-ai/dsh-llm'
export class StubAdapter extends LlmAdapter {
  providerInfo(provider) { return { id: provider, name: 'Stub' } }
  async listModels() {
    return [{ id: 'stub-model', name: 'stub-model', contextWindow: 128000, inputModalities: ['text'], outputModalities: ['text'] }]
  }
  async resolveModel(_provider, model) {
    return { provider: 'stub', id: model, name: 'stub-model', contextWindow: 128000, inputModalities: ['text'], outputModalities: ['text'] }
  }
  async *stream(options) {
    const sawResult = options.messages.some((m) => m.content.some((b) => b.type === 'tool-result'))
    if (!sawResult) {
      yield { type: 'text-delta', index: 0, text: 'Running bash.\\n' }
      yield { type: 'tool-call-delta', index: 1, id: 'call-1', name: 'bash', argumentsDelta: JSON.stringify({ command: 'cat hello.txt', description: 'Show file contents' }) }
      yield { type: 'block-end', index: 0, block: { type: 'text', text: 'Running bash.\\n' } }
      yield { type: 'block-end', index: 1, block: { type: 'tool-call', id: 'call-1', name: 'bash', arguments: JSON.stringify({ command: 'cat hello.txt', description: 'Show file contents' }) } }
      yield { type: 'finish', reason: { kind: 'tool-calls' } }
      return
    }
    const sawRead = options.messages.some((m) => m.content.some((b) => b.type === 'tool-result' && b.toolCallId === 'call-2'))
    if (!sawRead) {
      yield { type: 'tool-call-delta', index: 0, id: 'call-2', name: 'read', argumentsDelta: JSON.stringify({ file_path: 'hello.txt' }) }
      yield { type: 'block-end', index: 0, block: { type: 'tool-call', id: 'call-2', name: 'read', arguments: JSON.stringify({ file_path: 'hello.txt' }) } }
      yield { type: 'finish', reason: { kind: 'tool-calls' } }
      return
    }
    yield { type: 'text-delta', index: 0, text: 'done' }
    yield { type: 'block-end', index: 0, block: { type: 'text', text: 'done' } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}
export const apply = (ctx) => {
  ctx.effect(() => ctx.get('llm').registerAdapter(['stub'], new StubAdapter()), 'dsh-acp-wire-stub')
}
`
}
