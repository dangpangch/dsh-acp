// catalog: slash-catalog merge — command-plane entries + user-invocable
// skills folded into one announcement list (design.zh.md §6.6: Zed external
// ACP agents only surface slash items via available_commands_update, and Zed
// validates typed /name against that list).
import { describe, expect, it } from 'vitest'
import { mergeSlashCatalog } from '../src/bridge/catalog.js'
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

  it('appends user-invocable skills as plain slash entries', () => {
    const merged = mergeSlashCatalog([command('compact')], [skill('find-skills'), skill('ponytail')])
    expect(merged).toEqual([
      { name: 'compact', description: 'command compact' },
      { name: 'find-skills', description: 'skill find-skills' },
      { name: 'ponytail', description: 'skill ponytail' },
    ])
  })

  it('keeps skills that are not user-invocable out of the slash list', () => {
    const merged = mergeSlashCatalog([], [skill('model-only', false), skill('both')])
    expect(merged).toEqual([{ name: 'both', description: 'skill both' }])
  })

  it('lets a registered command win a same-name skill collision', () => {
    const merged = mergeSlashCatalog([command('plan')], [skill('plan'), skill('other')])
    expect(merged).toEqual([
      { name: 'other', description: 'skill other' },
      { name: 'plan', description: 'command plan' },
    ])
  })

  it('deduplicates repeated command rows and name-sorts the merged list', () => {
    const merged = mergeSlashCatalog(
      [command('plan'), command('compact'), command('plan', 'x')],
      [skill('find-skills')],
    )
    expect(merged.map((entry) => entry.name)).toEqual(['compact', 'find-skills', 'plan'])
  })

  it('empty catalogs produce an empty announcement list', () => {
    expect(mergeSlashCatalog([], [])).toEqual([])
    expect(mergeSlashCatalog([], [skill('hidden', false)])).toEqual([])
  })
})
