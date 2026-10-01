# Changelog

All notable changes to dsh-acp-v1 (formerly dsh-acp-interactive).

## [Unreleased] — 0.5.0 (dsh 0.1.5-rc.1 → 0.2.0-rc.2)

### Fixed (the preset selector disappeared from Zed)

- dsh 0.2.0 replaced the rooted `@deepseek-ai/dsh-agent-presets` package with
  a declarative registry: the `agent-presets` row this bundle inserted no
  longer imports, so `ctx.get('agentPresets')` was undefined and the bridge
  never advertised the `preset` session option — Zed's agent panel showed
  Model / Thought Level / Write permission but no mode selector. The bundle now
  wires the 0.2.0 architecture: an `agent-preset-registry` row
  (`default: standard`) plus the four shipped declarations as
  `presets/{standard,ptc,minimal,cordis}.patch.yml`
  (`@deepseek-ai/dsh-agent-preset` rows, listed in `package.json`
  `dsh.bundle.patch`), and the base agent-plane rows are disabled so each
  session's preset owns its tool surface (base now ships them enabled for the
  TUI; leaving them on would double-register every tool). Verified on a real
  `dsh --profile acp` 0.2.0-rc.2 deployment: `session/new` advertises
  `preset` with Standard / PTC / Minimal / Cordis.

### Added (cordis creator mode mounts on a base-only profile)

- The `cordis` preset's `tool-cordis` row injects the `cordisInspect`
  registry, which only the official web-app bundle provided — so on a
  base-only ACP profile creator mode was a broken roster row and never
  appeared. The bundle patch now ships the same two host rows the web-app
  bundle uses (`cordis-host-runner` + `cordis-inspect-providers`), and the dev
  harness depends on both packages. `DSH_ACP_PRESET=cordis` composes a session
  (29 tools, including `cordis_inspect_list` / `cordis_inspect_query`), and
  the preset selector offers all four modes.

### Changed (corridor move)

- All `@deepseek-ai/dsh-*` dependencies and devDependencies pinned
  `0.1.5-rc.1` → `0.2.0-rc.2`; `@deepseek-ai/cordis` `4.0.2` → `4.0.4`;
  `@deepseek-ai/schemastery` `3.18.2` → `3.18.4`; ACP SDK stays `1.4.0`.
  `@deepseek-ai/dsh-agent-presets` is gone; the dev harness now depends on
  `@deepseek-ai/dsh-agent-preset` + `@deepseek-ai/dsh-agent-preset-registry`.
  Lockfile regenerated with no mixed cohort, and the pnpm 11
  `minimumReleaseAgeExclude` list regenerated for the cohort (150 entries).
- Evidence and the full old→new ledger: `docs/compat-audit-0.2.0-rc.2.zh.md`
  (the upgrade skill's version cards stop at `0.1.2-rc.1`; the
  `0.1.5-rc.1 → 0.2.0-rc.2` segment is a declared gap derived from the
  materialized npm trees, the real profile cohort, and the repo gates).
- Mount golden re-baselined on the new corridor: `tool-ralph` is
  `disabled: true` in the 0.2.0 `standard` preset, so the standard surface is
  26 tools (`scripts/standard-mounts.json`).

### Changed (dev/test harness)

- `DSH_ACP_PRESET_ROOT` and the `.agent-presets/<id>/` user root are gone with
  the 0.2.0 registry ("neither scans directories nor accepts preset paths").
  The standalone boot now loads every `dsh.bundle.patch` layer of this package
  (via `src/dev-boot.ts`) and accepts `DSH_ACP_DEV_PATCH=<patch.yml>` to append
  one more layer — the seam `scripts/conformance.mjs` and
  `scripts/preset-smoke.mjs` use to author their probe presets as
  `@deepseek-ai/dsh-agent-preset` rows.
- `scripts/wire-stub-adapter.mjs` matches tool results on the 0.2.0 shape
  (a first-class `role: 'tool'` message with `toolCallId`); the old
  `tool-result` content-block probe never matched, so the stub re-issued the
  same call forever and the approval/elicitation probes timed out.
