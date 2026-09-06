// The installed skill directories under .agents/ carry their own node:test
// self-check files (skills' verify-release / inject-lint / docker smoke);
// vitest must not pick them up as suites of this plugin.
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, '.agents/**'],
  },
})
