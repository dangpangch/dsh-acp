// session-list-load-delete + session-restore: durable session history over the
// real dev boot with an isolated DSH_HOME (design.zh.md §4/§6.1). The heavy spawn
// choreography and all content assertions live in scripts/history-probe.mjs
// (its children must not inherit resolver env like NODE_PATH, which breaks
// the cordis loader under vitest); this test just runs the probe and pins
// its exit code.
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
      execFileSync(process.execPath, [PROBE], { encoding: 'utf8', timeout: 120_000, stdio: 'pipe' })
    },
    130_000,
  )
})