- `vitest.config.ts` also excludes the `.claude/` and `.zcode/` skill mirrors,
  whose node:test self-checks are not suites of this plugin.

## 0.4.0 (dsh 0.1.2-rc.1 → 0.1.5-rc.1)

### Added (pre-turn preset selector)

- The dsh agent preset is now a session config option, not only a deployment
  field: a blank session advertises a `preset` select (`category: "preset"`,
  built from the mounted roster — shipped presets render the bridge's English
  display names (`Standard`, `PTC`, `Minimal`, `Cordis`) and descriptions,
  since their preset files ship Chinese text, while an authored row keeps the
  id-first label with its display name in parentheses), and picking
  one calls `agentPresets.select(agent,
  id)` — the parent re-link
  dsh Web performs — recomposing the session's tool set, prompt sections, and
  skills on the spot. dsh refuses the switch once the session has produced a
  turn (`agent-preset/locked`, keyed on the `turnBoundary` projection), so the
  bridge advertises the selector exactly while it can be honored and removes it
  with a full-replacement `config_option_update` at the first `turn/start`; a
  late pick fails with a readable `invalidParams`. Broken roster rows are never
  offered, and a successful switch re-announces the slash catalog (skills and
  commands are preset-scoped). `DSH_ACP_PRESET` keeps naming the deployment
  default. Verified by a new conformance scenario (`config_option_update` is
  now a covered variant) and by `scripts/preset-smoke.mjs`.

### Changed (corridor move)

- All `@deepseek-ai/dsh-*` dependencies and devDependencies pinned
  `0.1.2-rc.1` → `0.1.5-rc.1`; `@deepseek-ai/schemastery` `3.18.1` →
  `3.18.2`. Cordis stays `4.0.2`, ACP SDK stays `1.4.0`. Lockfile
  regenerated with no mixed cohort. The deployed `acp` profile already
  resolved the new cohort through its `link:` install, so this release closes
  a real type/runtime drift (details per item below).
- Evidence and the full old→new ledger: `docs/compat-audit-0.1.5-rc.1.zh.md`
  (the local upgrade skill's version cards stop at `0.1.2-rc.1`; the
  `0.1.2-rc.1 → 0.1.5-rc.1` segment is a declared gap derived from published
  artifacts).
- `pnpm install` recorded the pnpm 11 supply-chain exclusion list for the
  freshly published cohort in `pnpm-workspace.yaml` (`minimumReleaseAgeExclude`),
  so the pinned install stays reproducible on a clean machine.

### Fixed (approval wait visibility)

- **Escalation prompts now go out, and the wait is visible**: under
  `approval: ask` the `approval/request` handler awaited `drainRecord()` →
  `agent.whenIdle()`, which waits on the driver promise while the driver is
  awaiting that very approval — a self-wait deadlock, so
  `session/request_permission` was never sent before the user stopped the
  turn (which then settled the call as `cancelled`). The handler now awaits the
  record's `outputTail` — the same ordered delivery chain every other wire
  write uses — and enqueues an `approvalPendingNote` `agent_message_chunk`
  first, so a user who switched away, or returns later, can see from the
  conversation stream that the agent is blocked on an approval. The probe stub
  now requests a real escalation (`sandbox_permissions` + `justification`),
  making `session/request_permission` a live-exercised variant in
  `scripts/conformance.mjs`; `tests/permission-note.test.ts` pins the
  note-before-request ordering and fails loudly if the request never arrives
  (the deadlock regression). Closes #1.

### Fixed (silent regressions on the new host)

- **Live streaming restored**: the durable `assistant/chunk` session event is
  gone in 0.1.5-rc.1, so deltas only arrived with the committed block. The
  bridge now consumes the Agent event `agent/assistant-stream`
  (start/chunk/end frames): the attempt map supplies the turn/step the start
  frame named, a replacement attempt clears its turn/step accumulations, and
  an abandoned end drops them (otherwise the committed-block remainder check
  would compare against the dead attempt and send nothing). Mapping extracted
  as the pure `foldStreamFrame` (`updates.ts`) with unit tests.
