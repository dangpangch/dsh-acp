# dsh-acp-v1 优化方案

> 依据：[report.md](./report.md)（与 cnctem/dsh-acp 的全面对比）+ 对本地源码的核实（2026-09-09）。
> 原则：所有改动以 conformance harness + frame purity 测试为回归闸门；不破坏"stdout 纯 JSON-RPC"纪律；每次 dsh 版本升级必须重跑版本走廊。

## 0. 核实结论（修正对比报告的两处判断）

- 本地**已有** elicitation 能力门控：`src/bridge/index.ts:1540` 检查 `clientCapabilities.elicitation.form`，不支持时立即拒绝 answerer、让 ask 工具把失败报给模型而不是挂死回合（design §6.4）——语义与 cnctem 等价，此项从"需借鉴"降级为"可打磨"（见 P0-3）。
- `README.md:114-123` 的 terminal 段落**确实是过时的**：它把 `terminal/create → embed → terminal/release` 条件方案写成已实现，但 src 里除注释外没有任何 terminal 调用（`src/bridge/tool-cards.ts:8` 注明该方案已被 bash 卡 read 化取代）——列为 P0-1（中文镜像 README.zh.md 同病，一并处理）。

## P0 — 一致性修复（半天，先做）

### P0-1 同步 README 与实现（terminal 段落）

- 现状：`README.md:114-123` 与中文镜像 `README.zh.md:105-110` 都在描述已移除的 terminal-echo 方案，用户按文档预期会落空（两处都要改，只改英文版会留下双语不一致）。
- 方案：两份 README 都改写为实际的 bash 卡 read 化行为（输出以代码围栏随 `tool_call_update` 发出）；terminal-echo 移到 "Roadmap" 或删除（若采纳 P3-1 则保留并标注"按客户端能力条件启用"）。
- 顺手：
  - 更新两份 README 的测试计数（"89 tests" / "89 项"——实际以 vitest 为准，当前 136）；
  - 清理"Honestly not implemented / 明确不做"段里**指涉已删除 terminal 段**的括号（`README.md:132-134` "the client terminal above only displays…" 与 `README.zh.md:118-119` "上面的客户端终端只显示已捕获的输出…"），terminal 段删除后该指涉会悬空，须一并改写。
- 验收：README（中英两份）每条功能声称都能在源码/`docs/design.zh.md` 找到对应实现。

### P0-2 补 LICENSE 文件

- 现状：package.json 声明 MIT，仓库无 LICENSE；作为 github URL 分发的插件，法律上等于 all-rights-reserved。
- 方案：加入标准 MIT 文本（版权人 dangpangch）。

### P0-3 补齐 elicitation 边界路径的测试（按可测性分两期）

- 现状：`src/bridge/index.ts:1534-1553` 有五条出口（无会话/能力缺失/decline/cancel/abort），tests/ 目录中未见对应覆盖；`askViaForm` 是 index.ts 工厂内的闭包，现有单测只测纯辅助函数、无法直接驱动它，只能走 spawn probe/conformance 式集成路径。
- 方案（分流，避免为"五条各一例"硬造不可测的用例）：
  - **P0-3a（本轮，三条外部可驱动）**：能力缺失、decline、cancel——用 conformance/probe 场景覆盖：stub LLM 主动发一次 `ask_user_question` 工具调用，客户端分别"initialize 不声明 `elicitation.form`"与"对 `elicitation/create` 回复 decline / cancel"，断言回合在有界超时内结束且模型侧收到的是工具失败而非挂起；
  - **P0-3b（随 P2-8 拆分，两条内部触发）**：无会话、abort——两条都只能从桥内部构造（未知/已关会话、已 abort 的 signal），须等 P2-8 把 `askViaForm` 拆到可单测的 seam（或提供受控 conn/signal 的测试替身）后用单测覆盖；拆分前只补防御性注释，不为它们强行造集成场景。
- 验收：五条出口各有用例且通过，断言模型收到的是工具失败而非回合挂起；P0-3b 在 P2-8 落地前不阻塞本轮 P0 收口。

## P1 — 吸收 cnctem 的三个设计（2~3 天）

### P1-4 预设作为部署字段（`DSH_ACP_PRESET` 等）

- 现状：`cordis.patch.yml:34` 静态 `default: standard`，dev 才有 `DSH_ACP_PRESET_ROOT`；用户无法不改文件地换预设/模型路由。
- 方案：
  - patch 的 `agent-presets` 行与桥行的 provider/model 改为 `!!js` 环境表达式：`default: !!js "process.env.DSH_ACP_PRESET || 'standard'"`，`provider: !!js "process.env.DSH_ACP_PROVIDER || 'deepseek-official'"` 等（cnctem 已验证此写法可行）；
  - `newSession` 对未知预设的失败映射为带明确信息的 `invalidParams`（现成机制，补测试）；
  - README 增加预设一节：内置 standard/minimal、`$DSH_HOME` 用户预设根、code/cordis 需额外宿主插件的说明；
  - `docs/design.zh.md` 增加决策记录：预设=部署字段，不进会话选择器（同意 cnctem 的定位，理由：预设决定工具集，会话中途换工具集会破坏 session 语义）。
