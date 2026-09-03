#!/usr/bin/env node
// Session-history functional probe over the dev boot (isolated DSH_HOME).
// Incremental writer so EOF never races an in-flight session/new.
// Phase A: new + close; B: list / resume / close / delete / list;
// C: resume of a deleted id errors with invalid params.
import { spawn } from 'node:child_process'
import { mkdtempSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const home = mkdtempSync(join(tmpdir(), 'dsh-acp-hist-'))
const ws = join(home, 'ws')
mkdirSync(ws)
const env = { ...process.env, DSH_HOME: home }
delete env.NODE_PATH
delete env.NODE_OPTIONS
const BIN = join(here, '..', 'lib', 'dev-bin.js')

function connect() {
  const child = spawn(process.execPath, [BIN], { env, stdio: ['pipe', 'pipe', 'pipe'] })
  let buffer = ''
  const errbuf = []
  child.stderr.on('data', (c) => errbuf.push(c.toString()))
  const pending = new Map()
  child.on('close', (code) => { child.code = code })
  child.stderrText = () => errbuf.join('')
  let nextId = 1
  const api = {
    child,
    req(method, params) {
      const id = nextId++
      const promise = new Promise((resolve) => pending.set(id, resolve))
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
      return promise
    },
    closeStdin() { child.stdin.end() },
    waitExit() { return child.code === undefined ? new Promise((r) => child.on('close', (code) => r(code))) : Promise.resolve(child.code) },
  }
  child.stdout.on('data', (c) => {
    buffer += c.toString()
    let idx
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx)
      buffer = buffer.slice(idx + 1)
      if (line.length === 0) continue
      const frame = JSON.parse(line)
      if (frame.id !== undefined) {
        const wait = pending.get(frame.id)
        if (wait) { pending.delete(frame.id); wait(frame) }
      }
    }
  })
  return api
}

;(async () => {
  // A
  const a = connect()
  await a.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
  const created = await a.req('session/new', { cwd: ws, mcpServers: [] })
  const sessionId = created.result?.sessionId
  console.log('A: new sessionId =', sessionId, '| close:', JSON.stringify((await a.req('session/close', { sessionId })).result))
  a.closeStdin()
  console.log('A exit =', await a.waitExit())

  // B
  const b = connect()
  await b.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
  const list1 = await b.req('session/list', { cwd: ws })
  console.log('B: list#1 =', JSON.stringify(list1.result?.sessions))
  const resume = await b.req('session/resume', { sessionId, cwd: ws })
  console.log('B: resume =', resume.result ? `configOptions=${resume.result.configOptions?.length}` : JSON.stringify(resume.error))
  await b.req('session/close', { sessionId })
  await b.req('session/delete', { sessionId })
  const list2 = await b.req('session/list', { cwd: ws })
  console.log('B: list#2 =', JSON.stringify(list2.result?.sessions))
  console.log('B stderr =', JSON.stringify(b.child.stderrText()))
  b.closeStdin()
  console.log('B exit =', await b.waitExit())

  // C
  const c = connect()
  await c.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
  const bad = await c.req('session/resume', { sessionId, cwd: ws })
  console.log('C: resume-after-delete =', bad.result ? JSON.stringify(bad.result) : JSON.stringify(bad.error?.message))
  c.closeStdin()
  console.log('C exit =', await c.waitExit())

  // Assertions mirror the acceptance checks; a mismatch exits non-zero.
  const assert = (cond, label) => {
    if (!cond) {
      console.error(`PROBE FAIL: ${label}`)
      process.exit(2)
    }
  }
  assert(typeof sessionId === 'string' && sessionId.length > 0, 'session/new returned a sessionId')
  assert(a.child.code === 0, 'phase A exit 0')
  assert(JSON.stringify(list1.result?.sessions ?? []).includes(sessionId), 'session/list lists the created session')
  assert((resume.result?.configOptions?.length ?? 0) >= 1, 'session/resume returns configOptions')
  assert(JSON.stringify(list2.result?.sessions ?? []) === '[]', 'session/delete removes the durable session')
  assert(bad.error?.code === -32602, 'resume of a deleted session fails with invalid params')
  assert(b.child.code === 0 && c.child.code === 0, 'phases B/C exit 0')
  console.log('PROBE OK')
  process.exit(0)
})()
