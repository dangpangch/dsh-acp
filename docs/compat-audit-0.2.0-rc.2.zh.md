# dsh-acp-v1 × DSH 0.2.0-rc.2 兼容性审查与迁移报告

- **审查对象**: `dsh-acp-v1` 0.4.0 → 0.5.0（宿主侧 bundle 插件：把 DSH 经 ACP v1 / stdio 暴露给 Zed Agent Panel）
- **源状态**: git `main` @ `9b89af7f`（迁移前工作树干净，仅两份未跟踪的审批计划文档）；迁移分支 `migrate-dsh-0.2.0-rc.2`（已合并：merge commit `86d7a78b`）
- **审查依据**: 本地升级技能 `.agents/skills/plugin-upgrade`（Mode C）+ `.agents/skills/dsh-upgrade-audit`（npm 模式物化）；技能版本卡止于 `v0.1.2-rc.1`
- **版本走廊**: `dsh-v0.1.5-rc.1 → dsh-v0.1.5-rc.2 → dsh-v0.1.5-rc.3 → dsh-v0.1.6-alpha.1 → dsh-v0.1.6-alpha.2 → dsh-v0.1.7-alpha.1 → dsh-v0.1.7-alpha.2 → dsh-v0.1.7-rc.1 → dsh-v0.1.7-rc.2 → dsh-v0.2.0-rc.1 → dsh-v0.2.0-rc.2`（均已在 npm 发布；`latest`/`next` = `0.2.0-rc.2`）
- **结论**: **静态 + 运行时通过**。本段唯一真回归是 **agent-preset 架构换代**（本报告的核心）；另有一处测试夹具面的 LLM 消息形状变化。`typecheck` / `build` / 175 测试 / wire 一致性 + mount 审计 / preset-smoke 全绿；真实 `~/.dsh/profiles/acp`（宿主 `0.2.0-rc.2`）实测 `preset` 选择器恢复。

## 1. 身份与 cohort 一致性

| 项 | 值 | 验证方式 |
|---|---|---|
| 包名 / 版本 | `dsh-acp-v1` 0.5.0（private，预构建 `lib/` 随仓库分发） | `package.json` |
| 安装轨 | GitHub 仓库 / 本地 `link:`（bundle patch），非 npm 注册表包 | README、profile `package.json` |
| 目标 cohort | 全部 `@deepseek-ai/*` 精确钉 `0.2.0-rc.2`；`schemastery` 3.18.4；`cordis` 4.0.4；ACP SDK **1.4.0 不变** | `package.json` + 锁文件 |
| 锁文件 | 旧 cohort 零残留（`grep -c '0\.1\.5-rc\.1' pnpm-lock.yaml` = 0）；`0.2.0-rc.2` 命中 1565 行 | `pnpm-lock.yaml` |
| Node | v24.18.0（`engines: ^22.19 \|\| >=24` ✓） | `node --version` |
| 宿主二进制 | 本机 `dsh --version` = **0.2.0-rc.2**（`latest`）；profile `~/.dsh/profiles/acp` 以 `link:` 指向本仓 | `dsh --version`、profile `package.json` |
| 供应链策略 | `pnpm-workspace.yaml` 的 `minimumReleaseAgeExclude` 按锁文件重生成（133 → **150** 条，全部 `@0.2.0-rc.2`） | `pnpm-workspace.yaml` |
| 官方对照 | `@deepseek-ai/dsh-acp@0.2.0-rc.2` / `dsh-acp-app@0.2.0-rc.2` 仍为 automation-only：其 bundle patch **不含任何 preset 行**，agent-plane 行由 base 提供 | 包内 `cordis.patch.yml` |

### 1.1 物化产物（npm 模式，`0.1.5-rc.1 → 0.2.0-rc.2`）

```bash
node .agents/skills/dsh-upgrade-audit/scripts/materialize-npm.mjs \
  0.1.5-rc.1 0.2.0-rc.2 tmp/0.1.5rc1-to-0.2.0rc2
```

