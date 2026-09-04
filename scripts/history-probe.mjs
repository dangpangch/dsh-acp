#!/usr/bin/env node
// Session-history functional probe over the dev boot (isolated DSH_HOME).
// Incremental writer so EOF never races an in-flight session/new.
// Phase A: new + close; B: list / resume / close / delete / list;
// C: resume of a deleted id errors with invalid params.
import { mkdtempSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { connect } from './acp-client.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const home = mkdtempSync(join(tmpdir(), 'dsh-acp-hist-'))
const ws = join(home, 'ws')
mkdirSync(ws)
const BIN = join(here, '..', 'lib', 'dev-bin.js')
const open = () => connect(BIN, { DSH_HOME: home })

;(async () => {
  // A
  const a = open()
  await a.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
  const created = await a.req('session/new', { cwd: ws, mcpServers: [] })
  const sessionId = created.result?.sessionId
  console.log('A: new sessionId =', sessionId, '| close:', JSON.stringify((await a.req('session/close', { sessionId })).result))
  a.closeStdin()
  console.log('A exit =', await a.exitCode())

  // B
  const b = open()
  await b.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
  const list1 = await b.req('session/list', { cwd: ws })
  console.log('B: list#1 =', JSON.stringify(list1.result?.sessions))
  const resume = await b.req('session/resume', { sessionId, cwd: ws })
  console.log('B: resume =', resume.result ? `configOptions=${resume.result.configOptions?.length}` : JSON.stringify(resume.error))
  await b.req('session/close', { sessionId })
  await b.req('session/delete', { sessionId })
  const list2 = await b.req('session/list', { cwd: ws })
  console.log('B: list#2 =', JSON.stringify(list2.result?.sessions))
  console.log('B stderr =', JSON.stringify(b.stderrText()))
  b.closeStdin()
  console.log('B exit =', await b.exitCode())

  // C
  const c = open()
  await c.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
  const bad = await c.req('session/resume', { sessionId, cwd: ws })
  console.log('C: resume-after-delete =', bad.result ? JSON.stringify(bad.result) : JSON.stringify(bad.error?.message))
  c.closeStdin()
  console.log('C exit =', await c.exitCode())

  // Assertions mirror the acceptance checks; a mismatch exits non-zero.
  const assert = (cond, label) => {
    if (!cond) {
      console.error(`PROBE FAIL: ${label}`)
      process.exit(2)
    }
  }
  assert(typeof sessionId === 'string' && sessionId.length > 0, 'session/new returned a sessionId')
  assert(await a.exitCode() === 0, 'phase A exit 0')
  assert(JSON.stringify(list1.result?.sessions ?? []).includes(sessionId), 'session/list lists the created session')
  assert((resume.result?.configOptions?.length ?? 0) >= 1, 'session/resume returns configOptions')
  assert(JSON.stringify(list2.result?.sessions ?? []) === '[]', 'session/delete removes the durable session')
  assert(bad.error?.code === -32602, 'resume of a deleted session fails with invalid params')
  assert(await b.exitCode() === 0 && await c.exitCode() === 0, 'phases B/C exit 0')
  console.log('PROBE OK')
  process.exit(0)
})()
