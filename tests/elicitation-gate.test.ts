// elicitation boundary paths (optimization plan P0-3a): the three exits a
// wire client can drive — capability missing (initialize without
// `elicitation.form`), decline, cancel — must fail the ask tool with a coded
// error so the model continues instead of hanging the round. Reuses the
// wire-probe canned stub pipeline (its call-4 issues `ask_user_question`).
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { connect } from '../scripts/acp-client.mjs'

const BIN = new URL('../scripts/wire-probe.mjs', import.meta.url).pathname

const withTimeout = async <T>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  let timer: NodeJS.Timeout | undefined
  try {
    return await Promise.race([promise, new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`${label}: timed out after ${ms}ms — round hung`)), ms)
    })])
  } finally {
    clearTimeout(timer)
  }
}

/** One isolated probe home: temp DSH_HOME + a workspace with hello.txt. */
const freshHome = () => {
  const home = mkdtempSync(join(tmpdir(), 'dsh-acp-v1-elicitation-'))
  const ws = join(home, 'ws')
  mkdirSync(ws)
  writeFileSync(join(ws, 'hello.txt'), 'hello from ws\n')
  return { home, ws }
}

/** Drive initialize + session/new + one canned-stub prompt on a fresh boot. */
const runScenario = async (options: {
  elicitationForm: boolean
  onElicitation: 'decline' | 'cancel'
}, seen: { elicitationFrames: number }): Promise<{ stopReason?: string; text?: string; elicitationAttempted: boolean }> => {
  const { home, ws } = freshHome()
  const client = connect(BIN, { DSH_HOME: home, WIRE_WS: ws }, [], (frame: { method: string }, reply: (result: unknown) => void) => {
    if (frame.method === 'session/request_permission') {
      reply({ outcome: { outcome: 'selected', optionId: 'allow-once' } })
    } else if (frame.method === 'elicitation/create') {
      seen.elicitationFrames += 1
      reply({ action: options.onElicitation })
    } else {
      reply({})
    }
  })
  try {
    await withTimeout(client.req('initialize', {
      protocolVersion: 1,
      clientCapabilities: options.elicitationForm ? { elicitation: { form: {} } } : {},
    }), 30_000, 'initialize')
    const created = await withTimeout(client.req('session/new', { cwd: ws, mcpServers: [] }), 30_000, 'session/new')
    expect(created.error).toBeUndefined()
    const sessionId = created.result?.sessionId
    expect(typeof sessionId).toBe('string')
    const reply = await withTimeout(client.req('session/prompt', {
      sessionId,
      prompt: [{ type: 'text', text: 'run the probe' }],
    }), 45_000, 'session/prompt')
    client.closeStdin()
    const code = await client.exitCode()
    expect(code).toBe(0)
    const frames = client.frames
    const lastChunk = [...frames]
      .reverse()
      .find((f) => f.method === 'session/update' && f.params?.update?.sessionUpdate === 'agent_message_chunk')
    return {
      stopReason: reply.result?.stopReason,
      text: lastChunk?.params?.update?.content?.text ?? '',
      elicitationAttempted: seen.elicitationFrames > 0,
    }
  } finally {
    client.closeStdin()
    await client.exitCode().catch(() => {})
  }
}

describe('elicitation gate (spawned wire-probe, isolated DSH_HOME)', () => {
  it('missing elicitation.form capability fails the ask tool instead of hanging (no elicitation/create frame)', async () => {
    const seen = { elicitationFrames: 0 }
    const result = await runScenario({ elicitationForm: false, onElicitation: 'decline' }, seen)
    expect(result.elicitationAttempted).toBe(false)
    expect(result.stopReason).toBe('end_turn')
    expect(result.text).toContain('done')
  }, 90_000)

  it('a declined elicitation form fails the ask tool and the round completes', async () => {
    const seen = { elicitationFrames: 0 }
    const result = await runScenario({ elicitationForm: true, onElicitation: 'decline' }, seen)
    expect(result.elicitationAttempted).toBe(true)
    expect(result.stopReason).toBe('end_turn')
    expect(result.text).toContain('done')
  }, 90_000)

  it('a cancelled elicitation form fails the ask tool and the round completes', async () => {
    const seen = { elicitationFrames: 0 }
    const result = await runScenario({ elicitationForm: true, onElicitation: 'cancel' }, seen)
    expect(result.elicitationAttempted).toBe(true)
    expect(result.stopReason).toBe('end_turn')
    expect(result.text).toContain('done')
  }, 90_000)
})
