# dsh-acp-v1 × DSH 0.1.2-rc.1 兼容性审查报告

- **审查对象**: `dsh-acp-v1` 0.1.0（宿主侧 bundle 插件：把 DSH 经 ACP v1 / stdio 暴露给 Zed Agent Panel）
- **源状态**: git `main` @ `3b8a1a2f`，工作树干净（审查全程零写入）
- **审查依据**: oh-my-dsh/dsh-plugin-upgrade-skill @ `8f81449`（2026-09-06 同步），Mode C 静态审查流程 + pre-flight 七类触点 + 版本走廊全卡片
- **版本走廊**: `dsh-v0.1.1-rc.2 → dsh-v0.1.2-rc.1`（alpha.1 → alpha.2 → alpha.3 → alpha.4 → alpha.5 → rc.1 六条边；适配提交 `7716c8bc`，2026-09-05，此后另有 5 个功能提交）
- **结论**: **静态层面通过**。42 张走廊卡片 + rollup 13 条增量逐项核对，未发现需要修改代码的问题；待办仅剩机械基线与宿主二进制版本确认（见 §5）。

## 1. 身份与 cohort 一致性

| 项 | 值 | 验证方式 |
|---|---|---|
| 包名 / 版本 | `dsh-acp-v1` 0.1.0（private，预构建 `lib/` 随仓库分发） | package.json |
| 安装轨 | GitHub 仓库 / 本地 link（bundle patch 安装，非 npm 注册表包） | README、cordis.patch.yml |
| DSH cohort | 全部 `@deepseek-ai/dsh-*` 精确钉 `0.1.2-rc.1`；cordis 4.0.2；schemastery 3.18.1 | package.json + 全量 lockfile 扫描 + node_modules 逐一读取 |
| lockfile | 无混合 cohort、无旧代残留；schemastery 同时解析 3.18.1/3.18.2（pnpm 隔离布局下的嵌套副本，无害） | grep pnpm-lock.yaml |
| Node | v24.18.0（engines `^22.19 \|\| >=24` ✓；A2-04 故障窗口 24.0–24.11.1 已修复线之上） | node --version |
| 宿主二进制 | 本机 `~/.dsh/` 在用但未能定位 `dsh` 可执行文件读版本；README 声明 tested on 0.1.2-rc.1 | 待用户外部确认（§5） |

## 2. 触点核查（pre-flight 七类）

扫描范围：`src/ tests/ scripts/` + 根配置（package.json / cordis.patch.yml / tsconfig / pnpm-workspace.yaml），排除 `node_modules lib .agents .pnpm-store`；模式取自 skill 的 `pre-flight-patterns.json`。

| 触点 | 命中 | 判定与证据 |
|---|---|---|
| #1 源补丁 | 0 | `cordis.patch.yml` 是组合配置（API-08），文件名含 patch 不构成本类命中 |
| #2 事件 | 9 文件 | 全部消费面；事件名逐一到 rc.1 包内验证存在（§3.2） |
| #3 服务/Remote | 11 处 `ctx.get` | 弱 get + undefined 容错；无 `apiProxy`、无 `ctx.remote` —— 正是 A1-01 field note 对宿主面消费者的正确迁移形态（直注域服务） |
| #4 宿主文件系统 | 2 处生产命中 | 均走公共缝 `resolveDshHome()`（@deepseek-ai/dsh-home-paths）；durable delete 有 sessions 根围栏 + UUID 目录名校验；dev/probe 脚本用隔离 `DSH_HOME` |
| #5 UI/commands/tools | 1 处 | `commands.execute(agent, line, images, signal)` 四参签名 = R-11 台账适配后形态；无 Web Client 面 |
| #6 自定义通道 | 0 | 纯 stdio JSON-RPC；无 HTTP/WS/RPC server → A1-08 鉴权门 N/A |
| #7 子进程/stdout | 仅测试工具 | 生产代码不解析子进程输出（headless stderr 契约 A1-05 N/A） |

## 3. 卡片逐项处置

### 3.1 命中且已正确适配

