#!/usr/bin/env node
// Drives scripts/wire-probe.mjs over stdio and prints every session/update
// frame — the end-to-end wire view of a bash tool card (read-style: the title
// carries the command line, the captured output rides as a plain text
// content block the client renders collapsed with click-to-expand).
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { connect } from './acp-client.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const home = mkdtempSync(join(tmpdir(), 'dsh-acp-wire-drive-'))
const ws = join(home, 'ws')
mkdirSync(ws)
writeFileSync(join(ws, 'hello.txt'), 'hello from ws\n')

const client = connect(join(here, 'wire-probe.mjs'), { DSH_HOME: home, WIRE_WS: ws })

const init = await client.req('initialize', {
  protocolVersion: 1,
  clientCapabilities: { fs: { readTextFile: true, writeTextFile: true } },
})
if (init.result === undefined) {
  console.log('initialize failed:', JSON.stringify(init))
  process.exit(1)
}
const created = await client.req('session/new', { cwd: ws, mcpServers: [] })
if (created.result === undefined) {
  console.log('session/new failed:', JSON.stringify(created))
  process.exit(1)
}
const sessionId = created.result.sessionId
const answer = await client.req('session/prompt', {
  sessionId,
  prompt: [{ type: 'text', text: 'run: cat hello.txt' }],
}).catch((error) => ({ error: String(error) }))
console.log('session/prompt:', JSON.stringify(answer.result ?? answer.error ?? answer))
// Dump frames BEFORE closing stdin: the prompt reply already settled after
// the turn ended and the delivery tail drained, so every card is on stdout.
for (const frame of client.frames) {
  if (frame.method === 'session/update') {
    console.log('UPDATE', JSON.stringify(frame.params.update))
  }
}
client.closeStdin()
await client.exited
const err = client.stderrText()
if (err.length > 0) console.log('--- stderr (first 3000) ---\n' + err.slice(0, 3000))
process.exit(0)
