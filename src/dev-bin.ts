// dsh-acp-v1: standalone dev/test boot — the same composition the
// `dsh --profile acp` CLI path mounts (dsh-base bundle + this package's
// cordis.patch.yml), driven directly through @deepseek-ai/dsh-app-boot so
// tests can spawn it without a real $DSH_HOME profile. The patch stack itself
// lives in dev-boot.ts (shared with scripts/wire-probe.mjs). stdout stays
// JSON-RPC-only; every diagnostic rides stderr.
import { boot, installFailLoud } from '@deepseek-ai/dsh-app-boot'
import { basePatchOps, devOverlayOps, ownPatchOps, rootEntriesPath } from './dev-boot.js'

const NAME = 'dsh-acp-v1-dev'

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

// EOF race guard: a client that closes stdin while boot is still composing
// emits `end` before the post-boot listener below is attached — and an
// unlistened `end` is lost forever, leaving the process hanging with no exit
// path. Watch for it from the start and drain immediately after boot.
//
// The bridge holds the wire open for a quiet window after stdin end (its
// replies must land before the SDK's close aborts the outbound), and this
// boot has no `appExit` seat for the bridge to request shutdown through —
// so this fallback exit waits out that window before disposing, never
// racing an in-flight reply.
let stdinEnded = false
const stdinEndExits = () => {
  setTimeout(() => {
    void disposeOnce().then(() => process.exit(0))
  }, 400)
}
process.stdin.on('end', () => {
  stdinEnded = true
  stdinEndExits()
})

const patches = [...basePatchOps(NAME), ...ownPatchOps(NAME), ...devOverlayOps(NAME)]

app = (await boot(NAME, rootEntriesPath(NAME), patches)) as App

if (stdinEnded) {
  stdinEndExits()
}
process.on('SIGINT', () => void disposeOnce().then(() => process.exit(0)))
process.on('SIGTERM', () => void disposeOnce().then(() => process.exit(0)))
process.stdin.resume()
