# dsh-acp-v1

> **dsh-acp-v1 is, at heart, a dsh plugin**: it supplies the ACP
> capabilities missing from dsh's built-in ACP, and serves the DeepSeek
> Harness to the [Zed](https://zed.dev) editor as a custom ACP agent-server
> extension (an interactive ACP v1 server).

Run DeepSeek Harness agents inside Zed's Agent Panel over the
[Agent Client Protocol](https://agentclientprotocol.com) (v1): create/close
threads, stream text + reasoning, live tool cards, plan updates, slash
commands **and installed agent skills**, session history, permissions,
model/thought-level/preset selects, elicitation forms — while every tool runs
inside the dsh sandbox with dsh's own model route.

## Requirements

- dsh CLI (tested on `0.1.5-rc.1`) — install globally first:

  ```bash
  npm install -g @deepseek-ai/dsh@0.1.5-rc.1
  dsh --version   # → 0.1.5-rc.1
  ```

- pnpm (the `dsh plugin` command delegates to pnpm)
- Zed with the Agent Panel (ACP v1)
- A DeepSeek API key: `DEEPSEEK_API_KEY` env var, or configured once in dsh
  Web (Models settings → writes `~/.dsh/.credentials.yaml`)

## Install

The plugin is installed as a **profile bundle**. Pick a profile name (the
examples use `acp`); the boot command is then `dsh --profile acp`.

### Option A — remote (from this GitHub repository)

```bash
# HTTPS (public repository; use a credentialed URL for a private one)
dsh plugin --profile acp add https://github.com/dangpangch/dsh-acp.git
```

The repository ships its prebuilt bundle (`lib/`), so the install is a plain
fetch — no build scripts, no extra allowlist. Repeat `add` (or `remove` +
`add`) after pulling new commits to upgrade the installed copy.

### Option B — local (development / offline)

```bash
dsh plugin --profile acp add /path/to/dsh-acp
```

This installs a pnpm **link** to the local checkout. After changing the source
code, rebuild and the running profile picks it up on next boot:

```bash
pnpm build   # tsdown -> lib/
```

### After installing: check the bundle list

`dsh plugin --profile acp add` seeds a fresh profile with the CLI's template,
which (since the 0.1.5 line) also bundles the **official automation-only
`@deepseek-ai/dsh-acp-app`**. In that composition the official bridge answers
the client (`agentInfo.name = deepseek-harness-acp`, no `session/close`, no
live deltas) and this plugin never gets the connection.

Remove it from the profile's own `package.json` so the bundle list is exactly
base + this plugin, then restart the profile:

```jsonc
// ~/.dsh/profiles/acp/package.json
"dsh": {
  "profile": {
    "bundles": ["@deepseek-ai/dsh-base", "dsh-acp-v1"]
  }
}
```

Verify the running bridge with `dsh --profile acp` + `initialize`:
`agentInfo.name` must be `dsh-acp-v1`.

## Configure Zed

Add a **Custom Agent** to Zed's `settings.json`
(`~/.config/zed/settings.json` on Linux; `Cmd+,` → "Open Zed Settings" from
the agent panel otherwise):

```json
{
  "agent_servers": {
    "DeepSeek Harness (acp)": {
      "type": "custom",
      "command": "dsh",
      "args": ["--profile", "acp"]
    }
  }
}
```

Notes:

- `command: "dsh"` assumes `dsh` is on `PATH` (npm global install). If a
  GUI-launched Zed cannot find it, start Zed from a terminal that has `dsh`
  on `PATH`, or set `command` to the absolute path of the `dsh` binary.
- Then start a new thread from the Agent Panel and pick
  `DeepSeek Harness (acp)`. The thread gear menu offers Model / Thought Level /
  Write permission selects.
- `DEEPSEEK_API_KEY` is optional in `agent_servers[].env` — without it dsh uses
  the credentials already stored by dsh Web.

## Smoke test (no model key needed)

stdout must contain **only** JSON-RPC; EOF must exit 0:

```bash
printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1,"clientCapabilities":{}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"session/new","params":{"cwd":"/tmp","mcpServers":[]}}' |
  dsh --profile acp
```

Expect two `result` frames (initialize → protocolVersion 1, session/new →
sessionId), then exit 0.

## Capabilities (declared only when implemented)

- Sessions: `session/new · list · load · resume · close · delete` with durable
  history (session-query/persistence); `load` replays committed content per
  ACP semantics.
- Streaming/rendering: `agent_message_chunk`, streamed reasoning, tool cards
  (execute cards carry the concrete command line in their title), plan/todo
  updates, `usage_update`, `available_commands_update` slash catalog = dsh
  command plane **+ user-invocable skills** (`~/.agents/skills`,
  `<project>/.agents/skills`, `.dsh/skills`). Skills follow the pi-acp naming
  convention: announced as `skill:<name>` (`/skill:find-skills` in the `/`
  popup), commands keep plain names; picking one loads the skill body through
  dsh's `tool-skill` pre-step.
- Command output display (Zed 1.18): Zed renders execute-kind cards as
  terminal-style cards whose text content hides behind a hover-only chevron
  (an external agent cannot force them open), so every bash/pwsh result is
  delivered as a read-style card: the title carries the model-written command
  description (the raw command line stays in rawInput) and the captured
  output rides as fenced text content in the `tool_call_update`, folding with
  the card. Commands run under dsh's own sandbox/approval; nothing is ever
  executed inside the client.
- Session options: Model, Thought Level, Write permission.
- Permissions: one-shot `session/request_permission` (allow-once /
  reject-once).
- Auth: `authenticate` via `DEEPSEEK_API_KEY` or dsh Web credentials;
  `AUTH_REQUIRED` with a sign-in method when missing.
- Elicitation: `ask_user_question` → ACP form (when the client declares
  `elicitation.form`).

Honestly **not** implemented (never advertised): session fork, delegated
terminal/fs **execution** (commands run only in the dsh sandbox — the client
renders captured output as card content, it never executes the agent's
command), `additionalDirectories`,
audio/embeddedContext, MCP mounting (non-empty `mcpServers` is accepted and
ignored — no MCP tools are mounted, noted on stderr), fine-grained diff
cards, Windows.

## Presets & model route (deployment fields)

The agent preset and the default model route are deployment fields, read from
the environment **once at boot** (changing them means restarting the agent):

- `DSH_ACP_PRESET` — the preset every ACP session is composed from (default
  `standard`; shipped roster: `standard`, `minimal`, `ptc`, `cordis`). A value
  no installed preset supplies fails `session/new` with a readable error
  listing the available presets. Presets beyond `standard` expect the harness
  installation's host rows resolvable (`minimal` needs `dsh-terminal`;
  `ptc`/`cordis` need their host plugins) — a base-only standalone boot may
  not mount them.
- `DSH_ACP_PROVIDER` / `DSH_ACP_MODEL` — the shipped default route
  (`deepseek-official` / `deepseek-v4-flash`); the per-session Model config
  option still overrides.

Presets are not a session option: a preset decides the tool set, and swapping
it mid-session would break session semantics. Extra presets live in the
per-user preset root under `$DSH_HOME`; presets such as `code`/`cordis`
require their host plugins (`code-runtime`, `cordis-host-runner`) installed
separately.

## Develop

```bash
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm build       # tsdown -> lib/
pnpm test        # vitest (160 tests incl. spawned frame-purity + history probes)
node scripts/conformance.mjs     # ACP v1 wire conformance + mount audit
node scripts/preset-smoke.mjs    # deployment env fields (preset/provider/model)
node scripts/history-probe.mjs   # session history end-to-end (isolated DSH_HOME)
```

Layout: `src/bridge/index.ts` (plugin entry), `catalog.ts` (slash catalog),
`replay.ts` (history → ACP frames), `tool-cards.ts` (card titles/kinds),
`{codec,updates,content,config-options,session-store}.ts` (wire builders /
decision tables), `src/dev-bin.ts` (isolated dev/test boot),
`cordis.patch.yml` (bundle patch).

## Docs & license

- Technical design document (Chinese): `docs/design.zh.md`
- English design summary: `docs/design-summary.en.md`
- MIT
