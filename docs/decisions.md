# P0 spike 决策记录（docs/decisions.md）

> dsh-acp-interactive（dsh 的 ACP 交互档 plugin）P0 阶段的已核实事实与决策。
> 每项带证据位置；后续实现不再重做决策，只做实现。

## 1. 交付形态（用户决策 2026-09）

- 在本工作区 `/home/pang/ws/harness/dsh-acp` 新建独立仓库；交付物 = **dsh plugin/bundle 包**（包名 `dsh-acp-interactive`，声明 `dsh.bundle.patch: cordis.patch.yml`），经 `dsh plugin --profile acp add <abs-path>` 安装为 profile bundle。
- Zed 路线 = **Custom Agent**：`command` 指向 dsh CLI 绝对路径、`args: ["--profile","acp"]`。本轮不发布 npm / ACP Registry。
- 代码来源：bridge 模块移植自同一作者 MIT 工程 `dangpangch/zed-dsh`（文件头已注明）。

## 2. 已核实事实

### 2.1 本机 dsh 基线
- dsh CLI 0.1.1-rc.2（fnm 安装）；profile = `$DSH_HOME/profiles/<name>`，`package.json` 的 `dsh.profile.bundles`（npm 包 → `dsh.bundle.patch` yml）按序为补丁层；Loader 行 `name` 可为包名（import 包 main 插件导出）或相对路径（相对 baseUrl=profile 根）。
- profile boot 对存在的 `agent-presets` 行自动叠加 shipped preset root（`config: {...row.config, roots:[<shipped>]}`，覆盖 roots）。`$DSH_HOME/profiles/node_modules` 是 dsh 安装依赖树的符号链接农场（模块回退）。
- dsh CLI 正常 boot 不写 stdout；SIGINT/SIGTERM 由 launcher 处理；**stdin EOF 无人处理** → 插件经 launcher 发布的 `ctx.appExit(code)` 请求退出（`provideCmdline` 提供 `cmdlineArgs` + `appExit`，无 `cmdline` 服务）。
- `dsh-base` bundle（451 行 patch）已含全部宿主行：llm/agent/sessions/persistence/session-query/projection/approval/sandbox/commands/工具注册行/llm-deepseek 默认路由等。未含：`agent-presets` 行、`tool-ask-user` 行。

### 2.2 SDK 1.4.0（`@agentclientprotocol/sdk`）能力/方法面（离线 .d.ts）
- Agent 方法：initialize/authenticate/session 系 new·list·load·delete·resume·close·prompt·cancel·set_config_option·update·request_permission（+ unstable fork）。
- 能力字段：`agentCapabilities.loadSession?: boolean`；`agentCapabilities.sessionCapabilities?: {list?, delete?, resume?, close?}`（各 `{}` 表示支持）；`promptCapabilities.{image,audio,embeddedContext}`；`auth?`。
- `session/load` 语义 = **把完整会话历史作为通知流回放给客户端**；`session/resume` = 恢复上下文但不回放历史（两者分开实现）。
- elicitation：agent 侧经 `AgentSideConnection.createElicitation(params)`（表单 scope 绑 session/tool_call_id），客户端 `completeElicitation` 回填；client 需声明 `elicitation.form` 类能力才可调用。
- Zed quirks（沿用 zed-dsh 记录）：configOptions 优先于 models/modes；available_commands_update 延后于 session 响应；plan 用稳定扁平通道；会话历史 ≥v0.225；能力声明必须与实现一致（hermes-agent #6633 教训）。

