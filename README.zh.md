# dsh-acp-v1

> **dsh-acp-v1 本质上是一个 dsh plugin**：补足 dsh 原生 ACP 缺失的
> ACP 能力，把 DeepSeek Harness（dsh）作为**自定义 agent server extension**
> 提供给 Zed Editor（一个交互式 ACP v1 服务器）。

通过 [Agent Client Protocol](https://agentclientprotocol.com)（v1）在 Zed 的
Agent Panel 里使用 DeepSeek Harness 的 agent：建/关线程、文本与思考流式、
工具卡片、plan 更新、斜杠命令 **与已安装的 agent skills**、会话历史、权限、
模型/思考档位/写权限切换、ask 表单——工具始终跑在 dsh 沙箱内，走 dsh 自己的
模型路由。

## 前提

- dsh CLI（验证于 `0.1.5-rc.1`）——先全局安装：

  ```bash
  npm install -g @deepseek-ai/dsh@0.1.5-rc.1
  dsh --version   # → 0.1.5-rc.1
  ```

- pnpm（`dsh plugin` 转发给 pnpm）
- 带 Agent Panel 的 Zed（ACP v1）
- DeepSeek API key：环境变量 `DEEPSEEK_API_KEY`，或在 dsh Web 的 Models
  设置里配置一次（写入 `~/.dsh/.credentials.yaml`）

## 安装

插件以 **profile bundle** 安装。profile 名可自取（示例用 `acp`），启动命令
即 `dsh --profile acp`。

### 方式 A：远程（GitHub 仓库）

```bash
# HTTPS（公开仓库直接用；私有仓库给 URL 带凭据）
dsh plugin --profile acp add https://github.com/dangpangch/dsh-acp.git
```

仓库已提交预构建产物（`lib/`），远程安装是纯拉取——没有 build 脚本、不需要
额外的 allowlist。升级：远端有新提交后重新 `add`（或 `remove` + `add`）即可。

### 方式 B：本地（开发 / 离线）

```bash
dsh plugin --profile acp add /path/to/dsh-acp
```

以 pnpm **link** 方式安装。改动源码后重建即可，下次启动即用新产物：

```bash
pnpm build   # tsdown -> lib/
```

### 装完先检查 bundle 列表

`dsh plugin --profile acp add` 会按 CLI 模板初始化 profile；0.1.5 线起该模板
还会带上**官方 automation-only 的 `@deepseek-ai/dsh-acp-app`**。那种组合下应答
客户端的是官方桥（`agentInfo.name = deepseek-harness-acp`，无 `session/close`、
无 live delta），本插件拿不到连接。

请在 profile 自己的 `package.json` 里把它去掉，使 bundle 列表恰为
base + 本插件，然后重启 profile：

```jsonc
// ~/.dsh/profiles/acp/package.json
"dsh": {
  "profile": {
    "bundles": ["@deepseek-ai/dsh-base", "dsh-acp-v1"]
  }
}
```

用 `dsh --profile acp` + `initialize` 核对：`agentInfo.name` 必须是
`dsh-acp-v1`。

## Zed 配置

在 Zed 的 `settings.json`（Linux 为 `~/.config/zed/settings.json`，也可从
Agent Panel 打开 "Zed Settings"）里加一个 **Custom Agent**：

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

注意：

- `command` 直接写 `dsh`，前提是 `dsh` 已在 PATH（npm -g 全局安装）。若 GUI
  启动的 Zed 找不到，从已带 `dsh` 的终端启动 Zed，或给 `command` 写 dsh 的
  绝对路径。
- 之后在 Agent Panel 新建线程并选择 `DeepSeek Harness (acp)`。线程齿轮菜单可
  切换 Model / Thought Level / Write permission。
- `DEEPSEEK_API_KEY` 可放入 `agent_servers[].env`（可选）——不设则用 dsh Web
  已存的凭据。

## 冒烟（不需要模型 key）

stdout 只允许 JSON-RPC；EOF 后退出码 0：

```bash
printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1,"clientCapabilities":{}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"session/new","params":{"cwd":"/tmp","mcpServers":[]}}' |
  dsh --profile acp
```

应得到两条 `result`（initialize → protocolVersion 1；session/new →
sessionId），随后 exit 0。

## 能力（声明与实现严格一致）

- 会话：`session/new · list · load · resume · close · delete`，带持久化历史
  （session-query/persistence）；`load` 按 ACP 语义回放提交内容。
- 流式/渲染：`agent_message_chunk`、思考流式、工具卡片（execute 类卡片标题即
  具体命令行）、plan/todo、`usage_update`、`available_commands_update` 斜杠
  目录 = dsh 命令平面 + **user-invocable skills**（`~/.agents/skills`、
  工程 `.agents/skills`/`.dsh/skills`）。skill 沿用 pi-acp 命名惯例：通告为
  `skill:<name>`（弹窗显示 `/skill:find-skills`），命令保持原名；选中即经
  dsh tool-skill pre-step 装载执行。
- 命令输出展示（Zed 1.18）：Zed 把 execute 类卡片渲染成终端风格卡片，纯文本
  content 藏在悬停才出现的箭头后面（外部 agent 无法强制展开），因此 bash/pwsh
  结果一律按 read 风格卡片投递：标题携带模型写下的命令描述（原始命令行留在
  rawInput），捕获的输出以代码围栏随 `tool_call_update` 发出、随卡片折叠。命令
  只在 dsh 自己的沙箱/审批层执行，客户端内从不执行任何东西。
- 会话选项：Model、Thought Level、Write permission。
- 权限：一次性 `session/request_permission`（allow-once / reject-once）。
- 认证：`authenticate`（`DEEPSEEK_API_KEY` 或 dsh Web 凭据）；缺 key 时
  `AUTH_REQUIRED` 并带 sign-in 方法。
- elicitation：`ask_user_question` → ACP 表单（客户端声明 `elicitation.form`
  时）。

明确不做（不悬空声明）：session fork、terminal/fs **执行委托**（命令只在 dsh
沙箱内执行——客户端只把已捕获的输出渲染成卡片内容，绝不执行 agent 的命令）、
`additionalDirectories`、audio/embeddedContext、MCP 挂载（非空
`mcpServers` 接受但忽略——不挂载任何 MCP 工具，stderr 记一条）、细粒度 diff
卡片、Windows。

## 预设与模型路由（部署字段）

agent 预设与默认模型路由是**部署字段**，启动时从环境变量读取一次（改动 =
重启 agent 后生效）：

- `DSH_ACP_PRESET` — 每个 ACP 会话由哪个预设组合（缺省 `standard`；随包目录含
  `standard`、`minimal`、`ptc`、`cordis`）。取值若没有已安装预设提供，
  `session/new` 会返回带可用预设列表的可读错误。`standard` 之外的预设依赖
  harness 安装的宿主行可解析（`minimal` 需要 `dsh-terminal`；`ptc`/`cordis`
  需要各自宿主插件）——纯 base 的独立 boot 未必能挂载它们。
- `DSH_ACP_PROVIDER` / `DSH_ACP_MODEL` — 随包默认路由
  （`deepseek-official` / `deepseek-v4-flash`）；会话级 Model 选项仍可覆盖。

预设不是会话选项：预设决定工具集，会话中途换预设会破坏 session 语义。额外预设放
`$DSH_HOME` 下的用户预设根；`code`/`cordis` 等预设需另行安装宿主插件
（`code-runtime`、`cordis-host-runner`）。

## 开发

```bash
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm build       # tsdown -> lib/
pnpm test        # vitest（160 项，含真实 spawn 的帧纯净与会话历史探针）
node scripts/conformance.mjs     # ACP v1 wire 一致性 + 挂载审计
node scripts/preset-smoke.mjs    # 部署字段（preset/provider/model）
node scripts/history-probe.mjs   # 会话历史端到端（隔离 DSH_HOME）
```

布局：`src/bridge/index.ts`（插件入口）、`catalog.ts`（斜杠目录）、
`replay.ts`（历史 → ACP 帧）、`tool-cards.ts`（卡片标题/分类）、
`{codec,updates,content,config-options,session-store}.ts`（wire builder / 决策表）、
`src/dev-bin.ts`（隔离 dev/test boot）、
`cordis.patch.yml`（bundle 补丁）。

## 文档与许可

- 技术文档（唯一，中文）：`docs/design.zh.md`
- 英文设计摘要：`docs/design-summary.en.md`
- MIT
