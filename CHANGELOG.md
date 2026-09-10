# Changelog

All notable changes to dsh-acp-v1 (formerly dsh-acp-interactive).

## [Unreleased] — 0.4.0 (dsh 0.1.2-rc.1 → 0.1.5-rc.1)

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
