// session-list-load-delete + session-restore: durable session history over the
// real dev boot with an isolated DSH_HOME (acceptance.md §4). The heavy spawn
// choreography lives in scripts/history-probe.mjs (its children must not
// inherit resolver env like NODE_PATH, which breaks the cordis loader under
// vitest); this test executes the probe and asserts its exit + verdict.
import { execFileSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const PROBE = join(dirname(fileURLToPath(import.meta.url)), '..', 'scripts', 'history-probe.mjs')
const BIN = join(dirname(fileURLToPath(import.meta.url)), '..', 'lib', 'dev-bin.js')
const skip = !existsSync(BIN)

describe.skipIf(skip)('session history probe (spawned dev boot, isolated DSH_HOME)', () => {
  it(
    'new/close -> list -> resume -> delete -> resume-after-delete fails',
    () => {
      const out = execFileSync(process.execPath, [PROBE], { encoding: 'utf8', timeout: 120_000 })
      expect(out).toContain('PROBE OK')
      expect(out).toContain('list#2 = []')
      expect(out).toContain('resume-after-delete = "Invalid params')
    },
    130_000,
  )
})
