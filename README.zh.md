# dsh-acp-interactive

在 [Zed Editor](https://zed.dev) 的 Agent Panel（及其他 ACP 客户端）中以 **dsh 插件**
形态运行的交互档 ACP v1 服务器：让 DeepSeek Harness（dsh）的 agent 作为 Zed 的
external agent 使用。

- 交付形态：**dsh bundle 插件**（`dsh.bundle.patch` → `cordis.patch.yml`），覆盖在
  `@deepseek-ai/dsh-base` 之上，作为 profile bundle 安装：`dsh plugin --profile acp add <本目录>`。
- Zed 连接方式：Custom Agent，命令 = `dsh --profile acp`（本机 dsh CLI 绝对路径）。
- 架构/决策记录：`docs/decisions.md`；安装手册：`docs/zed-setup.zh.md`；
  协议映射：`docs/protocol-map.zh.md`（后续补充）与源码注释。

## 能力（能力声明与实现严格一致）

- 会话：`session/new · list · load · resume · close · delete`
  （持久化会话历史基于 dsh 的 session-query/persistence；`load` 按 ACP 语义回放提交内容）。
- 流式/渲染：`agent_message_chunk`、thought 流式、tool 卡片、plan(todo 折叠)、
  `usage_update`、`available_commands_update`（斜杠命令）。
- 会话选项（configOptions，Zed 下拉）：Model、Thought Level、Write permission。
- 权限：一次性 `session/request_permission`（allow-once / reject-once），无持久 grant。
- 认证：`authenticate`（env `DEEPSEEK_API_KEY` 或 dsh web Models 配置的凭据）；
  缺 key 时 `AUTH_REQUIRED` 并声明 sign-in 方法。
- elicitation：`ask_user_question` → ACP 表单（客户端声明 `elicitation.form` 时）。
- 识图：`promptCapabilities.image` 仅在附件存储与默认模型路由都支持时如实开启。

明确不做（Known Limitations，不悬空声明）：session fork、terminal/fs 执行委托
（工具仍在 harness 沙箱内）、`additionalDirectories`、audio/embeddedContext、
MCP 挂载（非空 `mcpServers` 拒绝并给出说明）、细粒度 diff 卡片、Windows。

## 开发

```
pnpm install
pnpm typecheck      # tsc --noEmit
pnpm build          # tsdown -> lib/
pnpm test           # vitest（65 项；含真实 spawn 的帧纯净与会话历史探针）
node scripts/history-probe.mjs   # 会话历史端到端（隔离 DSH_HOME）
```

## 布局

```
src/bridge/index.ts     插件入口（AgentSideConnection + 会话生命周期）
src/bridge/replay.ts    持久历史 → ACP 回放帧（纯函数）
src/bridge/{codec,updates,content,config-options,session-store}.ts  移植自 zed-dsh(MIT)
src/dev-bin.ts          独立 dev/test boot（dsh-base + 本包 patch + presets fixture）
cordis.patch.yml        bundle 补丁（bridge/agent-presets/persona/hmr 行）
scripts/history-probe.mjs  会话历史端到端探针
```

代码移植自同一作者 MIT 工程 `dangpangch/zed-dsh`（文件头标注）。
