// dsh-acp-interactive: standalone dev/test boot — the same composition the
// `dsh --profile acp` CLI path mounts (dsh-base bundle + this package's
// cordis.patch.yml), driven directly through @deepseek-ai/dsh-app-boot so
// tests can spawn it without a real $DSH_HOME profile. stdout stays
// JSON-RPC-only; every diagnostic rides stderr.
import { dirname, join, resolve } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { boot, installFailLoud, loadOverlayPatches } from '@deepseek-ai/dsh-app-boot'

const NAME = 'dsh-acp-interactive-dev'

function packageRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  return existsSync(join(here, 'package.json')) ? here : join(here, '..')
}

/** The empty entries root the include loader mounts; patches layer on top. */
function rootEntriesPath(): string {
  const root = packageRoot()
  for (const dir of [root, dirname(root)]) {
    if (existsSync(join(dir, 'boot.yml'))) return join(dir, 'boot.yml')
  }
  throw new Error(`${NAME}: boot.yml not found next to the package root`)
}

/** This package's bundle patch file. */
function ownPatchPath(): string {
  const root = packageRoot()
  for (const p of [join(root, 'cordis.patch.yml'), join(dirname(fileURLToPath(import.meta.url)), '..', 'cordis.patch.yml')]) {
    if (existsSync(p)) return p
  }
  throw new Error(`${NAME}: cordis.patch.yml not found next to the package root`)
}

/** dsh-base bundle patch ops — the shared base rows (llm, session, tools…). */
function basePatchOps() {
  const require = createRequire(import.meta.url)
  const baseDir = dirname(require.resolve('@deepseek-ai/dsh-base/package.json'))
  const manifest = JSON.parse(readFileSync(join(baseDir, 'package.json'), 'utf8'))
  const declared = manifest.dsh?.bundle?.patch
  if (typeof declared !== 'string') throw new Error(`${NAME}: @deepseek-ai/dsh-base declares no dsh.bundle.patch`)
  return loadOverlayPatches(NAME, join(baseDir, declared))
}

/**
 * Dev-only agent-presets overlay. The dsh CLI profile boot appends the shipped
 * preset root onto the `agent-presets` row itself; a standalone boot must name
 * its own root. Default: the checked-in test fixture copy of the shipped
 * presets (tests/fixtures/presets), overridable with
 * DSH_ACP_PRESET_ROOT=<path> so a developer can point at the real deployment
 * root (e.g. the dsh install's config/agent-presets).
 */
function presetOverlayOps() {
  const env = process.env.DSH_ACP_PRESET_ROOT
  const path = env !== undefined && env.length > 0
    ? resolve(env)
    : resolve(packageRoot(), 'tests/fixtures/presets')
  return [{
    id: 'agent-presets',
    config: {
      default: 'standard',
      roots: [{ path, trust: 'system' }],
    },
  }]
}

installFailLoud(NAME)

interface App {
  fiber?: { dispose(): Promise<unknown> }
}

let app: App | undefined
let disposed = false
process.stdout.on('error', () => {
  try {
    process.exit(0)
  } catch {
    /* ignore */
  }
})
async function disposeOnce() {
  if (disposed) return
  disposed = true
  await app?.fiber?.dispose()
}

let stdinEnded = false
process.stdin.on('end', () => {
  stdinEnded = true
})

const ownOps = loadOverlayPatches(NAME, ownPatchPath())
const userOps = process.env.DSH_ACP_OVERLAY !== undefined
  ? loadOverlayPatches(NAME, resolve(process.env.DSH_ACP_OVERLAY))
  : []
const patches = [...basePatchOps(), ...ownOps, ...presetOverlayOps(), ...userOps]

app = (await boot(NAME, rootEntriesPath(), patches)) as App

if (stdinEnded) {
  await disposeOnce()
  process.exit(0)
}
process.stdin.on('end', () => void disposeOnce().then(() => process.exit(0)))
process.on('SIGINT', () => void disposeOnce().then(() => process.exit(0)))
process.on('SIGTERM', () => void disposeOnce().then(() => process.exit(0)))
process.stdin.resume()