- 验收：`DSH_ACP_PRESET=minimal dsh --profile acp` 冒烟通过；非法预设值报错信息可读。

### P1-5 挂载面防御性审计（证据驱动，不盲目抄禁用清单）

- 现状：本地 patch 几乎没有工具面禁用（仅替换 persona、关 hmr、插入 agent-presets/subagent-model-selection-settings/桥三行），宿主平面工具/persona 是否漏进 ACP 会话靠审计报告背书，缺结构性防线。
- 机制先决（枚举挂载面为何不能直接做在 conformance 客户端侧）：ACP 协议面不暴露会话的工具清单——客户端只能经 `available_commands_update` 看到斜杠命令，工具要等模型实际调用才可见；conformance 作为外部 stdio client 拿不到进程内 agentCtx 的挂载集，而在 stdout 上加内部 RPC 会违反 frame-purity（schema 断言会把未知客户端方法判为失败）。因此枚举走 **env 门控的 sidecar 快照**：wire-probe（dev 脚本，不进发布包）在每次 `session/new` 落成后，把该会话实际挂载的 tool id + 命令清单写入 `$DSH_HOME` 下 JSON 侧车文件（写文件不写 stdout，保住帧纯净），conformance 读文件与期望清单比对。
- 方案：
  - 期望清单来源定死为 `@deepseek-ai/dsh-agent-presets` 的 standard 预设静态目录（与全局层在册工具的交集规则在实现时写明并注释）；conformance 加断言：实际挂载清单与期望清单**全等比对**，清单外任何工具/命令出现即失败——对 dsh 升级敏感是特性不是缺陷（预设随版本增删工具会红掉走廊，正好由 P3-2 走廊工具抓取复核）；
  - 若审计发现宿主平面确有泄漏（如 web/HTTP 行在 ACP profile 下仍激活），再针对性地在 patch 里 `disabled: true`，不整表照抄 cnctem 的 27 行（那份清单与 cnctem 的"预设挂全部工具 + host 行整排禁用"架构绑定，本地架构不同）。
- 验收：conformance 输出挂载面矩阵（期望 vs 实际，全等通过）；泄漏为清单化、可判定的。

### P1-6 mcpServers 从"拒绝"改为"接受并忽略"

- 现状：`newSession` 对非空 `mcpServers` 硬拒绝；cnctem 的 issue #1 表明真实客户端（Zed）会转发该字段，硬拒绝造成可用性事故。
- 方案：改为接受、stderr 记日志、README "Honestly not implemented" 一节注明 MCP 不挂载；conformance 加一帧带非空 mcpServers 的 newSession 用例。
- 理由：桥不暴露 MCP 工具是能力事实，客户端声明 MCP 是它自己的选择；拒绝把"不支持"升级成"不可用"，不值得。

## P2 — 工程化（3~5 天）

### P2-7 CI（最大的设施缺口）

- 新增 `.github/workflows/ci.yml`；matrix node 22 / 24；push + PR 触发。
- 步骤与顺序（关键：**lib 新鲜度闸门**）——conformance 与 frame-purity 等 spawn 用例加载的是**提交进 git 的编译产物** `lib/`（wire-probe 经 package main 解析桥行，`.gitignore` 注释明示 lib 随源码一起提交）；若 CI 只跑测试，一个只改 src、忘提交 lib 的 PR 会全绿却测到旧代码。因此顺序固定为：
  1. `pnpm typecheck`；
  2. `pnpm build`（tsdown → lib/）；
  3. `git diff --exit-code -- lib/`——构建产物与提交的 lib 不一致即失败（把"重建后连同提交"从 .gitignore 注释变成 CI 强制）；
  4. `pnpm test`（vitest：单测 + spawn 帧纯净探针，此时测的是新鲜 lib）+ `node scripts/conformance.mjs`；
  5. README 无 key 冒烟（spawn 实测 frame purity 已在 vitest 里，直接复用）。
- 沙箱首跑验证项：conformance 会真实执行一次 bash 工具调用（dsh-bash-sandbox）；若沙箱依赖 unshare/seccomp 类特权，ubuntu-latest 普通 runner 可能不稳——CI 首跑即验证，必要时将该场景改为可降级或注明 runner 要求。
- 验收：绿徽章；conformance 在 CI 里跑通（harness 自建临时 DSH_HOME、经 wire-probe 隔离 boot，已确认无 $DSH_HOME 依赖）。

### P2-8 拆分 index.ts（约 1590 行）

