// P1-5 negative self-check: compareMounts must flag anything outside the
// golden baseline (extra tool, missing slash entry), and stay silent on an
// exact match.
import { describe, expect, it } from 'vitest'
import { compareMounts } from '../scripts/mount-matrix.mjs'

const golden = {
  tools: ['bash', 'read', 'todo_write'],
  slash: ['compact', 'skill:find-skills'],
}

describe('mount matrix comparator', () => {
  it('accepts an exact match', () => {
    expect(compareMounts(golden, { tools: golden.tools, slash: golden.slash })).toEqual([])
  })
  it('flags an unexpected tool (host-plane leak)', () => {
    const problems = compareMounts(golden, { tools: [...golden.tools, 'tool-web'], slash: golden.slash })
    expect(problems).toContain('tools: unexpected mount: tool-web')
  })
  it('flags a missing slash entry', () => {
    const problems = compareMounts(golden, { tools: golden.tools, slash: golden.slash.slice(1) })
    expect(problems).toContain('slash: missing mount: compact')
  })
})
