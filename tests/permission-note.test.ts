// Approval visibility (issue #1): while an escalation waits on the host, the
// wait itself must be visible in the conversation stream, and the permission
// request must actually reach the host. The bridge used to deadlock BEFORE
// sending it — `drainRecord` → `agent.whenIdle()` waited on the driver promise
// while the driver was awaiting that very approval. This probe deliberately
// answers nothing until the request has arrived, so a regression (deadlock, or
// a missing/misordered note) fails loudly instead of hanging.
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { connect } from '../scripts/acp-client.mjs'

const BIN = new URL('../scripts/wire-probe.mjs', import.meta.url).pathname
const NOTE = 'Waiting for your approval'

const withTimeout = async <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  let timer: NodeJS.Timeout | undefined
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label}: timed out after ${ms}ms — approval round hung`)), ms)
    })])
  } finally {
    clearTimeout(timer)
  }
}

describe('approval visibility probe (spawned wire-probe, isolated DSH_HOME)', () => {
  it('announces the wait on the stream before sending session/request_permission', async () => {
    const home = mkdtempSync(join(tmpdir(), 'dsh-acp-v1-approval-'))
    const ws = join(home, 'ws')
    mkdirSync(ws)
    writeFileSync(join(ws, 'hello.txt'), 'hello from ws\n')

    let permissionIndex = -1
    let answerPermission: ((result: unknown) => void) | undefined
    const arrived = Promise.withResolvers<void>()
    const client = connect(BIN, { DSH_HOME: home, WIRE_WS: ws }, [], (frame: { method: string }, reply: (result: unknown) => void) => {
      if (frame.method === 'session/request_permission') {
        // Capture, do NOT answer: the assertions below run while it is pending.
        permissionIndex = client.frames.indexOf(frame)
        answerPermission = reply
        arrived.resolve()
      } else {
        reply({})
      }
    })
    try {
      await withTimeout(client.req('initialize', {
        protocolVersion: 1,
        clientCapabilities: {},
      }), 30_000, 'initialize')
      const created = await withTimeout(client.req('session/new', { cwd: ws, mcpServers: [] }), 30_000, 'session/new')
      expect(created.error).toBeUndefined()
      const sessionId = created.result?.sessionId
      expect(typeof sessionId).toBe('string')
      // Pin the standing mode to the workspace-write floor: the probe escalates
      // to danger-full-access, which is only a legal widening from below.
      const configured = await withTimeout(client.req('session/set_config_option', {
        sessionId,
        configId: 'permission',
        value: 'workspace-write',
      }), 30_000, 'set_config_option permission')
      expect(configured.error).toBeUndefined()

      const prompt = client.req('session/prompt', { sessionId, prompt: [{ type: 'text', text: 'run the probe' }] })
      // The deadlock regression gate: with the old `drainRecord` this await
      // times out because the request never leaves the bridge.
      await withTimeout(arrived.promise, 45_000, 'session/request_permission')

      // The note must already be on the wire when the request arrives, and it
      // must precede the request in frame order.
      const noteIndex = client.frames.findIndex((frame) =>
        frame.method === 'session/update' &&
        frame.params?.update?.sessionUpdate === 'agent_message_chunk' &&
        typeof frame.params.update.content?.text === 'string' &&
        frame.params.update.content.text.includes(NOTE))
      expect(noteIndex).toBeGreaterThanOrEqual(0)
      expect(noteIndex).toBeLessThan(permissionIndex)

      answerPermission!({ outcome: { outcome: 'selected', optionId: 'allow-once' } })
      const reply = await withTimeout(prompt, 45_000, 'session/prompt')
      expect(reply.error).toBeUndefined()
      expect(reply.result?.stopReason).toBe('end_turn')

      client.closeStdin()
      expect(await client.exitCode()).toBe(0)
    } finally {
      client.closeStdin()
      await client.exitCode().catch(() => {})
    }
  }, 90_000)
})
