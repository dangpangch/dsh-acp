// catalog: slash-catalog merge — command-plane entries + user-invocable
// skills folded into one announcement list (design.zh.md §6.6: Zed external
// ACP agents only surface slash items via available_commands_update, and Zed
// validates typed /name against that list). Naming mirrors pi-acp: skills are
// announced as `skill:<name>` so the popup reads `/skill:find-skills`, while
// commands keep plain names; the bridge normalizes `/skill:<name>` back to the
// bare `/name` gesture on the prompt path. Result is partitioned commands
// first then skills, each block in registry order.
import { describe, expect, it } from 'vitest'
import { SKILL_SLASH_PREFIX, mergeSlashCatalog, normalizeSkillSlashText } from '../src/bridge/catalog.js'
import type { SlashCommandEntry, SlashSkillEntry } from '../src/bridge/catalog.js'

const command = (name: string, hint?: string): SlashCommandEntry => ({
  name,
  description: `command ${name}`,
  ...(hint !== undefined ? { inputHint: hint } : {}),
})

const skill = (name: string, userInvocable = true): SlashSkillEntry => ({
  name,
  description: `skill ${name}`,
  userInvocable,
})

describe('mergeSlashCatalog', () => {
  it('keeps command-plane entries unchanged (name + description + input hint)', () => {
    expect(mergeSlashCatalog([command('compact', 'optional')], [])).toEqual([
      { name: 'compact', description: 'command compact', input: 'optional' },
    ])
    expect(mergeSlashCatalog([command('goal')], [])).toEqual([{ name: 'goal', description: 'command goal' }])
  })

  it('announces skills with the skill: prefix and plain descriptions', () => {
    expect(mergeSlashCatalog([], [skill('find-skills'), skill('ponytail')])).toEqual([
      { name: 'skill:find-skills', description: 'skill find-skills' },
      { name: 'skill:ponytail', description: 'skill ponytail' },
    ])
  })

  it('partitions commands first then skills, preserving each block order', () => {
    const merged = mergeSlashCatalog(
      [command('compact'), command('goal'), command('permission')],
      [skill('find-skills'), skill('ponytail')],
    )
    expect(merged).toEqual([
      { name: 'compact', description: 'command compact' },
      { name: 'goal', description: 'command goal' },
      { name: 'permission', description: 'command permission' },
      { name: 'skill:find-skills', description: 'skill find-skills' },
      { name: 'skill:ponytail', description: 'skill ponytail' },
    ])
  })

  it('keeps skills that are not user-invocable out of the slash list', () => {
    const merged = mergeSlashCatalog([], [skill('model-only', false), skill('both')])
    expect(merged).toEqual([{ name: 'skill:both', description: 'skill both' }])
  })

  it('a command and a same-named skill can coexist under different names', () => {
    const merged = mergeSlashCatalog([command('plan')], [skill('plan'), skill('other')])
    expect(merged).toEqual([
      { name: 'plan', description: 'command plan' },
      { name: 'skill:plan', description: 'skill plan' },
      { name: 'skill:other', description: 'skill other' },
    ])
  })

  it('deduplicates repeated command and skill rows without re-sorting across blocks', () => {
    const merged = mergeSlashCatalog([command('plan'), command('compact'), command('plan', 'x')], [skill('find-skills'), skill('find-skills')])
    expect(merged.map((entry) => entry.name)).toEqual(['plan', 'compact', 'skill:find-skills'])
  })

  it('empty catalogs produce an empty announcement list', () => {
    expect(mergeSlashCatalog([], [])).toEqual([])
    expect(mergeSlashCatalog([], [skill('hidden', false)])).toEqual([])
  })

  it('exposes the skill slash prefix used by both announce and prompt normalization', () => {
    expect(SKILL_SLASH_PREFIX).toBe('skill:')
  })
})

describe('normalizeSkillSlashText', () => {
  it('rewrites a leading picked /skill:<name> back to the bare /name gesture', () => {
    expect(normalizeSkillSlashText('/skill:find-skills')).toBe('/find-skills')
    expect(normalizeSkillSlashText('/skill:find-skills 帮我找一个工具')).toBe('/find-skills 帮我找一个工具')
  })

  it('rewrites every word-bounded skill token in mid-sentence text', () => {
    expect(normalizeSkillSlashText('请 /skill:ponytail 处理这段')).toBe('请 /ponytail 处理这段')
    expect(normalizeSkillSlashText('a /skill:find-skills b /skill:ponytail c')).toBe('a /find-skills b /ponytail c')
  })

  it('leaves plain commands and unrelated slashes untouched', () => {
    expect(normalizeSkillSlashText('/plan 实现步骤')).toBe('/plan 实现步骤')
    expect(normalizeSkillSlashText('/permission')).toBe('/permission')
    expect(normalizeSkillSlashText('/compact')).toBe('/compact')
  })

  it('does not mangle non-skill lookalikes (paths, fractions, colons)', () => {
    expect(normalizeSkillSlashText('/usr/bin/env')).toBe('/usr/bin/env')
    expect(normalizeSkillSlashText('see /skill:')).toBe('see /skill:')
    expect(normalizeSkillSlashText('/skill:')).toBe('/skill:')
    expect(normalizeSkillSlashText('check /skill:not-kebab-')).toBe('check /skill:not-kebab-')
  })
})