- 产物：`tmp/0.1.5rc1-to-0.2.0rc2/{a,b,manifest-diff.txt,commits.txt,reverts.txt}`（`tmp/` 已 gitignore）。
- 规模：CLI 闭包 **241 → 289** 包。仅 A 有（6）：`cordis-plugin-hmr`、`dsh-agent-presets`、`dsh-code-runtime`、`dsh-code-runtime-worker-thread`、`dsh-settings-file`、`dsh-workflow-worker-thread`。仅 B 有（55，节选）：`dsh-agent-preset`、`dsh-agent-preset-registry`、`dsh-ptc-runtime`、`dsh-ptc-runtime-node`、`dsh-workflow-ptc`、`dsh-session-format-v3-to-v4`、`dsh-plugin-manager`、`dsh-config-editor`、`dsh-workspace-changes`、`dsh-mcp-resources`、`dsh-hmr`、`dsh-otel`/`dsh-host-product-telemetry-otel`、`dsh-deepseek-account*`、`dsh-client-*` 与 `dsh-experimental-*` 整簇。
- **GitHub 富化**：本次可达 —— range `dsh-v0.1.5-rc.1...dsh-v0.2.0-rc.2`，**4102** commits（`commits.txt` 截断为 250 条），`reverts.txt` **1** 条：`f50b6db1c1` Revert "test(desktop): set installer paths through the Unicode control helper" —— **与本插件面无关**，本段无针对插件能力的 revert 意图。
- **工具局限（如实声明）**：物化脚本的 `scopedPkgs` 遍历最初不下钻 scoped 包内的嵌套 `node_modules`（npm 在 A 侧把冲突版本嵌在 `@deepseek-ai/dsh/node_modules/@deepseek-ai/*`），导致首轮 `manifest-diff.txt` 把 278 个包误报为 "ADDED in b"。已就地修正本地技能脚本（`.agents/` 为 gitignore，不进本仓提交）并重跑：`packagesA` 241 / `packagesB` 289，diff 可信。CLI 闭包不含全部可发布包；Python SDK 不在 npm 工件范围。

## 2. 触点核查（pre-flight 七类）

扫描范围：`src/ tests/ scripts/` + 根配置；对照面 = 物化 `a/`（0.1.5-rc.1）与 `b/`（0.2.0-rc.2）的已发布声明/实现，以及本机 0.2.0-rc.2 profile cohort。

| 触点 | 命中 | 判定与证据 |
|---|---|---|
| #1 源补丁 | **1 处（本段核心）** | `cordis.patch.yml` 的 `agent-presets` 行整行失效：`@deepseek-ai/dsh-agent-presets` 已删除，`agentPresets` 服务不再被注册 → 桥在 `preset` option 前止步（`src/bridge/index.ts:936` 的 `presets?.list` 判定），Zed 看不到模式选择器。已按 0.2.0 架构重写：`agent-preset-registry`（`default: standard`）+ `presets/{standard,ptc,minimal,cordis}.patch.yml`（`@deepseek-ai/dsh-agent-preset` 声明）+ 停用 base 的 agent-plane 行 |
| #2 事件 | 0 改、3 增 | `KNOWN_SESSION_EVENT_TYPES` 56 → 59：新增 `developer/message`、`image/offload`、`workspace/changes`，**无删除**。桥的 replay switch 默认忽略未知类型 → 无需改代码；`agent-preset/selected` 仍在表内（会话级选择仍靠它折叠）。逐名验证存续：`session/event`、`todo/write`、`session/title`、`turn/start\|end`、`tool/call\|result`、`agent/inbox/claimed`、`agent/error`、`approval/request`、`user-questions/request`、`skills/change`、`commands/change`、`agent/assistant-stream`、`model/selection` |
| #3 服务/Remote | 3 处读缝核对，0 处改代码 | `agentPresets` 服务名与 `resolve/mount/list/select` 签名**不变**（`dsh-agent-preset-registry` 的 module augmentation 仍声明 `Context.agentPresets`）；`AgentPresetRow` 的 `{id,name?,description?,broken?}` 与桥的 `PresetChoice` 结构兼容，`list()` 仍返回含 broken 行的全量名册。其余弱 `ctx.get` 缝（llm / attachments / commands / skills / sessionProjections / sessionQuery / sessionPersistence / permissionPresets / userQuestions）全量类型检查通过、实跑验证通过 |
| #4 宿主文件系统 | 1 处语义删除 | **`.agent-presets/<id>/` 用户预设根被移除**：registry README 明确 "the registry neither scans directories nor accepts preset paths"，新预设改为向 profile 安装一个 `@deepseek-ai/dsh-agent-preset` 行。删除 seam 仍走 `resolveDshHome()` + `sessions` 根围栏（`resolveCurrentLog` 未变，session-history 探针通过） |
| #5 UI/commands/tools | 3 处 | ① base 起把 agent-plane 行**默认启用**（dump 可见 `tool-bash`/`tool-fs`/… 均激活）→ 本 bundle 必须停用它们，否则与 preset 行重复注册；② `standard` preset 的 `tool-ralph` 现为 `disabled: true` → mount golden 去 `ralph`；③ PTC 面换代：base 新增 `ptc-runtime`/`workflow-ptc`，0.1.5 的 `workflow-worker-thread`/`code-runtime`/`code-runtime-worker-thread` 移除，0.2.0 的 `ptc` preset 在 delegation 组内挂 `@deepseek-ai/dsh-workflow-ptc` |
| #6 自定义通道 | 0 | 纯 stdio JSON-RPC；无 HTTP/WS/RPC server → 鉴权门 N/A |
| #7 子进程/stdout | 0（仅测试工具） | 生产代码不解析子进程输出；stdout 纯净性由 `tests/frame-purity.test.ts` 继续把关（通过） |