- 现状：会话生命周期、prompt/回合驱动、权限桥、EOF/quiesce 全在一个文件，是唯一的结构性风险点。
- 方案：拆为 `bridge/lifecycle.ts`（new/load/resume/close/delete）、`bridge/prompt.ts`（prompt 单飞与回合驱动）、`bridge/permission.ts`（requestPermission 桥 + allow_always）、`bridge/eof.ts`（quiesce 与在途投递），index.ts 保留为组合根；wire builders 已在 updates.ts 不动。
- 顺手：把 `askViaForm` 与 elicitation 出口一并拆到可单测的 seam（elicitation 桥与权限桥同类，可并入 permission.ts），承接 P0-3b 的两条内部路径用例——这是把 P0-3b 从"待办"变成"可测"的唯一前置。
- 约束：纯移动不改行为，conformance + 136 测试为闸门。

### P2-9 发布与社区化

- GitHub Releases：tag → 打 tarball（`plugin-release` skill 已有流程）、CHANGELOG.md、语义化版本纪律；
- 补 AGENTS.md（贡献/代码结构指引，cnctem 已示范）；
- 视情况把仓库转公开（对比中 cnctem 的 star/issue 互动说明这个品类有真实受众）。

## P3 — 战略性/可选

### P3-1 能力感知的 terminal 回显（README 已许愿的功能）

- cnctem 保留 terminal/create（自承一次性填充），本地因 Zed 1.18 折叠问题移除。方案：在 `initialize` 时检查 `clientCapabilities.terminal` + `clientInfo.version`，仅对确认无折叠问题的客户端启用 terminal/create，其余走 bash 卡。这是对支持客户端的最大 UX 增益（原生终端卡 + 退出码）。先做 Zed 现行版本行为验证，再决定做不做。

### P3-2 dsh 升级走廊自动化

- 把兼容性审计（`.agents/skills/dsh-upgrade-audit`）封装成 `pnpm audit:corridor <from> <to>` 脚本 + CI 手动触发，使未来 0.1.2→0.1.3 的升级成本从"人工审计"降为"跑脚本 + 复核"。

### P3-3 错误码分类学

- 把桥内抛给模型的工具失败统一为命名错误码（如 `ELICITATION_UNSUPPORTED`），提升可测试性与客户端可判读性。

### P3-4 技术文档英译

- `docs/design.zh.md` 的英文摘要，扩大受众（README 已双语，深文档是纯中文）。

## 建议顺序与工作量

| 阶段 | 内容 | 工作量 | 依赖 |
|---|---|---|---|
| 第 1 周 | P0-1、P0-2、P0-3a（elicitation 外部三路径）+ P1-4（预设部署）+ P2-7（CI） | ~2 天 | 无 |
| 第 2 周 | P1-5（含 sidecar 快照机制，单列 ~1.5~2 天）、P1-6 + P2-8（拆分，承接 P0-3b） | ~4 天 | CI 先行 |
| 之后 | P2-9 发布 + P3 按需 | 1~2 天 | 仓库转公开的决策 |

P0 与 P1-4、P2-7 性价比最高：修复文档失真与法律瑕疵、拿到 cnctem 的部署灵活性、补上最大的质量缺口，三件事都不动核心桥逻辑。

## 执行注记（2026-09-09 落地，与正文的偏差以此为准）

- **P1-4 机制变更**：正文第 41 行的 patch 级 `!!js` 方案未落地——本走廊 loader
  对 patch 行 `!!js` 的求值时机不可依赖（`--dump-config` 不求值、行 schema 校验在
  插值之前；cnctem 的写法属其 rc.2 走廊）。实现改为**桥代码读取部署 env**
  （`DSH_ACP_PRESET/PROVIDER/MODEL`，会话/agent 创建时生效、改后重启），patch
  行保持字面量默认值；错误路径、文档与决策记录见 design.zh.md §5。
- **P2-7（CI）**：按所有者决定暂不做；本地闸门（typecheck/test/conformance/
  preset-smoke + lib 随源码提交纪律）暂代，见 AGENTS.md。
- **P2-8**：仅落地 elicitation seam 抽取（`src/bridge/elicitation.ts` +
  P0-3b 内部两路径单测）；lifecycle/prompt/permission/eof 四模块拆分推迟
  （组合根闭包互依度高，纯搬移≈重写；无 CI 漂移网时风险不成比例），见
  CHANGELOG。
- **P2-9**：本地件（AGENTS.md/CHANGELOG.md）已完成；tag/Release/tarball/转公开
  未做；提交未推送（本地 main 领先 7 个 commit，docs 栈已合并为一条）。
- **P3**：P3-3（错误码）已随 P0 提前落地；P3-4 英文摘要已落地；P3-2 为薄包装
  （`pnpm audit:corridor`）；P3-1 未做（需真实 Zed 验证）。
- **测试数**：正文按 vitest 权威计数修订为 136 → 落地后 149（新增 elicitation
  gate/核心单测与 mount-matrix 负例）。
- **新发现（未修）**：dsh 0.1.2-rc.1 的 `dsh plugin --profile acp add` 新装模板
  含官方 `@deepseek-ai/dsh-acp-app` bundle，该组合下 agent-presets 行不加载
  （无 meta.agentPreset）；模板变更前创建的 profile（base+本插件）不受影响，
  需在发布前决策安装说明。
