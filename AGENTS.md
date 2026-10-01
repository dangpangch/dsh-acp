# AGENTS.md — contributor guidance for dsh-acp-v1

dsh-acp-v1 is an interactive ACP (Agent Client Protocol) v1 server for the
DeepSeek Harness (dsh), installed as a dsh profile bundle. It fills the
interactive gap left by the official automation-only `@deepseek-ai/dsh-acp`.

## Layout

- `src/bridge/index.ts` — composition root: opens the `AgentSideConnection`
  over stdin/stdout, owns the per-session registry and the wire. Still large;
  cohesive seams are extracted as they become testable (see `elicitation.ts`).
- `src/bridge/{catalog,codec,config-options,content,elicitation,errors,replay,
  session-store,tool-cards,updates}.ts` — pure or injectable helpers
  (wire builders, decision tables, presentation). Keep these free of
  composition-root state.
- `cordis.patch.yml` — the bundle patch (persona, hmr off, the agent-plane
  disable list, `agent-preset-registry`, the subagent-model-selection seat,
  the bridge row). Row id = package name.
- `presets/*.patch.yml` — the four shipped agent-preset declarations
  (`@deepseek-ai/dsh-agent-preset` rows, ported from the dsh 0.2.0 web-app
  bundle). `dsh.bundle.patch` lists them after `cordis.patch.yml`, in order.
- `scripts/` — dev/test harnesses: `conformance.mjs` (ACP v1 wire
  conformance + mount audit), `wire-probe.mjs` (canned stub-LLM boot),
  `preset-smoke.mjs`, `mount-matrix.mjs`, `standard-mounts.json` (golden),
  `release-check.mjs` (the tag/release gate).
- `tests/` — vitest: pure-helper units, spawned end-to-end probes
  (frame purity, session history, elicitation gates), seam units.
- `docs/` — `design.zh.md` (the technical doc + decision record),
  `model-config.zh.md`, corridor audit reports, `design-summary.en.md`.

## Invariants (never break)

- **stdout purity**: stdout carries JSON-RPC frames only; every diagnostic
  rides `ctx.logger` (stderr). Probe-sidecar files are written to `$DSH_HOME`,
  never stdout.
- **Corridor pinning**: all `@deepseek-ai/*` dependencies are pinned to the
  audited dsh version (currently `0.2.0-rc.2`). Version bumps require the
  upgrade corridor: `pnpm audit:corridor <from> <to>` + the
  dsh-upgrade-audit skill, then re-run the mount audit golden. When the
  corridor's version cards do not cover a segment (they stop at `0.1.2-rc.1`),
  derive the absent edge from published artifacts and record the gap in
  `docs/compat-audit-<version>.zh.md` — never from memory.
- **Presets own the model-facing surface**: tools/commands come from the
  mounted preset; host rows are infrastructure. dsh-base ships its
  agent-plane rows enabled for the TUI, so the bundle patch must keep them
  disabled or a preset double-registers every tool. The mount audit
  (`scripts/standard-mounts.json`: `tools`/`slash` for the default preset, plus
  a `presets` map conformance boots once per shipped declaration) enforces the
  surfaces — regenerate it only when the corridor or preset roster legitimately
  changed.
- **Presets are declarative (dsh 0.2.0+)**: the registry scans no directories;
  a preset is an inserted `@deepseek-ai/dsh-agent-preset` row. Add one in
  `presets/` (shipped roster) or a profile patch. `DSH_ACP_DEV_PATCH` is the
  dev/test seam for authoring one without touching the bundle.
- **Deployment fields**: `DSH_ACP_PRESET` / `DSH_ACP_PROVIDER` /
  `DSH_ACP_MODEL` are read by the bridge at session/agent creation
  (restart to change). Do not reintroduce patch-level `!!js` for them.
- **lib/ is committed**: `pnpm build` after every source change and commit
  `lib/` together with the source (remote installs fetch the prebuilt
  bundle; no build scripts).

## Gates before commit

```bash
pnpm typecheck && pnpm build
pnpm test            # 175 tests (pure units + spawned probes)
node scripts/conformance.mjs   # wire conformance + mount audit matrix
node scripts/preset-smoke.mjs  # preset deployment fields + pre-turn selector
```

## Releasing (tags)

- A release is a commit plus an annotated tag. The tag name is exactly
  `v${package.json.version}`, and the release commit is a standalone
  `chore(release): X.Y.Z` carrying only `package.json`, the CHANGELOG heading
  move (`[Unreleased]` → `[X.Y.Z] — <date>`), and the rebuilt `lib/`. Never
  bury a version bump inside a feature/refactor commit: 0.3.0–0.5.0 all did
  (`d72ee31d`, `fd0aa87d`, `ef15f674`), which is why no commit cleanly names
  those releases and `git describe` used to answer `v0.2.0-18-g…`.
- Tag the version's **last** commit — the state just before the next bump
  (`v0.2.0` sits on the last `package.json: "0.2.0"` commit; keep that shape).
- Tag messages record the host corridor, the fact this project actually gets
  wrong (v0.1.0/v0.2.0 = dsh `0.1.2-rc.1`, v0.3.0 = `0.1.2-rc.1`, v0.4.0 =
  `0.1.5-rc.1`, v0.5.0 = `0.2.0-rc.2`; the mapping table lives at the end of
  `CHANGELOG.md`). Use two `-m` paragraphs:
  `-m "<name> <version> — <headline>" -m "dsh corridor: <from> -> <to>"`.
- `pnpm release:check` is the gate: version == CHANGELOG top heading ==
  annotated `vX.Y.Z` tag, `origin/main` not ahead of HEAD, and `lib/` identical
  to a fresh build (`--skip-build` opts out of the rebuild). When the tag is
  missing it prints the exact `git tag -a` command, corridor included.
- Push the commit and the tag together (`git push origin main vX.Y.Z`, or
  `push.followTags` — it only carries annotated tags). Because `lib/` is
  committed, the tag *is* the install boundary:
  `dsh plugin --profile acp add github:dangpangch/dsh-acp#vX.Y.Z` is
  reproducible; the bare URL is not (it resolves default-branch HEAD).
- `v0.2.0` is lightweight and sits two commits past `chore: release 0.2.0`.
  It is already public, so it stays as is — documented, never re-pointed.

## Common tasks

- New wire builder / card presentation → `updates.ts` / `tool-cards.ts` with
  unit tests (see `tests/updates.test.ts` patterns).
- Behavior change on the wire → extend `scripts/conformance.mjs` scenarios.
- Mount-surface change → re-baseline `scripts/standard-mounts.json` only on
  a corridor/preset change, and say so in the commit.
- Errors surfaced to the model → named codes in `src/bridge/errors.ts`.
- Rename/publish decisions → see plugin-write/plugin-release skills;
  public renames are compatibility-breaking.
- Version bump or tag → `chore(release): X.Y.Z` then `pnpm release:check`
  (see "Releasing (tags)"); a corridor move is part of the same release, so the
  tag message carries the old→new dsh versions.