## 3. 旧→新账本（逐项处置）

| # | 旧（0.1.5-rc.1） | 新（0.2.0-rc.2） | 处置 | 证据 |
|---|---|---|---|---|
| 1 | `agent-presets` 行（`@deepseek-ai/dsh-agent-presets`）：自带 registry + 随包四个 `presets/<id>/{preset.yml,agent.cordis.yml}` + roots 配置 | `agent-preset-registry` 行（只做注册/挂载）+ 每预置一个 `@deepseek-ai/dsh-agent-preset` 行，声明内联 `plugins` 列表；无目录扫描 | **已迁移**：`cordis.patch.yml` 改为 registry 行；四个声明**原样移植**自官方 `@deepseek-ai/dsh-web-app@0.2.0-rc.2` 的 `presets/*.patch.yml` 到本仓 `presets/`，`package.json` 的 `dsh.bundle.patch` 由字符串改为五文件数组（dev boot 与 CLI 同序） | `cordis.patch.yml`、`presets/*.patch.yml`、`package.json`、`src/dev-boot.ts` |
| 2 | base 的 agent-plane 行按设计不激活（工具来自 preset） | base 默认启用全部 agent-plane 行（TUI 用） | **已迁移**：移植 web-app 的停用清单（24 行：tool-bash/pwsh/jobs/fs/fs-search、skill-filesystem/tool-skill、command-goal/tool-goal/plan-mode、compaction 三行、subagent 四行、workflow-ptc/tool-workflow/tool-ralph、agent-instructions/tool-todo/tool-web、tool-plugin-manager），会话仍由 preset 拥有工具面 | `cordis.patch.yml`；`scripts/standard-mounts.json` 26 工具与快照精确一致 |
| 3 | 预置显示名来自 `preset.yml` 中文文本；桥用英文副本表覆盖四个 shipped id | 声明无 `name`/`description`；Web 端各自本地化 | **不改**：桥的 `SHIPPED_PRESET_COPY`（Standard/PTC/Minimal/Cordis）继续生效（实测 option `name` 为英文）；自撰预置仍走 `id (name)` 规则 | `src/bridge/config-options.ts`；preset-smoke 输出 |
| 4 | 用户预置根 `$DSH_HOME/.agent-presets/<id>/`；`DSH_ACP_PRESET_ROOT` 指向真实部署根 | 无目录发现；新预置 = profile 补丁里插一行 `@deepseek-ai/dsh-agent-preset` | **已迁移（测试夹具面）**：`src/dev-boot.ts` 删除 `presetOverlayOps`/`DSH_ACP_PRESET_ROOT`，新增 dev-only seam `DSH_ACP_DEV_PATCH=<patch 文件>`；`conformance.mjs` 与 `preset-smoke.mjs` 改为写补丁文件并注入该 env | `src/dev-boot.ts`、`scripts/conformance.mjs`、`scripts/preset-smoke.mjs` |
| 5 | LLM 消息里工具结果 = user/assistant 消息内的 `tool-result` 内容块 | `MessageRoleMap` 新增 `tool` 角色：`ToolResultMessage{role:'tool', toolCallId, isError?}`；`ContentBlockMap` 不再有 `tool-result` | **已迁移（仅测试夹具）**：`scripts/wire-stub-adapter.mjs` 的 `saw()` 改判 `m.role === 'tool' && m.toolCallId === id`。旧判定在 0.2.0 永不命中 → 模型无限重发同一 tool call，permission-note / elicitation-gate 四个探针超时；修复后 4/4 通过。生产桥消费 session 事件而非 LLM 消息，无需改 | `scripts/wire-stub-adapter.mjs`、`tests/permission-note.test.ts`、`tests/elicitation-gate.test.ts` |
| 6 | `SESSION_FORMAT_VERSION = 3` | `= 4`，新增 `dsh-session-format-v3-to-v4` 迁移包 | **非命中（自动迁移）**：插件经 `sessionQuery`/`ctx.sessions` 读写，不构造 seed、不读 `version`；preset-smoke 实测新会话落盘 `version: 4`，session-history 探针（新→list→resume→delete）通过 | `tests/session-history.test.ts`、preset-smoke header |
| 7 | `persona` 单键 → `personaPrefix`/`personaSuffix`（0.1.5 已完成） | 不变 | **非命中**：`cordis.patch.yml` 已是 `personaPrefix/personaSuffix` 形（与官方 `dsh-acp-app` 同形） | `cordis.patch.yml` |
| 8 | `workflow-worker-thread`；`dsh-code-runtime(-worker-thread)` | 移除；新增 `ptc-runtime`/`workflow-ptc`/`dsh-ptc-runtime-node` | **已迁移（预置声明面）**：移植的 `ptc`/`standard` 声明使用 `@deepseek-ai/dsh-workflow-ptc`；无插件代码引用这些包 | `presets/ptc.patch.yml`、`presets/standard.patch.yml` |
| 9 | ACP SDK 1.4.0；`cordis` 4.0.2；`schemastery` 3.18.2 | ACP SDK 仍 1.4.0；`cordis` 4.0.4；`schemastery` 3.18.4 | **已迁移（依赖面）**：按宿主 peer `~4.0.4` / `~3.18.4` 对齐；wire 形状未变（conformance 用 SDK 1.4.0 zod schema 全量校验通过） | `package.json`、`scripts/conformance.mjs` |
| 10 | 事件表 56 项 | 59 项（+`developer/message`、+`image/offload`、+`workspace/changes`） | **非命中**：replay switch 默认忽略未知事件；三项均不在桥的 wire 面 | `src/bridge/replay.ts` |
| 11 | `tool-ralph` 由 standard preset 提供 | standard 声明里 `disabled: true`（web-app 同版同形） | **已迁移（挂载面）**：`scripts/standard-mounts.json` 再基线化（26 工具，去 `ralph`） | conformance mount 矩阵 |