### 2.3 rc.2 服务 API（实现依据）
- `ctx.agents.create({sessionId, meta:{cwd, agentPreset?}, agentOptions, setup})`；`ctx.agents.resume({resumeSessionId, agentOptions, setup})`（内部走 `sessionPersistence.prepare`）；`ctx.agents.get/list`。
- `ctx.sessionQuery`（SessionQueryEngine，base 已挂）：`listSessions(): SessionRecord[]`（最新在前，header{id, cwd, createdAt,...}+live+persisted）、`readSession(id): {session: header, events: SessionEvent[]}`（回放源）、`listEvents/readEvent/readSurface`。
- `ctx.permissionPresets`：`resolve(name)/optionOf/set(session, name)/current(events)`（permission config option 写路径）。
- `ctx.userQuestions.registerProvider(provider)`（elicitation 的 UI provider seam，仅一个 provider）。
- `ctx.agentPresets`（AgentPresets）：`defaultId`、`resolve(id?)/mount(agentCtx, id?)/composeFrom/recompose`；**agent 平面工具/提示由 preset 提供**，推荐在 `agents.create` 的 `setup` 里 `await agentPresets.mount(agentCtx, id)`（creation header `agentPreset` 记录 id）。
- `ctx.sessionProjections.snapshot(...).values.contextPressure`（usage_update 源）；`ctx.attachments.saveImages`（识图）；`ctx.commands.list/execute`（斜杠）；`ctx.llm.listProviders/listModels/resolveModelInfo`（configOptions）；approval seam `ctx.on('approval/request', (request,next)=>...)`。
- 官方 `@deepseek-ai/dsh-acp` 为 automation-only（fresh-only、committed-only），不与 Zed 交互要求兼容 —— 本插件即其交互档补充（形态：dsh plugin 而非独立 server）。

### 2.4 进程/生命周期（实测）
- dev/test 双通道：
  a) **独立 dev boot**（`src/dev-bin.ts`，spawn `node lib/dev-bin.js`）：dsh-base patch + 本包 patch + dev agent-presets overlay（fixture `tests/fixtures/presets` = shipped presets 副本；`DSH_ACP_PRESET_ROOT` 可覆盖）；stdin EOF/SIGINT → dispose → exit 0。
  b) **真实 CLI 通道**（隔离 `$DSH_HOME` 下 `dsh plugin --profile acp add <abs>` + `dsh --profile acp`）：实测 initialize+session/new 两 result + 延后 available_commands_update×5、stdout 纯 JSON-RPC、EOF/`/dev/null` 均 exit 0（~0.8s）。
- **stdin EOF 检测**：`process.stdin 'end'` 在 SDK 读流下**不触发**；改为 `conn.closed`（SDK 输入流结束即关闭连接）→ quiesce → `ctx.appExit(0)`。`ctx.appExit` 是 launcher 发布的退出请求（不存在 `cmdline` 服务）。

### 2.5 agent preset
- shipped presets（minimal/standard/code/cordis）随 dsh CLI config 分发；`standard` 无 `tool-ask-user`，`code`/`cordis` 有。
- ACP 会话默认 preset = **`standard`**（原生工具面），elicitation 的 ask 工具在 P3 按需补 host 行或 preset 决策（默认补 host 行 `tool-ask-user` + `ctx.userQuestions.registerProvider` 桥）。

## 3. P0 决策摘要

| 项 | 决策 |
|---|---|
| 仓库/包名 | `dsh-acp-interactive`（private；dsh.bundle.patch） |
| 安装 | `dsh plugin --profile acp add <工作区绝对路径>`（link: 依赖，改后重建即生效） |
| Zed 命令 | `dsh --profile acp`（绝对路径 command） |
| session/new 组合 | dsh-base + 默认 preset `standard`（setup 内 mount）+ bridge 行（provider deepseek-official/model deepseek-v4-flash，会话可切） |
| stdout 纪律 | 仅 JSON-RPC；launcher 不写 stdout；help/diag → stderr |
| EOF/退出 | `conn.closed` → quiesce → `appExit(0)` |
| 能力纪律 | 先实现、后声明（list/load/delete/resume 在 P2 与实现同步开启） |
| 会话历史 | 数据源 `ctx.sessionQuery`（listSessions/readSession）；load=agents.resume + 按 SDK 语义回放历史；resume=不回放 |
| elicitation | userQuestions provider + conn.createElicitation（client capability 门控） |
| 权限档 | config option `permission`（permissionPresets.set），P3 |
| MCP | 本轮不做：非空 mcpServers → invalidParams（如实拒绝） |
| agentPresets 行 | 本包 cordis.patch.yml insert（default: standard）；CLI boot 自动补 shipped root；dev boot 用 fixture overlay |

## 4. 验证命令

```
# 类型/构建
pnpm typecheck && pnpm build
# dev boot smoke（隔离 DSH_HOME）
printf '...initialize...\n...session/new...' | node lib/dev-bin.js     # 2 result + exit 0
# CLI profile smoke（隔离 DSH_HOME；profile 已建）
DSH_HOME=$(mktemp -d) dsh plugin --profile acp add $PWD
printf '...' | DSH_HOME=$DSH_HOME dsh --profile acp                   # 2 result + exit 0
```
