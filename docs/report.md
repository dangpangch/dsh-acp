# 本项目（dangpangch/dsh-acp）与 cnctem/dsh-acp 全面对比报告

> 对比对象：本地仓库 `/home/pang/ws/harness/dsh-acp`（`dsh-acp-v1` v0.2.0）与 [cnctem/dsh-acp](https://github.com/cnctem/dsh-acp)（v0.1.1）。
> 调研时间：2026-09-09。cnctem 侧信息来自其 GitHub 仓库 main 分支（package.json、README.md、docs/technical.md、cordis.patch.yml、提交历史）。

## 1. 结论摘要

这两个项目是**同源分叉的兄弟实现**：都源自官方 `@deepseek-ai/dsh-acp` 骨架（cnctem 首个提交信息即为 "Port the DeepSeek Harness ACP server"），产品形态完全一致——以 dsh profile bundle 形式挂载，通过 `dsh --profile acp` 在 stdio 上暴露 ACP JSON-RPC 服务器，让 Zed 等IDE 驱动 dsh agent，且都不修改 dsh 本体。

**cnctem 版起步更早（8月15日–27日）、已公开（6 star、有 LICENSE、修过 issue）但停留在 dsh 0.1.1-rc.2，代码单文件、测试设施轻量；本地版（`dsh-acp-v1` v0.2.0）晚约三周（9月3日–6日），已升级适配 dsh 0.1.2-rc.1 和 ACP SDK 1.4.0（ACP v1），源码模块化、测试与一致性设施明显更重，交互细节（allow_always、会话恢复/关闭、标题流、配置热更新、skill 斜杠目录）更完整，但尚无 LICENSE 文件、无 CI。**

## 2. 基本盘对比

| 维度 | 本项目（dangpangch） | cnctem/dsh-acp |
|---|---|---|
| 包名 / 版本 | `dsh-acp-v1` 0.2.0（tag v0.1.0、v0.2.0） | `dsh-acp` 0.1.1（无 release） |
| 活跃时间 | 2026-09-03 ~ 09-06，30 个提交 | 2026-08-15 ~ 08-27，28 个提交 |
| 可见性 | private，git 分发预构建 `lib/` | 公开仓库，6 star，1 个 issue 已修复（忽略 mcpServers） |
| 许可证 | 声明 MIT 但**仓库内无 LICENSE 文件** | MIT，有 LICENSE 文件 |
| dsh 适配 | 精确钉死 `0.1.2-rc.1`（11 个 `@deepseek-ai/*` 包） | `^0.1.1-rc.2` 浮动范围 |
| ACP SDK | `@agentclientprotocol/sdk` **1.4.0**（v1 协议） | **0.25.1**（旧版） |
| Node 要求 | `^22.19 \|\| >=24` | `>=20` |
| 代码形态 | src 12 个 TS 文件约 3200 行（桥入口 index.ts 约 1560 行），打包后 2 个 JS | 仓库只有单个 `lib/index.js`（69KB），无源码目录 |
| 依赖策略 | dsh 系全部直接 dependencies，另依赖 cordis 4.0.2、schemastery | dsh 系 dependencies + cordis/`dsh-agent-default-model`/`dsh-user-approval` 作 peerDependencies，还引了 `dsh-sandbox-policy` |

## 3. 功能覆盖对比

两边核心面高度重合（流式 token/思考、工具卡片+行号、结构化 diff、会话历史 list/load/delete、usage 上下文环、todo→plan、图片理解、斜杠命令、elicitation 表单提问、`DSH_ACP_PRESET` 预设机制、hmr 关闭、stdout 纯 JSON-RPC 纪律），差异集中在以下各点：

| 功能点 | 本项目 | cnctem |
|---|---|---|
| 权限选项 | allow_once / **allow_always** / reject_once | 仅 allow_once / reject_once |
| 会话方法 | new / list / load / **resume / close** / delete | new / list / load / delete（无独立 resume/close 面） |
| 会话标题 | **支持**：`session/title` 事件 → `session_info_update` 流式推送 | 明确列为不支持（不回传标题） |
| configOptions | 模型/思考档位/写权限三个 select，且支持**热更新推送**、load/resume 恢复 per-session 选择、上次模型选择记忆 | 同三个 select，思考档位有 effort 守卫，无热更新推送的记载 |
| 斜杠目录 | dsh 命令 + 用户可调 **skills 合并**（`skill:<name>` 命名，沿 pi-acp 约定），订阅 `commands/change`/`skills/change` **热刷新** | 仅 dsh `/` 命令经命令平面执行，不进模型历史 |
| Bash 输出呈现 | **已弃用 terminal/create**，改为 bash 卡"read 化"（输出以代码围栏随 tool_call_update 发出）——因 Zed 1.18 execute 卡 is_open 折叠问题 | **terminal 内容渲染**（terminal_info + 完整输出 + 退出码），自承"执行完一次性填充、非流式" |
| MCP | 非空 `mcpServers` 直接**拒绝** | 接受但**忽略**（按 issue #1 修复） |
| 预设生态 | patch 里 `agent-presets default: standard`，dev 用 `DSH_ACP_PRESET_ROOT` | `DSH_ACP_PRESET` 直选 4 个预设（standard/minimal 内置，code(PTC)/cordis 需另装 `code-runtime`、`cordis-host-runner` 两个宿主插件），另有 `DSH_ACP_PROVIDER`/`DSH_ACP_MODEL` 环境变量 |
| 明确不做 | fork、委托 terminal/fs、additionalDirectories、audio、MCP 挂载、Windows | fork、会话内换预设、additionalDirectories、audio/embedded resource、标题回传、MCP（忽略） |
| elicitation 门控 | 统一走表单 | 能力门控更细：客户端未声明 `elicitation.form` 时工具报 `ELICITATION_UNSUPPORTED` 而非挂起 |

## 4. cordis.patch.yml 设计差异（最能体现架构分歧）

- **cnctem**：除了 persona 兜底和关 hmr，还**批量禁用了约 27 行 agent 平面挂载**（tool-bash/fs/str-replace-editor/todo/web、skill、subagent 全家、plan-mode、compaction、result-pruner 等），理由是多会话服务器每个会话由预设挂自己的工具集；基础设施（沙箱、审批、持久化、模型路由）留在宿主平面。`acp` 行通过 `!!js` 表达式从环境变量注入 provider/model/preset。
- **本地**：patch 只有 4 个操作——替换 persona 为 ACP 专属简洁编码 persona、关 hmr、插入 `agent-presets`（default standard）+ `subagent-model-selection-settings` 行、插入桥行（默认路由 `deepseek-official/deepseek-v4-flash`）。**没有做大规模禁用**，工具面沿用宿主/预设组合；另用 `pnpm-workspace.yaml` 的 `publicHoistPattern: '@deepseek-ai/*'` 解决 pnpm 隔离布局下 patch 行的导入解析。

## 5. 质量设施与文档（差距最大的一块）

### 5.1 测试

- **本地**：vitest 11 个测试文件约 143 个用例（覆盖 codec 映射、stdout 纯净性 spawn 实测、replay、session-store 等）；自建 **ACP v1 conformance harness**（`scripts/conformance.mjs`，用 SDK 的 zod schema 校验每一条出站帧，覆盖 9 个 client→agent 方法 + 6 种 update 变体）；外加 wire-probe/history-probe 等探针脚本、无 key 冒烟测试、`tsc --noEmit`。还做过一次 dsh 0.1.2-rc.1 **兼容性审计**（42 张版本走廊卡片、事件订阅名全量验证，见 `docs/compat-audit-0.1.2-rc.1.zh.md`）。
- **cnctem**：README 无测试章节；仅 `smoke-test.mjs`（mock 服务、不触模型栈）加手工 stdio 冒烟。
- 两边都**没有 CI**（无 .github/workflows）。

### 5.2 文档

两边都是双语 README（cnctem 的中文版放 docs/README.zh.md）。cnctem 有一份扎实的 `docs/technical.md`（事件映射、elicitation 设计、能力边界都写得很清楚）。本地文档更深一层：`docs/design.zh.md`（ACP↔dsh 映射、能力纪律、决策记录）、`docs/model-config.zh.md`、兼容性审计报告三份全中文技术文档。cnctem 另有 AGENTS.md 和封面图。

## 6. 互为镜子的发现

- **本地可借鉴 cnctem 的**：
  1. 细粒度 elicitation 能力门控（不支持时显式报错而非挂起）；
  2. 预设作为部署字段的多预设/环境变量方案（`DSH_ACP_PRESET` 直选 + `DSH_ACP_PROVIDER/MODEL`）；
  3. 公开发布、LICENSE 文件与 issue 驱动修复的社区化运作；
  4. 命令平面执行斜杠命令不污染模型历史的明确语义（本项目 catalog 把 skills 混入目录，语义需对齐确认）。
- **cnctem 落后于本地的**：dsh 0.1.2-rc.1 适配（本地的审计报告正是这条升级走廊的产物）、ACP SDK 1.4.0/v1、allow_always、会话 resume/close 与标题、config 热更新、conformance 测试。
- **本仓库一处待修**：README.md 的 "Command output display (Zed 1.18)" 一节仍在描述 terminal/create 方案，与源码（bash 卡 read 化）和 `docs/design.zh.md` §3.4 不一致——恰好在描述 cnctem 仍保留的旧方案，建议同步。