**判定 N/A**：Web Client 面（`dsh.client`/客户端 bundle/宿主 UI/webServer 路由/`dsh-client-*` 整簇新增）、Remote/`apiProxy`、headless stderr 契约、telemetry/隐私面、experimental bundles（agent-team/voice/schedule/auto-review）——插件为宿主侧 stdio bundle，均不适用。

## 4. 验证记录（本次实跑）

| 层 | 命令 | 结果 |
|---|---|---|
| 基线（迁移前，`9b89af7f`，0.1.5-rc.1） | `pnpm typecheck && pnpm build && pnpm test && node scripts/conformance.mjs && node scripts/preset-smoke.mjs` | 全绿：175 tests、`ACP v1 CONFORMANCE OK`（27 工具）、`PRESET SMOKE OK` |
| L1 依赖解析 | `pnpm install --no-frozen-lockfile` + 锁文件 grep | cohort 统一 `0.2.0-rc.2`，`0.1.5-rc.1` 零残留；`minimumReleaseAgeExclude` 重生成 150 条 |
| L2 静态 | `pnpm typecheck && pnpm build` | 0 错（桥代码对 0.2.0 声明面源码级兼容，无需改动）；`lib/` 与源码同提交 |
| L3 单测 | `pnpm test` | **175 passed / 16 files**（含 spawn 探针：帧纯净、会话历史、审批可见性、elicitation 门控） |
| L4 wire 一致性 + 挂载审计 | `node scripts/conformance.mjs` | `ACP v1 CONFORMANCE OK`；mount 矩阵 26 工具 / 5 斜杠与再基线化 golden 精确一致 |
| L5 部署字段 | `node scripts/preset-smoke.mjs` | `PRESET SMOKE OK`：`__bogus` → 可读 invalidParams 且列出 `standard, ptc, minimal, cordis`；`smoke` 预置（`DSH_ACP_DEV_PATCH` 声明）被 `DSH_ACP_PRESET=smoke` 命中并出现在选择器；未设 env 回落 `standard`；空白会话切换 → close → resume 恢复所选预置；落盘 header `version: 4`、`agentPreset` 投影正确 |
| L6 真实部署面 | `dsh --profile acp`（宿主 0.2.0-rc.2，隔离 `DSH_HOME`）+ ACP 客户端握手 | `session/new` 回 `preset`（Standard/PTC/Minimal；`cordis` 因缺 host seat 按设计 broken 不上架）、`model`、`thought_level`、`permission`；`DSH_ACP_SNAPSHOT_MOUNTS=1` 快照工具面与 golden 一致 |