| 卡片 | 适配证据（当前源码） |
|---|---|
| A1-01（APIProxy 移除） | 宿主面直注域服务：`ctx.get('llm'/'sessionQuery'/'sessionPersistence'/'agentPresets'/…)`，无 apiProxy/ctx.remote 残留 |
| A1-20（user-questions 瀑布） | 仅注册 `'user-questions/request'` waterfall（index.ts:1546），显式注释作用域拓扑（未打标根监听器可收 agent-scoped 派发）；rc.2 的 `registerProvider` 回退已按走廊净态纪律移除——单 cohort 目标下正确 |
| A1-21（resolveSessionPreset 移除） | 零残留；dev-bin preset root 探测包内 `presets/` 目录（alpha.1+ 布局，A1-21 配方原样）；resume 回退 `header.agentPreset` |
| R-10（base-only 挂 shipped preset） | cordis.patch.yml 已带 `@deepseek-ai/dsh-tool-subagent/model-selection-settings` host 行 |
| R-11 / A4-04（类型面漂移 / branded seq） | `commands.execute` 四参；`SessionId` 经 `brandSessionId()` 包装；无裸 seq 构造；无 fork seeding（`seedLength` → `isSeeded`/`inheritedEventCount` N/A）；TodoItem 类型来自 tool 包 |
| A4-01（report 工具移除） | `tool-subagent-report` 全仓零残留 |
| A4-03（Session.events 移除） | 无 `Session.events` 直读；`.events` 命中皆为 sessionQuery 缝自有读面（`readSession()` 返回值） |
| R-05（移除包清单） | `dsh-client-runtime` / `dsh-acp-snapshot` / `dsh-host-apiproxy` / `dsh-sdk-jsonrpc-demo` / `dsh-acp-demo` 全仓零命中 |
| R-07（启动竞态） | apply 期一次性弱探测，无轮询、无硬 inject 等待；`inject` 四项（agents/sessions/sessionQuery/sessionPersistence）在 dsh-base rc.1 全部存在（A2-08 ✓） |
| R-01/R-08（安装通道） | cohort 精确钉版；pnpm-workspace 已配 `allowBuilds`；rc.1 自 2026-09-04 起为 npm `latest`，无镜像/供应链窗口问题 |

### 3.2 重点验证：自定义持久化事件的合法性（本审查最高风险点，已排除）

插件经 `session.append('model/selection', …)`（index.ts:841）写入自有持久化事件。A1-02/A2-01 的 `ignorable` 语义只约束宿主词汇表**之外**的事件（未知事件无标记时 reload 拒绝）。已按 precision-checklist"源内注释不是事实"纪律，直接在 rc.1 包源验证：

- `model/selection` → `dsh-session/lib/types/known-event-types.js:41` ✓
- `session/title` → 同文件 `:50` ✓（dsh-session-title 服务写入，桥只消费）

两者均在 `KNOWN_SESSION_EVENT_TYPES` 内，插件 `.d.ts` 增强注释与宿主事实一致，ignorable 风险不适用。

### 3.3 事件订阅名全量验证（无类型订阅拼错会静默失效）

| 订阅 | rc.1 包内位置 |
|---|---|
| `session/event`、`todo/write`、`agent-preset/selected` | dsh-session（词汇表） |
| `approval/request` | dsh-user-approval lib |
| `user-questions/request` | dsh-user-questions lib + types |
| `llm/adapters-updated` | dsh-llm lib/typert.host.js + index.js |
| `agent/inbox/claimed`、`agent/error` | dsh-agent lib/types/runtime-types.d.ts |
| `skills/change`（无类型订阅） | dsh-skill lib |
| `commands/change`（无类型订阅） | dsh-commands lib/typert.host.js |

### 3.4 判定 N/A 的卡片（证据摘要）

