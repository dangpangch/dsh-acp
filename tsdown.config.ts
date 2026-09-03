// dsh-acp-interactive build — output layout matches the bundle contract:
//   src/plugin.ts    -> lib/plugin.js    (package main; cordis plugin export)
//   src/dev-bin.ts   -> lib/dev-bin.js   (standalone dev/test boot)
// fixedExtension: false + package "type": "module" -> plain .js ESM outputs.
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'src/bridge/index': 'src/bridge/index.ts',
    'dev-bin': 'src/dev-bin.ts',
  },
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  outDir: 'lib',
  fixedExtension: false,
  clean: true,
  sourcemap: false,
})