- **`session/delete` deletes again**: `SessionPersistence.locate()` was
  removed; the delete path resolves the current-generation artifact through
  the backend's `resolveCurrentLog(id)` and keeps a hardened path fence
  (`sessionDirForDelete`: separator-boundary root check + UUID directory name).
  The old prefix test admitted a sibling `<sessionsRoot>-evil/`; fixed.
- **Persona restored**: `dsh-system-prompt`'s single `persona` key became
  `personaPrefix`/`personaSuffix`; the bundle patch now uses the split keys
  (same shape as the official `@deepseek-ai/dsh-acp-app` in this cohort).
- **Slash-command attachments**: `commands.execute`'s third parameter is the
  tagged `CommandSubmitAttachment` union; the bridge now sends
  `{ type: 'image', … }`.
- **Preset restore on resume**: `session/load`/`resume` mounted the creation
  header's `agentPreset`, which a pre-turn switch never updates, so a reloaded
  session silently reverted to `DSH_ACP_PRESET`. The bridge now folds the last
  `agent-preset/selected` event from the durable log (dsh reconstructs from its
  `agentPreset` projection, never the header alone) and derives the preset-lock
  state from the same log. `src/bridge/events.d.ts` declares the plugin event
  locally, as it already does for `model/selection` and `session/title`.

### Changed (mount surface re-baselined)

- `scripts/standard-mounts.json` regenerated on the 0.1.5-rc.1 corridor:
  `dsh-base` no longer mounts `tool-str-replace-editor` and the shipped
  `standard` preset adds `@deepseek-ai/dsh-tool-present` (−str_replace_editor,
  +present). The str_replace_editor card/replay rules stay for old logs.
- `scripts/preset-smoke.mjs`'s fixture preset migrated to the new
  `dsh-persona` config (`prefix:`), which is now schema-required.

### Changed (complexity cleanup)

- Repo-wide over-engineering pass (net ~-390 lines): dropped the stale
  `docs/report.md` / `docs/optimization-plan.zh.md`, the manual
  `scripts/wire-drive.mjs` probe, and `wire-probe.mjs`'s runtime codegen of the
  stub adapter (now a committed `scripts/wire-stub-adapter.mjs`); merged the two
  event-declaration files into `src/bridge/events.d.ts`; inlined the
  single-caller effort helpers; and shrank the stop-reason map, the stream
  line counter, `slashLine`/`encodedImages`, and the preset-smoke directory
  walk. Twelve helpers exported only for tests are module-private again, with
  the tests rerouted through the public builders (160 → 157 tests, 15 files
  green).

### Testing

- 149 → 160 tests: `foldStreamFrame`/`clearStreamKeys` units (attempt
  resolution, replacement reset, abandoned cleanup, unknown attempt) and
  `sessionDirForDelete` fence units. Spawned probes and the wire conformance
  harness pass on the new cohort; the session-history probe proves
  delete-then-resume still fails (durable removal) on 0.1.5-rc.1.
- 160 → 171 tests: preset-selector builders and the refused-switch detail
  (`config-options.test.ts`), the durable preset fold, the turn lock, and
  `makeRecord` preset seeding (`session-store.test.ts`). The conformance
  scenario switches preset on a blank session, asserts the removal update and
  the locked late pick, and asserts a resumed session no longer advertises the
  selector; `preset-smoke.mjs` adds the env→`currentValue` checks and a
  switch → close → resume round-trip.

### Findings (confirmed, not fixed here)

- **CLI profile template drift is now load-bearing**: a fresh
  `dsh plugin --profile acp add <dir>` on the 0.1.5 line seeds
  `bundles = [dsh-base, dsh-acp-app, dsh-acp-v1]`, and the official
  automation-only bridge answers the client (`agentInfo.name =
  deepseek-harness-acp`, no `session/close`, no live deltas). Removing
  `@deepseek-ai/dsh-acp-app` from the profile's bundles makes this plugin the
  answering bridge (verified: `dsh-acp-v1` / 0.4.0 / `loadSession: true` /
  new + close ok). README (en/zh) documents the post-install check; the
  already-deployed local profile is unaffected. Fixing the CLI template itself
  is upstream work.

