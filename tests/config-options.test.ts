// config-options: model / thought_level / permission / preset selector builders
// (design.zh.md §3.5 config options; §6.2 offline tests). Pure catalog math, no
// harness needed.
import { describe, expect, it } from 'vitest'
import {
  guardReasoningEffort,
  modelSelectOptionList,
  permissionSelectOptions,
  presetChangeFailureDetail,
  PRESET_LOCKED_DETAIL,
  presetSelectOptionList,
  PROVIDER_DEFAULT_REASONING_EFFORT,
  thoughtLevelCurrentFor,
  thoughtLevelOptionOptions,
  type CatalogProvider,
} from '../src/bridge/config-options.js'

const REASONING = {
  efforts: [
    { id: 'off', name: 'Off', description: null },
    { id: 'medium', name: 'Medium', description: null },
  ],
}

describe('modelSelectOptionList (flat provider/model pairs)', () => {
  const catalog: CatalogProvider[] = [
    { id: 'deepseek-official', name: 'DeepSeek', models: [{ id: 'deepseek-v4-flash', name: 'Flash' }, { id: 'deepseek-v4-pro', name: 'Pro' }] },
    { id: 'pi-ai', name: 'Pi AI', models: [] },
  ]

  it('flattens providers/models into provider/model select ids', () => {
    const result = modelSelectOptionList(catalog, { provider: 'deepseek-official', model: 'deepseek-v4-pro' })
    expect(result).not.toBeNull()
    expect(result!.options.map((o) => o.value)).toEqual([
      'deepseek-official/deepseek-v4-flash',
      'deepseek-official/deepseek-v4-pro',
    ])
    expect(result!.currentValue).toBe('deepseek-official/deepseek-v4-pro')
  })

  it('falls back to the first option when the current route is not in the catalog', () => {
    const result = modelSelectOptionList(catalog, { provider: 'missing', model: 'ghost' })
    expect(result!.currentValue).toBe('deepseek-official/deepseek-v4-flash')
  })

  it('returns null when no provider offers models (picker disappears, never lies)', () => {
    expect(modelSelectOptionList([{ id: 'pi-ai', name: 'Pi AI', models: [] }], { provider: 'pi-ai', model: 'x' })).toBeNull()
  })
})

describe('effort pickers (thinking-modes semantics)', () => {
  it('offers the model-declared efforts, with provider-default first when none is declared', () => {
    expect(thoughtLevelOptionOptions(REASONING).map((e) => e.id)).toEqual([PROVIDER_DEFAULT_REASONING_EFFORT, 'off', 'medium'])
    expect(thoughtLevelOptionOptions({ ...REASONING, defaultEffort: 'medium' }).map((e) => e.id)).toEqual(['off', 'medium'])
  })

  it('offers nothing for a resolved model that declares no efforts (picker hides)', () => {
    expect(thoughtLevelOptionOptions({ efforts: [] })).toEqual([])
  })

  it('falls back to the canonical level table only when support is unknown (lookup failed)', () => {
    const offered = thoughtLevelOptionOptions(undefined)
    expect(offered[0]!.id).toBe(PROVIDER_DEFAULT_REASONING_EFFORT)
    expect(offered.map((e) => e.id)).toContain('off')
    expect(offered.map((e) => e.id)).toContain('max')
  })

  it('prepends the display-only provider-default entry only when no default effort is declared', () => {
    const withDefault = thoughtLevelOptionOptions({ ...REASONING, defaultEffort: 'medium' })
    expect(withDefault.map((e) => e.id)).toEqual(['off', 'medium'])
    const withoutDefault = thoughtLevelOptionOptions(REASONING)
    expect(withoutDefault[0]!.id).toBe(PROVIDER_DEFAULT_REASONING_EFFORT)
    expect(withoutDefault[0]!.name).toBe('Provider default')
  })

  it('never lets the current value fall back to off: unknown state renders provider-default', () => {
    expect(thoughtLevelCurrentFor(undefined, undefined)).toBe(PROVIDER_DEFAULT_REASONING_EFFORT)
    expect(thoughtLevelCurrentFor(undefined, { ...REASONING, defaultEffort: 'medium' })).toBe('medium')
    expect(thoughtLevelCurrentFor('off', REASONING)).toBe('off') // an explicit user pick is honored
  })
})

describe('thoughtLevelCurrentFor (picker current value, stale-route rule)', () => {
  it('keeps a pick the offered options contain', () => {
    expect(thoughtLevelCurrentFor('medium', REASONING)).toBe('medium')
    expect(thoughtLevelCurrentFor(undefined, { ...REASONING, defaultEffort: 'medium' })).toBe('medium')
  })

  it('falls back to the declared default when the pick is no longer supported', () => {
    expect(thoughtLevelCurrentFor('high', { ...REASONING, defaultEffort: 'off' })).toBe('off')
  })

  it('falls back to provider-default when the pick is unsupported and no default is declared', () => {
    expect(thoughtLevelCurrentFor('high', REASONING)).toBe(PROVIDER_DEFAULT_REASONING_EFFORT)
  })

  it('keeps a canonical pick under a failed lookup (unknown, not unsupported)', () => {
    expect(thoughtLevelCurrentFor('medium', undefined)).toBe('medium')
    expect(thoughtLevelCurrentFor(undefined, undefined)).toBe(PROVIDER_DEFAULT_REASONING_EFFORT)
  })
})

