// config-options: model + thought_level selector builders (acceptance.md §4
// `config-options`; design.zh.md §6.3). Pure catalog math, no harness needed.
import { describe, expect, it } from 'vitest'
import {
  currentEffortFor,
  effortOptionsFor,
  guardReasoningEffort,
  modelSelectOptionList,
  permissionLabel,
  permissionSelectOptions,
  PROVIDER_DEFAULT_REASONING_EFFORT,
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
  it('uses the model-declared efforts verbatim when present', () => {
    expect(effortOptionsFor(REASONING)?.map((e) => e.id)).toEqual(['off', 'medium'])
  })

  it('falls back to the canonical level table when the model exposes no reasoning metadata', () => {
    const fallback = effortOptionsFor(undefined)
    expect(fallback?.map((e) => e.id)).toContain('off')
    expect(fallback?.map((e) => e.id)).toContain('max')
  })

  it('prepends the display-only provider-default entry only when no default effort is declared', () => {
    const withDefault = thoughtLevelOptionOptions({ ...REASONING, defaultEffort: 'medium' })
    expect(withDefault.map((e) => e.id)).toEqual(['off', 'medium'])
    const withoutDefault = thoughtLevelOptionOptions(REASONING)
    expect(withoutDefault[0]!.id).toBe(PROVIDER_DEFAULT_REASONING_EFFORT)
    expect(withoutDefault[0]!.name).toBe('Provider default')
  })

  it('never lets the current value fall back to off: unknown state renders provider-default', () => {
    expect(currentEffortFor(undefined, undefined)).toBe(PROVIDER_DEFAULT_REASONING_EFFORT)
    expect(currentEffortFor(undefined, 'medium')).toBe('medium')
    expect(currentEffortFor('off', undefined)).toBe('off') // an explicit user pick is honored
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
    expect(permissionLabel('read-only')).toBe('Read only')
    expect(permissionLabel('workspace-write')).toBe('Workspace write')
    expect(permissionLabel('danger-full-access')).toBe('Full access')
  })

  it('builds select options from preset names', () => {
    expect(permissionSelectOptions(['read-only', 'workspace-write', 'danger-full-access']).map((o) => o.value)).toEqual([
      'read-only',
      'workspace-write',
      'danger-full-access',
    ])
  })
})
