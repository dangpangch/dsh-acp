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
 * Canonical thinking levels, in display order, shown only when the selected
 * model's support is genuinely unknown (the reasoning lookup failed) so the
 * thinking picker never disappears (values mirror the harness effort
 * vocabulary). A model that resolved but declares no efforts offers nothing:
 * listing levels the request guard would strip is advertising, not support.
 */
const CANONICAL_REASONING_LEVELS: readonly EffortLevel[] = [
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
 * The thought_level select's current value, validated against the options the
 * picker actually offers: an explicit session pick wins, else the model's
 * declared default effort, else the display-only `provider-default` — never
 * `off` (design §6.3). A pick the current model no longer supports (a restored
 * session snapshot from before a model or catalog change) falls back the same
 * way, so the select never points at an absent entry (the same stale-route
 * rule the model select applies). Under a failed lookup the canonical options
 * contain every canonical pick, so an unknown-support pick is kept (unknown,
 * not unsupported).
 */
export function thoughtLevelCurrentFor(
  current: string | undefined,
  reasoning: ModelReasoning | undefined,
): string {
  const pick = current ?? reasoning?.defaultEffort ?? PROVIDER_DEFAULT_REASONING_EFFORT
  if (thoughtLevelOptionOptions(reasoning).some((effort) => effort.id === pick)) return pick
  return reasoning?.defaultEffort ?? PROVIDER_DEFAULT_REASONING_EFFORT
}

/**
 * Options for a thought_level select (display-only provider-default first).
 * Mirroring the three reasoning states the bridge can observe
 * (model-config.zh.md §3.4): a resolved model offers exactly its declared
 * efforts — an empty list means it honors NO explicit effort, and the caller
 * hides the select — while a failed lookup (reasoning undefined, support
 * genuinely unknown) falls back to the canonical table. When the model names
 * no default effort the display-only `provider-default` entry is prepended so
 * the picker never has to default to the first declared level (`off` for the
 * canonical list) — which would misrepresent "provider default" as "thinking
 * off". The default NEVER falls back to `off`.
 */
export function thoughtLevelOptionOptions(
  reasoning: ModelReasoning | undefined,
): readonly EffortLevel[] {
  const efforts = reasoning !== undefined ? reasoning.efforts : CANONICAL_REASONING_LEVELS
  if (efforts.length === 0) return []
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

function permissionLabel(name: string): string {
  return PERMISSION_LABELS[name] ?? name
}

/** Write-permission select options from the preset (or sandbox) names. */
export function permissionSelectOptions(names: readonly string[]) {
  return names.map((name) => ({ value: name, name: permissionLabel(name), description: null }))
}

/** One roster row the preset selector can offer (slice of dsh `AgentPreset`). */
export interface PresetChoice {
  readonly id: string
  readonly name?: string | undefined
  readonly description?: string | undefined
  readonly broken?: string | undefined
}

/**
 * Detail shown when dsh refuses a preset switch because the session already
 * started (its `agent-preset/locked` failure): the composition is fixed at the
 * first turn, so the only honest advice is a new session.
 */
export const PRESET_LOCKED_DETAIL =
  'the agent preset is fixed once the session has started; open a new session to change it'

/**
 * User-facing detail for a failed `agentPresets.select`. The failure crosses
 * module/realm copies of the protocol error class, so it is identified
 * structurally — the `isDSHRemoteError` marker plus `code` — rather than with
 * `instanceof` (the protocol's own `remoteErrorOf` rule).
 */
export function presetChangeFailureDetail(error: unknown): string {
  const fallback = 'agent preset switch failed'
  if (typeof error !== 'object' || error === null) return fallback
  const failure = error as { isDSHRemoteError?: unknown; code?: unknown; message?: unknown }
  if (failure.isDSHRemoteError !== true) return fallback
  if (failure.code === 'agent-preset/locked') return PRESET_LOCKED_DETAIL
  return typeof failure.message === 'string' && failure.message.length > 0 ? failure.message : fallback
}

/**
 * Options for the preset select, or null when no roster row can be offered.
 * Broken rows stay out: a composition dsh already refused to compose would
 * only fail on pick. A current id the roster no longer supplies falls back to
 * the first offered option (the same stale-route rule the model select
 * applies), so the select never points at an absent entry. The label leads
 * with the id — what `DSH_ACP_PRESET` and the session log use — and appends the
 * preset's own display name in parentheses, so neither has to be looked up by
 * memory.
 */
export function presetSelectOptionList(
  rows: readonly PresetChoice[],
  current: string | undefined,
): { options: { value: string; name: string; description: string | null }[]; currentValue: string } | null {
  const usable = rows.filter((row) => row.broken === undefined)
  if (usable.length === 0) return null
  const options = usable.map((row) => ({
    value: row.id,
    name: row.name !== undefined && row.name !== row.id ? `${row.id} (${row.name})` : row.id,
    description: row.description ?? null,
  }))
  const currentValue = current !== undefined && options.some((option) => option.value === current)
    ? current
    : options[0]!.value
  return { options, currentValue }
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