## [0.3.0] — rename release

### Rename

- Package/bundle renamed `dsh-acp-interactive` → `dsh-acp-v1` (version
  bumped to 0.3.0): npm name, plugin export, loader row id, `AGENT_NAME`
  (Zed display name), log prefixes, docs, `lib/` rebuilt.
  Existing installs: re-run `dsh plugin --profile acp add <url|dir>`.
  Not yet pushed or tagged.

### Fixed (P0)

- README (en/zh) no longer claims the removed terminal-echo capability —
  bash output is described as read-style cards, matching the implementation;
  dangling cross-references cleaned up; test count updated to 136.
- Missing MIT `LICENSE` file added (copyright dangpangch).
- Elicitation failures now carry stable `[ELICITATION_*]` error codes
  (P3-3, brought forward): no live session / capability missing / aborted /
  declined / cancelled — each asserted not to hang the round.

### Added (P1)

- Preset & model route as deployment env fields (P1-4):
  `DSH_ACP_PRESET`, `DSH_ACP_PROVIDER`, `DSH_ACP_MODEL`, read by the bridge
  at session/agent creation (restart to change). A preset value no installed
  root supplies fails `session/new` with a readable `invalidParams` listing
  the available presets (previously a silent global-layer session).
  Verified by `scripts/preset-smoke.mjs` (bogus / user-root preset / fallback).
- `mcpServers` accepted and ignored (P1-6): real clients (Zed) forward the
  field; hard rejection turned "not supported" into "unusable". Non-empty
  lists log on stderr; conformance now exercises them.
- Mount-surface audit (P1-5): env-gated sidecar snapshot of every new
  session's actual tools (registry agent view) and command plane, diffed by
  `scripts/conformance.mjs` against the golden baseline
  (`scripts/standard-mounts.json`) — anything outside the baseline fails.

### Refactored (P2-8, first cut)

- `askViaForm` extracted to `src/bridge/elicitation.ts` behind an injectable
  `ElicitationBridge`; internal elicitation exits (no session, aborted) are
  now unit-tested (P0-3b). The remaining four-module split
  (lifecycle/prompt/permission/eof) is **deferred**: the composition root's
  closures are interdependent to the point where a pure file move is a
  rewrite, and without a CI drift net (below) that rewrite carries
  disproportionate regression risk.

### Testing

- 136 → 149 tests: elicitation gate scenarios (missing capability / decline /
  cancel over the wire), elicitation seam units (all five exits + content
  mapping), mount-matrix comparator negative checks.

### Findings (not fixed here)

- **CLI profile template drift**: a fresh `dsh plugin --profile acp add`
  under dsh 0.1.2-rc.1 seeds the profile with the official
  `@deepseek-ai/dsh-acp-app` bundle. In that composition the `agent-presets`
  row never loads (no `agentPreset` in persisted session headers, even with
  literal defaults), so sessions degrade to the global layer. Profiles
  created before the template change (base + this bundle only) are
  unaffected. Needs a decision: install instructions / template handling
  before the next release.
- Patch-level `!!js` env expressions (cnctem's approach) are **not**
  dependable on this corridor's loader: `--dump-config` never evaluates
  them, and the row's schema validation precedes any observed interpolation.
  Deployment fields are therefore handled in bridge code (see P1-4).

### Deferred by decision

- P2-7 GitHub CI — owner decided not to build it for now; the local gates in
  AGENTS.md stand in for it (including the lib freshness discipline).
- P3-1 capability-aware terminal echo — needs real-Zed behavior validation.
- P2-9 external actions — no tag, no GitHub Release, no tarball, repo stays
  private; commits are local-only until you say otherwise.
- P3-2 corridor automation — thin wrapper only (`pnpm audit:corridor`);
  P3-4 English design summary added; P3-3 delivered early with P0.