- **Web Client 面整簇**（A1-19/25/26/27/28/29/30/32、A2-06、R-13、precision-checklist 的 inject/locale/通道鉴权项）：插件无 `dsh.client` 块、无客户端 bundle、无宿主 UI 文本锚定、无 webServer 路由——宿主侧 stdio 插件天然不适用。
- A1-03/13（内部路径/平台 workaround）：无内部导入、无补丁面、无旧 workaround（README 明确不支持 Windows）。
- A1-05/06/22/24/31（headless 解析、PTC 改名、isTokenDelta、pi-ai、subagent descriptor）：grep 全部零命中。
- A1-09/10/11（capability 类）：A1-11（子代理模型选择）已被**有意采纳**（`installModelSelection` + R-10 host 行）；其余未采纳，capability 卡片仅建议、不自动采纳（skill 纪律）。
- A1-12/14/23（隐私面）：informational/部署决策，见 §5.4。
- A2-02（RemoteError）：无 `ctx.remote` 调用；错误在缝层处理，非 Remote 信封层。
- A2-03/04/05/10：无 peer 块、无 Node 版本 workaround、不消费 pluginInventory、不使用 ctx.settings。
- alpha.3（0 卡）、rc.1（0 卡，纯版本 bump）、alpha.5（存储域 `compatibleVersions`/`invalidRecords` 抢救 + 宿主启动修复）：宿主侧变更，插件非存储域属主，N/A。

## 4. 分层验证状态（rollup 检查单）

| 层 | 状态 | 说明 |
|---|---|---|
| L0 基线（R-06） | **未采集** | 命令见 §5.1，需确认后执行 |
| L1 依赖解析 | ✅ 通过 | 三方一致（§1） |
| L2 静态（typecheck/build） | **待跑** | 沙箱拦截 node/pnpm，命令已列出 |
| L3 卡片级单测 | 部分 | 仓库自带 89+ 测试含真实 dev-boot spawn（frame-purity、session-history）；整跑待确认 |
| L4 真实冷启动 | 部分 | 适配提交记录了真宿主 keyed session/new + 完整 message→tool→response 回合；新增探针待跑 |
| L5 跨 cohort / L6 headless | N/A | 单 cohort 工件；无 headless 解析面 |

## 5. 待办与残留风险

1. **机械基线 + runtime 探针（需确认后执行，均不改文件；history-probe 用隔离 DSH_HOME，无 API key 可跑）**：
   ```bash
   pnpm typecheck && pnpm build && pnpm test && node scripts/history-probe.mjs
   # skill 只读工具（可选）：
   node .agents/skills/plugin-upgrade/scripts/plan-migration.mjs --root . --from dsh-v0.1.1-rc.2 --to dsh-v0.1.2-rc.1
   node .agents/skills/plugin-upgrade/scripts/inject-lint.mjs .
   ```
   每条命令带显式 timeout（precision-checklist 纪律）。
2. **宿主二进制版本**：请在外部终端 `dsh --version` 确认 ≥ 0.1.2-rc.1（rc.1 已是 npm `latest`，裸装即中）。
3. **版本号烘焙风险（对应 plugin-release 新增第 11 节）**：`src/bridge/index.ts:125` 硬编码 `AGENT_VERSION = '0.1.0'`，与 package.json 双写；仓库提交预构建 `lib/`。未来发版必须"bump 清单 → 重新构建 → 同 commit 提交"三步一体，否则 tag 自相矛盾（更新角标永久提示更新）。
4. **部署策略项（非代码缺陷）**：bundle 根在 dsh-base → rc.1 起 `web_fetch` 默认开启（A4-06）、telemetry 默认 `FEEDBACK_ONLY`、启用插件名/版本随官方请求上报（A1-12/A1-23）。ACP/Zed 部署方按隐私策略决定是否在 patch 层覆盖。
5. **小项**：A1-21 更完整配方是"最后一条 `agent-preset/selected` 事件优先"，桥只回退 header——仅影响创建后被中途换过 preset 的外部会话，桥自建会话不受影响；两处无类型事件订阅（`skills/change`/`commands/change`）已验证 rc.1 存在，未来 cohort 若改名会静默失效（源码已注释）；schemastery 3.18.1/3.18.2 双解析为 pnpm 隔离布局的嵌套副本，无害。

## 6. 回滚

审查零写入，工作树保持 `3b8a1a2f` 干净；本报告文件为唯一新增产物（未跟踪，可随时删除或不提交）。
