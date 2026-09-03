# dsh-acp-interactive

> **dsh-acp-interactive 本质上是一个 dsh plugin**：补足 dsh 原生 ACP 缺失的
> ACP 能力，把 DeepSeek Harness（dsh）作为**自定义 agent server extension**
> 提供给 Zed Editor（一个交互式 ACP v1 服务器）。

通过 [Agent Client Protocol](https://agentclientprotocol.com)（v1）在 Zed 的
Agent Panel 里使用 DeepSeek Harness 的 agent：建/关线程、文本与思考流式、
工具卡片、plan 更新、斜杠命令 **与已安装的 agent skills**、会话历史、权限、
模型/思考档位/写权限切换、ask 表单——工具始终跑在 dsh 沙箱内，走 dsh 自己的
模型路由。

## 前提

- dsh CLI（验证于 `0.1.1-rc.2`）——先全局安装：

  ```bash
  npm install -g @deepseek-ai/dsh
  dsh --version   # → 0.1.1-rc.2
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
- 会话选项：Model、Thought Level、Write permission。
- 权限：一次性 `session/request_permission`（allow-once / reject-once）。
- 认证：`authenticate`（`DEEPSEEK_API_KEY` 或 dsh Web 凭据）；缺 key 时
  `AUTH_REQUIRED` 并带 sign-in 方法。
- elicitation：`ask_user_question` → ACP 表单（客户端声明 `elicitation.form`
  时）。

明确不做（不悬空声明）：session fork、terminal/fs 执行委托（工具仍在 dsh
沙箱）、`additionalDirectories`、audio/embeddedContext、MCP 挂载（非空
`mcpServers` 拒绝并说明）、细粒度 diff 卡片、Windows。

## 开发

```bash
pnpm install
pnpm typecheck   # tsc --noEmit
pnpm build       # tsdown -> lib/
pnpm test        # vitest（89 项，含真实 spawn 的帧纯净与会话历史探针）
node scripts/history-probe.mjs   # 会话历史端到端（隔离 DSH_HOME）
```

布局：`src/bridge/index.ts`（插件入口）、`catalog.ts`（斜杠目录）、
`replay.ts`（历史 → ACP 帧）、`tool-cards.ts`（卡片标题/分类）、
`{codec,updates,content,config-options,session-store}.ts`（移植自 MIT 工程
`dangpangch/zed-dsh`）、`src/dev-bin.ts`（隔离 dev/test boot）、
`cordis.patch.yml`（bundle 补丁）。

## 文档与许可

- 技术文档（唯一，中文）：`docs/design.zh.md`
- MIT；代码移植自同一作者 MIT 工程 `dangpangch/zed-dsh`（文件头标注）。
