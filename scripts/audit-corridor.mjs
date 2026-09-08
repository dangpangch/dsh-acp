#!/usr/bin/env node
// P3-2 thin corridor wrapper:  pnpm audit:corridor <from> <to>
// - Fails fast when this package's @deepseek-ai/* corridor is not uniformly
//   pinned (drift check).
// - Prints the upgrade-corridor runbook for <from> -> <to> and points at the
//   dsh-upgrade-audit skill when it is installed locally. The full audit is
//   agent-driven (version-corridor cards, seven touchpoints); this wrapper
//   keeps the entry point and the preflight deterministic.
import { readFileSync } from 'node:fs'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const [from, to] = process.argv.slice(2)

const failures = []
const check = (ok, label, detail = '') => {
  if (!ok) failures.push(`${label}${detail ? `: ${detail}` : ''}`)
  console.error(`[audit:corridor] ${ok ? 'ok' : 'FAIL'} — ${label}${detail ? ` (${detail})` : ''}`)
  return ok
}

if (from === undefined || to === undefined) {
  console.error('usage: pnpm audit:corridor <from-dsh-version> <to-dsh-version>   (e.g. 0.1.2-rc.1 0.1.3)')
  process.exit(2)
}

// 1. Drift check: every dsh-corridor runtime dependency (@deepseek-ai/dsh-*,
// NOT cordis/schemastery families) shares one pinned version.
const harnessDeps = Object.entries(manifest.dependencies)
  .filter(([name]) => name.startsWith('@deepseek-ai/dsh-'))
const versions = [...new Set(harnessDeps.map(([, version]) => version))]
check(versions.length === 1, 'uniform @deepseek-ai/* pin', versions.join(', ') || '(none)')
check(manifest.dependencies['@deepseek-ai/dsh-agent'] !== undefined, 'corridor seat present (@deepseek-ai/dsh-agent)')
const current = versions[0] ?? '(none)'
check(current === from, `current pin is ${from}`, `found ${current}`)

// 2. Runbook for the corridor move.
console.error(`
[audit:corridor] upgrade runbook ${from} -> ${to}
1. Bump every @deepseek-ai/* dependency in package.json (and devDependencies
   that mirror host types) to ${to}; pnpm install; commit the lockfile.
2. Run the dsh-upgrade-audit corridor for ${from} -> ${to}: version cards,
   seven-class touchpoint preflight, event-name surface diff. When the skill
   is installed locally it lives at .agents/skills/dsh-upgrade-audit
   (SKILL.md) — otherwise install the dsh-upgrade-audit skill first.
3. Rerun the bridge gates: pnpm typecheck && pnpm test &&
   node scripts/conformance.mjs && node scripts/preset-smoke.mjs.
4. Re-baseline the mount golden when the ${to} standard preset changed:
   boot a session with DSH_ACP_SNAPSHOT_MOUNTS=1 (see scripts/conformance.mjs)
   and diff/copy the sidecar into scripts/standard-mounts.json, explaining the
   change in the commit.
5. Record the audit in docs/ (mirror docs/compat-audit-0.1.2-rc.1.zh.md).`)

if (failures.length > 0) {
  console.error(`\nCORRIDOR PREFLIGHT FAIL (${failures.length}):`)
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log('\nCORRIDOR PREFLIGHT OK — run the audit skill for the full corridor.')
