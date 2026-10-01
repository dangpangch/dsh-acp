// Shared dev/test boot recipe: the patch stack every standalone boot of this
// bundle composes — @deepseek-ai/dsh-base's declared patch, then every file this
// package declares under `dsh.bundle.patch` (cordis.patch.yml plus the
// presets/*.patch.yml declarations, in order), then an optional dev overlay.
// src/dev-bin.ts (bundled into lib/dev-bin.js) and scripts/wire-probe.mjs
// (which imports the built lib/dev-boot.js) share it so the two boots cannot
// drift apart. The order mirrors the dsh CLI profile boot: bundle patch layers
// first, the profile/dev overlay last.
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

/**
 * This package's bundle patch ops, in `dsh.bundle.patch` order. The declaration
 * is a single path or a list (the 0.2.0 preset architecture needs the four
 * preset files to follow cordis.patch.yml), exactly as the dsh profile boot
 * reads it.
 */
export function ownPatchOps(name: string): PatchOps {
  const root = packageRoot()
  const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')) as {
    dsh?: { bundle?: { patch?: unknown } }
  }
  const declared = manifest.dsh?.bundle?.patch
  const files = typeof declared === 'string' ? [declared] : declared
  if (!Array.isArray(files) || !files.every((file) => typeof file === 'string')) {
    throw new Error(`${name}: dsh.bundle.patch must be a file path or a list of file paths`)
  }
  return files.flatMap((file) => {
    const patch = join(root, file)
    if (!existsSync(patch)) throw new Error(`${name}: bundle patch ${file} not found next to the package root`)
    return loadOverlayPatches(name, patch)
  })
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
 * Dev-only extra patch layer: `DSH_ACP_DEV_PATCH=<path>` names one more patch
 * file appended after this bundle's layers. dsh 0.2.0's preset registry scans
 * no directories — a new preset is an inserted `@deepseek-ai/dsh-agent-preset`
 * row — so the probes author one here the way a deployment installs one.
 * Unset means no extra layer.
 */
export function devOverlayOps(name: string): PatchOps {
  const env = process.env.DSH_ACP_DEV_PATCH
  if (env === undefined || env.trim() === '') return []
  return loadOverlayPatches(name, resolve(env))
}