## 5. 缺口、残余风险与回滚

1. **走廊缺口段（显式声明）**：本地升级技能的版本卡止于 `dsh-v0.1.2-rc.1`；`0.1.5-rc.1 → 0.2.0-rc.2` 十一包段**无卡片**（且该段 4102 commits，远超逐条审计规模）。本报告结论由 **npm 物化 `a/`/`b/` 双树 + 逐包声明面 + 本机真实 profile 实测 + 全量门禁实跑**派生，属插件面定向审计，**不等于**上游全量审查。向上游补卡是独立活动（`.agents/` 为本地 gitignore 目录，本次未改技能卡片）。
2. **`cordis` 预置现已在 base-only 的 ACP profile 上可挂载**（本次补齐）：其 `tool-cordis` 注入的 `cordisInspect` 注册表由 web-app bundle 的宿主行 `cordis-host-runner` + `cordis-inspect-providers` 提供，本 bundle 已按同形插入这两行（host-plane，进程内注册一次）。真实 profile 实测：四个预置全部可选，`DSH_ACP_PRESET=cordis` 会话成功组合（29 工具，含 `cordis_inspect_list`/`cordis_inspect_query`）。dev boot 亦已把 `dsh-terminal`/`dsh-terminal-bash`/`dsh-tool-bash-persistent`/`dsh-tool-pwsh-persistent`/`dsh-agent-tool-presentation` 列为 devDependency，四个预置在标准独立 boot 里同样全部可挂载（`scripts/standard-mounts.json` 的 `presets` 键逐个基线化，conformance 每个预置各起一次探针比对）。
3. **dev 与部署的预置面只剩两处细节差异**：`cordis` 的 `tool-plugin-manager` 行按 `!!js "!ctx.get('profileContext')"` 门控 —— CLI profile 有 `profileContext`（29 工具，含 `plugin_manager`），独立 dev boot 没有（28 工具，golden 即按 dev 基线）；`tool-pwsh`/`tool-pwsh-persistent` 在 POSIX 上按平台门控不激活。
4. **未实测**：Windows（`tool-pwsh` 行 `!!js` 分支）；`session/load` 对 v3 历史日志的迁移读取（仅验证了新日志 v4 与 v0→v3 的既有路径）。`docs/approval-*-plan.zh.md` 两份未跟踪文档为**迁移前既有**工作，本次未触碰。
5. **回滚**：迁移前 main 尖 `9b89af7f`（连同当时的锁文件与 `cordis.patch.yml`/`README`/`AGENTS.md`）即回滚点；迁移已以 `86d7a78b` 合并进 `main`，回滚 = `git revert -m 1 86d7a78b`（尚未推送时也可 `git reset --hard 9b89af7f`）+ `pnpm install` 恢复 0.1.5-rc.1 树。`tmp/` 与 `.agents/` 为本地 gitignore，不在提交面。
