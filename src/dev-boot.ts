// Shared dev/test boot recipe: the patch stack every standalone boot of this
// bundle composes — @deepseek-ai/dsh-base rows, this package's
// cordis.patch.yml, and the dev agent-presets root. src/dev-bin.ts (bundled
// into lib/dev-bin.js) and scripts/wire-probe.mjs (which imports the built
// lib/dev-boot.js) share it so the two boots cannot drift apart.
import { dirname, join, resolve } from 'node:path'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { loadOverlayPatches } from '@deepseek-ai/dsh-app-boot'

/** Overlay patch ops as the boot loader consumes them (portable alias). */
type PatchOps = ReturnType<typeof loadOverlayPatches>

/** This package's root (lib/ in the built tree, src/ when run via tsx). */
function packageRoot(): string {
  const here = dirname(fileURLToPath(import.meta.url))
  return existsSync(join(here, 'package.json')) ? here : join(here, '..')
}

/** The empty entries root the include loader mounts; patches layer on top. */
export function rootEntriesPath(name: string): string {
  const entries = join(packageRoot(), 'boot.yml')
  if (existsSync(entries)) return entries
  throw new Error(`${name}: boot.yml not found next to the package root`)
}

/** This package's bundle patch ops. */
export function ownPatchOps(name: string): PatchOps {
  const patch = join(packageRoot(), 'cordis.patch.yml')
  if (!existsSync(patch)) throw new Error(`${name}: cordis.patch.yml not found next to the package root`)
  return loadOverlayPatches(name, patch)
}

/** dsh-base bundle patch ops — the shared base rows (llm, session, tools…). */
export function basePatchOps(name: string): PatchOps {
  const require = createRequire(import.meta.url)
  const baseDir = dirname(require.resolve('@deepseek-ai/dsh-base/package.json'))
  const manifest = JSON.parse(readFileSync(join(baseDir, 'package.json'), 'utf8'))
  const declared = manifest.dsh?.bundle?.patch
  if (typeof declared !== 'string') throw new Error(`${name}: @deepseek-ai/dsh-base declares no dsh.bundle.patch`)
  return loadOverlayPatches(name, join(baseDir, declared))
}

/**
 * Dev-only agent-presets overlay. The dsh CLI profile boot appends the shipped
 * preset root onto the `agent-presets` row itself; a standalone boot must name
 * its own root. Default: the presets shipped inside the installed
 * @deepseek-ai/dsh-agent-presets package, overridable with
 * DSH_ACP_PRESET_ROOT=<path> so a developer can point at the real deployment
 * root (e.g. the dsh install's config/agent-presets).
 */
export function presetOverlayOps() {
  const env = process.env.DSH_ACP_PRESET_ROOT
  const require = createRequire(import.meta.url)
  const defaultPath = dirname(require.resolve('@deepseek-ai/dsh-agent-presets/package.json')) + '/presets'
  const path = env !== undefined && env.length > 0 ? resolve(env) : defaultPath
  return [{
    id: 'agent-presets',
    config: { default: 'standard', roots: [{ path, trust: 'system' }] },
  }]
}
