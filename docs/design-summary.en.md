# dsh-acp-v1 — design summary (English)

Companion to the full technical document `docs/design.zh.md` (Chinese, the
source of truth). Position, wire mapping, and capability discipline in one
page.

## What this is

dsh-acp-v1 is a dsh bundle plugin that serves DeepSeek Harness agents to an
ACP v1 client (Zed's Agent Panel) over stdin/stdout JSON-RPC. It is the
interactive complement to the official automation-only `@deepseek-ai/dsh-acp`:
thread create/close, streaming text + reasoning, live tool cards, plan
updates, slash commands **and installed agent skills**, durable session
history, one-shot permissions, model/thought-level/write-permission selects,
and elicitation forms.

## Process model

- One `AgentSideConnection` per process; one session record per ACP session;
  serialized per-session output delivery; quiescent teardown per session and
  on disconnect/dispose.
- **stdout carries JSON-RPC frames only** — all diagnostics ride
  `ctx.logger` (stderr). Client EOF triggers a quiet drain (in-flight
  replies still land) then a bounded `appExit(0)`.

## Wire mapping (abridged; §3 of design.zh.md)

| ACP | dsh | Notes |
|---|---|---|
| `session/new` | `agents.create` + preset mount | Deployment preset via `DSH_ACP_PRESET`; unknown preset → readable `invalidParams` |
| `session/prompt` | single-flight admission → `agent.followup` | skill slash normalization, image gating, resource-block degradation |
| `session/load` | resume + history replay | committed facts replayed as notifications |
| `session/resume` | resume, no replay | continues the thread |
| close/delete/cancel | quiescent teardown / delete | never touches sibling sessions |
| config options | preset + model + thought-level + write-permission selects | the preset select exists only while the session is still blank (dsh's `agent-preset/locked`); the rest are hot-refreshed; per-session state restored on load/resume |
| `request_permission` | approval bridge | allow-once / allow-always / reject-once |
| elicitation | `ask_user_question` ↔ ACP form | capability-gated; five coded exits never hang the round |

## Mounting & presets

Model-facing rows (tools, commands, prompt sections) live in agent presets
(`@deepseek-ai/dsh-agent-presets`); the host composition owns only
registries and infrastructure. Sessions are composed from one preset —
deployment default `standard`, overridable with `DSH_ACP_PRESET`. The
conformance harness diffs each session's actual mounted surface against the
golden baseline (`scripts/standard-mounts.json`), so host-plane leakage into
an ACP session fails the run. A preset is the deployment default *and* a
blank-session session option: dsh accepts `agentPresets.select` only while the
session has produced no turn, so the bridge advertises the selector exactly
then, drops it at the first `turn/start`, and restores the last selected preset
(not the creation header) on load/resume.

## Capability discipline

Implemented first, advertised second: `initialize` never claims a capability
the composition cannot serve (session history only when the query engine is
present, images only when store + model agree, forms only when the client
declared `elicitation.form`). Explicitly not implemented and never
advertised: session fork, delegated terminal/fs execution, `MCP` mounting
(non-empty `mcpServers` is accepted and ignored), `additionalDirectories`,
audio/embeddedContext, fine-grained diff cards, Windows.

## Decision highlights (§5 of design.zh.md)

- **Deployment fields**: preset/provider/model overrides come from the
  environment and are read by the bridge at session/agent creation —
  restart to change. Patch-level `!!js` expressions are not dependable on
  this dsh corridor's loader.
- **Distribution**: prebuilt `lib/` committed to git (no build scripts on
  install); bundle row id = package name; profile name `acp` is
  user-facing and stable.
- **Corridor**: all `@deepseek-ai/*` deps pinned to the audited dsh version;
  version bumps go through `pnpm audit:corridor` + the dsh-upgrade-audit
  skill and re-baseline the mount golden.
