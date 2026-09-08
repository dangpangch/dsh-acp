// P1-5 mount-matrix comparison shared by scripts/conformance.mjs (golden diff
// on every run) and tests/mount-matrix.test.ts (negative self-check). Pure
// and synchronous so both stay trivially testable.
export const compareMounts = (expected, actual) => {
  const problems = []
  for (const key of ['tools', 'slash']) {
    const want = [...(expected[key] ?? [])].sort()
    const got = [...(actual[key] ?? [])].sort()
    for (const name of got) {
      if (!want.includes(name)) problems.push(`${key}: unexpected mount: ${name}`)
    }
    for (const name of want) {
      if (!got.includes(name)) problems.push(`${key}: missing mount: ${name}`)
    }
  }
  return problems
}

/** One-line-per-surface matrix for the conformance report. */
export const mountMatrixText = (expected, actual) => {
  const lines = []
  for (const key of ['tools', 'slash']) {
    const want = [...(expected[key] ?? [])].sort()
    const got = [...(actual[key] ?? [])].sort()
    lines.push(`  ${key} (expected ${want.length} / actual ${got.length}):`)
    lines.push(`    expected: ${want.join(', ') || '(none)'}`)
    lines.push(`    actual:   ${got.join(', ') || '(none)'}`)
  }
  return lines.join('\n')
}
