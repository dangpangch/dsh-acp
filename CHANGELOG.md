# Changelog

All notable changes to dsh-acp-v1 (formerly dsh-acp-interactive).

## [Unreleased] — 0.3.0 (breaking rename)

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
