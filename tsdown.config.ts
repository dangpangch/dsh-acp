// dsh-acp-v1 build — output layout matches the bundle contract:
//   src/bridge/index.ts -> lib/src/bridge/index.js (package main; cordis plugin export)
//   src/dev-bin.ts      -> lib/dev-bin.js          (standalone dev/test boot)
//   src/dev-boot.ts     -> lib/dev-boot.js         (shared dev boot recipe; wire-probe import)
// fixedExtension: false + package "type": "module" -> plain .js ESM outputs.
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'src/bridge/index': 'src/bridge/index.ts',
    'dev-bin': 'src/dev-bin.ts',
    'dev-boot': 'src/dev-boot.ts',
  },
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  outDir: 'lib',
  fixedExtension: false,
  clean: true,
  sourcemap: false,
})