describe('guardReasoningEffort (request-time strip)', () => {
  it('keeps a supported effort', () => {
    expect(guardReasoningEffort({ reasoningEffort: 'high' }, new Set(['high', 'max']))).toEqual({ reasoningEffort: 'high' })
  })

  it('strips an unsupported effort (display-only provider-default or stale canonical pick)', () => {
    const request: { reasoningEffort?: string; text: string } = { reasoningEffort: 'high', text: 'x' }
    expect(guardReasoningEffort(request, new Set(['off', 'low']))).toEqual({ text: 'x' })
    void request.reasoningEffort
  })

  it('keeps the request when the supported set is unknown (no model metadata yet)', () => {
    expect(guardReasoningEffort({ reasoningEffort: 'high' }, undefined)).toEqual({ reasoningEffort: 'high' })
  })

  it('passes through requests without an effort', () => {
    const request: { reasoningEffort?: string; text: string } = { text: 'x' }
    expect(guardReasoningEffort(request, new Set(['off']))).toEqual({ text: 'x' })
  })
})

describe('permission presets', () => {
  it('labels the three shipped presets', () => {
    expect(permissionSelectOptions(['read-only', 'workspace-write', 'danger-full-access']).map((o) => o.name)).toEqual([
      'Read only',
      'Workspace write',
      'Full access',
    ])
  })

  it('builds select options from preset names', () => {
    expect(permissionSelectOptions(['read-only', 'workspace-write', 'danger-full-access']).map((o) => o.value)).toEqual([
      'read-only',
      'workspace-write',
      'danger-full-access',
    ])
  })
})

describe('presetSelectOptionList (agent composition selector)', () => {
  const rows = [
    { id: 'standard', name: '标准模式', description: 'full coding agent' },
    { id: 'ptc', name: 'PTC 模式', description: 'programmatic tool calls' },
    { id: 'smoke' },
  ]

  it('labels each option with the id first, the display name in parentheses after it', () => {
    const built = presetSelectOptionList(rows, 'standard')!
    expect(built.options).toEqual([
      { value: 'standard', name: 'standard (标准模式)', description: 'full coding agent' },
      { value: 'ptc', name: 'ptc (PTC 模式)', description: 'programmatic tool calls' },
      { value: 'smoke', name: 'smoke', description: null },
    ])
    expect(built.currentValue).toBe('standard')
  })

  it('never repeats an id a display name already is', () => {
    expect(presetSelectOptionList([{ id: 'code', name: 'code' }], undefined)!.options[0]!.name).toBe('code')
  })

  it('drops broken rows: a composition dsh already refused would only fail on pick', () => {
    const built = presetSelectOptionList([...rows, { id: 'broken', broken: 'missing plugin' }], 'broken')!
    expect(built.options.map((option) => option.value)).toEqual(['standard', 'ptc', 'smoke'])
    expect(built.currentValue).toBe('standard')
  })

  it('returns null when no usable row exists (picker disappears, never lies)', () => {
    expect(presetSelectOptionList([], 'standard')).toBeNull()
    expect(presetSelectOptionList([{ id: 'broken', broken: 'x' }], 'broken')).toBeNull()
  })

  it('falls back to the first offered id when the current preset left the roster', () => {
    expect(presetSelectOptionList(rows, 'deleted')!.currentValue).toBe('standard')
    expect(presetSelectOptionList(rows, undefined)!.currentValue).toBe('standard')
  })
})

describe('presetChangeFailureDetail (refused preset switch)', () => {
  const remote = (code: string, message: string) => ({ isDSHRemoteError: true, code, message })

  it('maps the started-session lock to actionable advice', () => {
    expect(presetChangeFailureDetail(
      remote('agent-preset/locked', 'session "x" has already started; its agent preset is fixed'),
    )).toBe(PRESET_LOCKED_DETAIL)
  })

  it('passes any other protocol failure through with its own message', () => {
    expect(presetChangeFailureDetail(remote('agent-preset/invalid', 'failed to mount: missing plugin')))
      .toBe('failed to mount: missing plugin')
    expect(presetChangeFailureDetail(remote('agent-preset/not-found', 'no such preset')))
      .toBe('no such preset')
  })

  it('never treats a non-protocol error object as a preset failure', () => {
    expect(presetChangeFailureDetail(new Error('boom'))).toBe('agent preset switch failed')
    expect(presetChangeFailureDetail(undefined)).toBe('agent preset switch failed')
    expect(presetChangeFailureDetail({ code: 'agent-preset/locked', message: 'not really a RemoteError' }))
      .toBe('agent preset switch failed')
    expect(presetChangeFailureDetail(remote('agent-preset/locked', ''))).toBe(PRESET_LOCKED_DETAIL)
  })
})
