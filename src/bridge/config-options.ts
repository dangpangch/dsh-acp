// Pure builders for the ACP session configuration selectors that Zed renders
// as dropdowns (`configOptions` on session/new | load; docs/design.zh.md §3.5).
// Everything here is dependency-free and unit-testable; the bridge module
// feeds service data in and these return the wire shapes.
//
// Zed quirks this module encodes (design appendix A / B): Zed ignores
// `models`/`modes` whenever `configOptions` is present, so every user-visible
// selector must be a config option with the right category; `thought_level`
// values ride the harness reasoning-effort vocabulary.

/** Display-only thinking-level id meaning "let the provider decide". */
export const PROVIDER_DEFAULT_REASONING_EFFORT = 'provider-default'

export interface EffortLevel {
  readonly id: string
  readonly name: string
  readonly description: string | null
}

/**
 * Canonical thinking levels, in display order, shown when the selected model
 * exposes no reasoning metadata of its own so the thinking picker never
 * disappears (values mirror the harness effort vocabulary).
 */
export const CANONICAL_REASONING_LEVELS: readonly EffortLevel[] = [
  { id: 'off', name: 'Off', description: null },
  { id: 'minimal', name: 'Minimal', description: null },
  { id: 'low', name: 'Low', description: null },
  { id: 'medium', name: 'Medium', description: null },
  { id: 'high', name: 'High', description: null },
  { id: 'xhigh', name: 'Xhigh', description: null },
  { id: 'max', name: 'Max', description: null },
]

/** Reasoning metadata as resolved from `ctx.llm.resolveModelInfo`. */
export interface ModelReasoning {
  readonly efforts: readonly EffortLevel[]
  readonly defaultEffort?: string | undefined
}

/**
 * The thinking levels to offer for one model: the model's own declared
 * efforts when present, else the canonical fallback table. When the model
 * names no default effort the display-only `provider-default` entry is
 * prepended so the picker never has to default to the first declared level
 * (`off` for the canonical list) — which would misrepresent "provider
 * default" as "thinking off". The default NEVER falls back to `off`.
 */
export function effortOptionsFor(
  reasoning: ModelReasoning | undefined,
): readonly EffortLevel[] {
  const declared = reasoning?.efforts
  if (declared !== undefined && declared.length > 0) return declared
  return CANONICAL_REASONING_LEVELS
}

/**
 * The picker's current effort id: an explicit session pick wins, else the
 * model's declared default effort, else the display-only `provider-default`
 * entry. Never falls back to `off` (design §6.3).
 */
export function currentEffortFor(
  current: string | undefined,
  defaultEffort: string | undefined,
): string {
  return current ?? defaultEffort ?? PROVIDER_DEFAULT_REASONING_EFFORT
}

/** Options for a thought_level select (display-only provider-default first). */
export function thoughtLevelOptionOptions(
  reasoning: ModelReasoning | undefined,
): readonly EffortLevel[] {
  const efforts = effortOptionsFor(reasoning)
  if (reasoning?.defaultEffort !== undefined) return efforts
  return [
    { id: PROVIDER_DEFAULT_REASONING_EFFORT, name: 'Provider default', description: null },
    ...efforts,
  ]
}

/**
 * Strip a reasoning effort the current model cannot honor from every agent
 * request. `provider-default` never matches a real effort (display-only), and
 * a pick from the canonical fallback can name a level the model does not
 * declare — the harness rejects such efforts on every request
 * (UNSUPPORTED_REASONING_EFFORT), so the guard keeps the picker from breaking
 * a session. Unknown supported-set (no model metadata yet) keeps the request.
 */
export function guardReasoningEffort<T extends { reasoningEffort?: string }>(
  request: T,
  supported: ReadonlySet<string> | undefined,
): T {
  if (request.reasoningEffort === undefined || supported === undefined || supported.has(request.reasoningEffort)) return request
  const { reasoningEffort: _stripped, ...rest } = request
  return rest as T
}

/** Human-readable label for a permission preset key. */
const PERMISSION_LABELS: Readonly<Record<string, string>> = {
  'read-only': 'Read only',
  'workspace-write': 'Workspace write',
  'danger-full-access': 'Full access',
}

export function permissionLabel(name: string): string {
  return PERMISSION_LABELS[name] ?? name
}

/** Write-permission select options from the preset (or sandbox) names. */
export function permissionSelectOptions(names: readonly string[]) {
  return names.map((name) => ({ value: name, name: permissionLabel(name), description: null }))
}

export interface CatalogModel {
  readonly id: string
  readonly name?: string | undefined
  readonly description?: string | null | undefined
}

export interface CatalogProvider {
  readonly id: string
  readonly name?: string | undefined
  readonly models: readonly CatalogModel[]
}

export interface CurrentRoute {
  readonly provider: string | undefined
  readonly model: string | undefined
}

/**
 * Model select options from a fetched provider/model catalog (provider/model
 * pairs flattened into `provider/model` ids so a pick can switch providers
 * too). Returns null when no discoverable models exist.
 */
export function modelSelectOptionList(
  catalog: readonly CatalogProvider[],
  current: CurrentRoute,
): { options: { value: string; name: string; description: string | null }[]; currentValue: string } | null {
  const options: { value: string; name: string; description: string | null }[] = []
  for (const provider of catalog) {
    for (const model of provider.models) {
      options.push({
        value: `${provider.id}/${model.id}`,
        name: `${provider.name ?? provider.id} / ${model.name ?? model.id}`,
        description: model.description ?? null,
      })
    }
  }
  if (options.length === 0) return null
  const composed = current.provider !== undefined && current.model !== undefined
    ? `${current.provider}/${current.model}`
    : undefined
  // Only a route the catalog actually offers can be the current value; a stale
  // or dormant route falls back to the first discoverable option so the Zed
  // select never points at an absent entry.
  const currentValue = composed !== undefined && options.some((option) => option.value === composed)
    ? composed
    : options[0]!.value
  return { options, currentValue }
}
