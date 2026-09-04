// frame-purity: the served process answers initialize + session/new over a
// clean ndjson stdout and exits 0 on EOF (design.zh.md §6.1 `frame-purity`,
// stdout invariant). Component-level: real spawn of the built binary
// under an isolated DSH_HOME — never touches the real harness home.
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { connect } from '../scripts/acp-client.mjs'

const BIN = new URL('../lib/dev-bin.js', import.meta.url).pathname
const skip = !existsSync(BIN)
describe.skipIf(skip)('frame purity (spawned lib/dev-bin.js, isolated DSH_HOME)', () => {
  it(
    'initialize + session/new answer with pure ndjson results and EOF exits 0',
    async () => {
      const client = connect(BIN, { DSH_HOME: mkdtempSync(join(tmpdir(), 'dsh-acp-interactive-test-')) })
      const first = await client.req('initialize', { protocolVersion: 1, clientCapabilities: {} })
      const second = await client.req('session/new', { cwd: '/tmp', mcpServers: [] })
      client.closeStdin()
      const code = await client.exitCode()
      expect(code).toBe(0)
      expect(first.jsonrpc).toBe('2.0')
      expect(first.id).toBe(1)
      expect(first.result?.protocolVersion).toBe(1)
      expect(second.jsonrpc).toBe('2.0')
      expect(second.id).toBe(2)
      expect(second.result?.sessionId).toBeTruthy()
      // The deferred slash-catalog notification may or may not land before the
      // EOF-driven exit (it races the event loop) — but nothing else may be on
      // stdout: exactly two results plus at most one pure notification.
      const rest = client.frames.filter((frame) => frame.id === undefined)
      expect(rest.length).toBeLessThanOrEqual(1)
      if (rest[0] !== undefined) {
        expect(rest[0]!.method).toBe('session/update')
        expect(rest[0]!.params?.sessionId).toBe(second.result?.sessionId)
        expect(rest[0]!.params?.update?.sessionUpdate).toBe('available_commands_update')
      }
      expect(client.stderrText()).not.toContain('\x1b[31m') // no crash banners on the happy path
    },
    90_000,
  )
})
