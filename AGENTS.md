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
- `cordis.patch.yml` — the bundle patch (persona, hmr off, agent-presets,
  subagent-model-selection seat, the bridge row). Row id = package name.
- `scripts/` — dev/test harnesses: `conformance.mjs` (ACP v1 wire
  conformance + mount audit), `wire-probe.mjs` (canned stub-LLM boot),
  `preset-smoke.mjs`, `mount-matrix.mjs`, `standard-mounts.json` (golden).
- `tests/` — vitest: pure-helper units, spawned end-to-end probes
  (frame purity, session history, elicitation gates), seam units.
- `docs/` — `design.zh.md` (the technical doc + decision record),
  `model-config.zh.md`, corridor audit reports, `design-summary.en.md`.

## Invariants (never break)

- **stdout purity**: stdout carries JSON-RPC frames only; every diagnostic
  rides `ctx.logger` (stderr). Probe-sidecar files are written to `$DSH_HOME`,
  never stdout.
- **Corridor pinning**: all `@deepseek-ai/*` dependencies are pinned to the
  audited dsh version (currently `0.1.2-rc.1`). Version bumps require the
  upgrade corridor: `pnpm audit:corridor <from> <to>` + the
  dsh-upgrade-audit skill, then re-run the mount audit golden.
- **Presets own the model-facing surface**: tools/commands come from the
  mounted preset; host rows are infrastructure. The mount audit
  (`scripts/standard-mounts.json`) enforces this — regenerate it only when
  the corridor or preset roster legitimately changed.
- **Deployment fields**: `DSH_ACP_PRESET` / `DSH_ACP_PROVIDER` /
  `DSH_ACP_MODEL` are read by the bridge at session/agent creation
  (restart to change). Do not reintroduce patch-level `!!js` for them.
- **lib/ is committed**: `pnpm build` after every source change and commit
  `lib/` together with the source (remote installs fetch the prebuilt
  bundle; no build scripts).

## Gates before commit

```bash
pnpm typecheck && pnpm build
pnpm test            # 149 tests (pure units + spawned probes)
node scripts/conformance.mjs   # wire conformance + mount audit matrix
node scripts/preset-smoke.mjs  # deployment env fields (P1-4)
```

## Common tasks

- New wire builder / card presentation → `updates.ts` / `tool-cards.ts` with
  unit tests (see `tests/updates.test.ts` patterns).
- Behavior change on the wire → extend `scripts/conformance.mjs` scenarios.
- Mount-surface change → re-baseline `scripts/standard-mounts.json` only on
  a corridor/preset change, and say so in the commit.
- Errors surfaced to the model → named codes in `src/bridge/errors.ts`.
- Rename/publish decisions → see plugin-write/plugin-release skills;
  public renames are compatibility-breaking.
