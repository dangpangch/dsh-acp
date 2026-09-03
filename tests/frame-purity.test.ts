// frame-purity: the served process answers initialize + session/new over a
// clean ndjson stdout and exits 0 on EOF (acceptance.md §2/§4 `frame-purity`,
// §4.3 stdout invariant). Component-level: real spawn of the built binary
// under an isolated DSH_HOME — never touches the real harness home.
import { spawn } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const BIN = new URL('../lib/dev-bin.js', import.meta.url).pathname

function runSmoke(input: string, env: NodeJS.ProcessEnv): Promise<{ code: number | null; lines: string[]; stderr: string }> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [BIN], {
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    const stdout: Buffer[] = []
    const stderr: Buffer[] = []
    child.stdout.on('data', (chunk: Buffer) => stdout.push(chunk))
    child.stderr.on('data', (chunk: Buffer) => stderr.push(chunk))
    child.on('error', reject)
    child.on('close', (code) => {
      resolve({
        code,
        lines: Buffer.concat(stdout).toString('utf8').split('\n').filter((line) => line.length > 0),
        stderr: Buffer.concat(stderr).toString('utf8'),
      })
    })
    child.stdin.end(input)
  })
}

const skip = !existsSync(BIN)
describe.skipIf(skip)('frame purity (spawned lib/dev-bin.js, isolated DSH_HOME)', () => {
  const env: NodeJS.ProcessEnv = {
    ...process.env,
    DSH_HOME: mkdtempSync(join(tmpdir(), 'dsh-acp-interactive-test-')),
  }

  it(
    'initialize + session/new answer with pure ndjson results and EOF exits 0',
    async () => {
      const input = [
        '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1,"clientCapabilities":{}}}',
        '{"jsonrpc":"2.0","id":2,"method":"session/new","params":{"cwd":"/tmp","mcpServers":[]}}',
        '',
      ].join('\n')
      const { code, lines, stderr } = await runSmoke(input, env)
      expect(code).toBe(0)
      // Two request results are always answered; after the session/new reply
      // the bridge defers one available_commands_update notification past the
      // response (design §6.6 — Zed ignores notifications for session ids it
      // does not know yet). Whether that deferred frame lands before the
      // EOF-driven exit races the event loop, so expect the two results plus
      // at most one pure notification and pin down each frame's shape.
      expect(lines.length).toBeGreaterThanOrEqual(2)
      expect(lines.length).toBeLessThanOrEqual(3)
      const frames = lines.map(
        (line) =>
          JSON.parse(line) as {
            jsonrpc?: string
            id?: number
            method?: string
            result?: { protocolVersion?: number; sessionId?: string }
            params?: { sessionId?: string; update?: { sessionUpdate?: string } }
          },
      )
      const first = frames[0]!
      const second = frames[1]!
      expect(first.jsonrpc).toBe('2.0')
      expect(first.id).toBe(1)
      expect(first.result?.protocolVersion).toBe(1)
      expect(second.jsonrpc).toBe('2.0')
      expect(second.id).toBe(2)
      expect(second.result?.sessionId).toBeTruthy()
      if (frames[2] !== undefined) {
        // Deferred slash catalog: a notification, never a third result or junk.
        expect(frames[2]!.jsonrpc).toBe('2.0')
        expect(frames[2]!.id).toBeUndefined()
        expect(frames[2]!.method).toBe('session/update')
        expect(frames[2]!.params?.sessionId).toBe(second.result?.sessionId)
        expect(frames[2]!.params?.update?.sessionUpdate).toBe('available_commands_update')
      }
      expect(stderr).not.toContain('\x1b[31m') // no crash banners on the happy path
    },
    90_000,
  )
})
