# dsh-acp-v1 × DSH 0.1.5-rc.1 兼容性审查与迁移报告

- **审查对象**: `dsh-acp-v1` 0.3.0 → 0.4.0（宿主侧 bundle 插件：把 DSH 经 ACP v1 / stdio 暴露给 Zed Agent Panel）
- **源状态**: git `main` @ `0735fe7b`（迁移前工作树干净）；迁移分支工作树 = 本报告同 commit
- **审查依据**: 本地升级技能 `.agents/skills/plugin-upgrade`（Mode C）+ `.agents/skills/dsh-upgrade-audit`（npm 模式物化）；技能卡片止于 `v0.1.2-rc.1`
- **版本走廊**: `dsh-v0.1.2-rc.1 → dsh-v0.1.3-alpha.2 → dsh-v0.1.5-alpha.1 → dsh-v0.1.5-alpha.2 → dsh-v0.1.5-rc.1`（`0.1.4` 未发布；`0.1.3-alpha.1` 未发布）
- **结论**: **静态 + 运行时通过**。四处真回归已修（实时流、delete、persona、命令附图），mount golden 已按新预设名册再基线化；`typecheck` / `build` / 160 测试 / wire 一致性 + mount 审计 / preset-smoke 全绿。

## 1. 身份与 cohort 一致性

| 项 | 值 | 验证方式 |
|---|---|---|
| 包名 / 版本 | `dsh-acp-v1` 0.4.0（private，预构建 `lib/` 随仓库分发） | `package.json` |
| 安装轨 | GitHub 仓库 / 本地 `link:`（bundle patch），非 npm 注册表包 | README、`cordis.patch.yml` |
| 目标 cohort | 全部 `@deepseek-ai/dsh-*` 精确钉 `0.1.5-rc.1`；`schemastery` 3.18.2；`cordis` 4.0.2；ACP SDK 1.4.0 | `package.json` + 锁文件 |
| 锁文件 | 无旧 cohort 残留（`grep -c '0\.1\.2-rc\.1' pnpm-lock.yaml` = 0） | `pnpm-lock.yaml` |
| Node | v24.18.0（`engines: ^22.19 \|\| >=24` ✓）；0.1.5-rc.1 的 dsh CLI 未声明 `engines` | `node --version`、dsh `package.json` |
| 宿主二进制 | 本机 `dsh --version` = **0.1.5-rc.1**；npm `latest`/`next` 同 | `dsh --version`、`npm view @deepseek-ai/dsh dist-tags` |
| **迁移前已存在的漂移** | 插件声明 0.1.2-rc.1，但部署 profile 的 `~/.dsh/profiles/node_modules/@deepseek-ai/*`（250 包，指向全局 dsh 安装）已解析 **0.1.5-rc.1** → 类型面与运行面不一致 | 逐包读取 `package.json` |
| 官方对照 | `@deepseek-ai/dsh-acp@0.1.5-rc.1` 仍为 automation-only（不注册 `session/load`/`delete`，只发布提交后的 `assistant/message`）；`@deepseek-ai/dsh-acp-app@0.1.5-rc.1` persona 用 `personaPrefix/personaSuffix`、默认 model 仍 `deepseek-v4-flash` | 包内 `README`/`lib/index.js`/`cordis.patch.yml` |

### 1.1 物化产物（npm 模式，`0.1.2-rc.1 → 0.1.5-rc.1`）

```bash
node .agents/skills/dsh-upgrade-audit/scripts/materialize-npm.mjs \
  0.1.2-rc.1 0.1.5-rc.1 tmp/0.1.2rc1-to-0.1.5rc1 --no-github
```

- 产物：`tmp/0.1.2rc1-to-0.1.5rc1/{a,b,manifest-diff.txt}`（`tmp/` 已加入 `.gitignore`）。
- 规模：CLI 闭包 **224 → 241** 包。仅 A 有：`node-addon-landlock-run(-linux-x64)`；仅 B 有：`dsh-session-format`、`dsh-session-format-catalog`、`dsh-session-format-v0-to-v1/v1-to-v2/v2-to-v3`、`dsh-package-manifest`、`dsh-tool-present`、`node-addon-system(-linux-x64)`、`dsh-api-*`/`dsh-client-*`/`dsh-host-*` Web 面整簇、`dsh-chunked-list`、`dsh-file-reference`、`dsh-mcp-client`、`dsh-headless` 等。
- **局限（如实声明）**：本机到 GitHub 的 TLS 不可达（`curl https://api.github.com/...` 失败），`--no-github` → **无 commit/revert 富化，revert 意图不可检测**；CLI 闭包不含全部可发布包；Python SDK 不在 npm 工件范围。

## 2. 触点核查（pre-flight 七类）

扫描范围：`src/ tests/ scripts/` + 根配置；对照面 = 已发布 0.1.5-rc.1 声明/实现（本地 profile cohort）与物化 `b/` 树。

| 触点 | 命中 | 判定与证据 |
|---|---|---|
| #1 源补丁 | 0（组合面 1 处） | `cordis.patch.yml` 是组合配置（API-08）；但 `system-prompt` 行 config 键 `persona` 在新 schema 中**已移除** → 改为 `personaPrefix`/`personaSuffix` |
| #2 事件 | 2 处改、1 处新增忽略 | 移除：`session/event` 的 `assistant/chunk`（已在 `KNOWN_SESSION_EVENT_TYPES` 删除）；新增消费：`agent/assistant-stream`；新增 `system/message`（回放 switch 默认忽略，正确）。逐名验证存续：`session/event`、`todo/write`、`session/title`、`turn/start|end`、`tool/call|result`、`agent/inbox/claimed`、`agent/error`、`approval/request`、`user-questions/request`、`llm/adapters-updated`、`skills/change`、`commands/change` |
| #3 服务/Remote | 3 处 | `sessionPersistence.locate()` **已移除** → `resolveCurrentLog(id)`（JSONL 后端公共方法）；`commands.execute` 第 3 参由 `EncodedImageAttachment[]` 变为 `CommandSubmitAttachment[]`；其余弱 `ctx.get` 缝（sessionQuery / tools / skills / agentPresets / permissionPresets / sessionProjections / attachments / llm / commands）签名逐一核对未变 |
| #4 宿主文件系统 | 1 处 | delete 仍走公共缝 `resolveDshHome()` + `sessions` 根围栏；目录布局为 `$DSH_HOME/sessions/<cwd-slug>/<uuid>/session.jsonl[.zstd]`（与 0.1.2 同形）；围栏加固为分隔符边界 |
| #5 UI/commands/tools | 2 处 | 命令平面附件形状（同 #3）；挂载面变化：base 删除 `tool-str-replace-editor`，`standard` preset 新增 `@deepseek-ai/dsh-tool-present` |
| #6 自定义通道 | 0 | 纯 stdio JSON-RPC；无 HTTP/WS/RPC server → 鉴权门 N/A |
| #7 子进程/stdout | 0（仅测试工具） | 生产代码不解析子进程输出；stdout 纯净性由 `tests/frame-purity.test.ts` 继续把关 |

**逐字未变（identity 面）**：`dsh-user-questions`、`dsh-user-approval`、`dsh-tool-todo`、`dsh-home-paths`、`dsh-permission-presets`、`dsh-skill` 全量 `lib/` 逐字相同；`dsh-agent-presets` 仅 `typert.host.js` 变；`dsh-base` 的 `lib/` 相同（仅 `cordis.patch.yml` 变）。

## 3. 旧→新账本（逐项处置）

| # | 旧（0.1.2-rc.1） | 新（0.1.5-rc.1） | 处置 | 证据 |
|---|---|---|---|---|
| 1 | durable 事件 `assistant/chunk`（turn/step/chunk） | Agent 事件 `agent/assistant-stream`：`start{attemptId,revision,turn,step}` / `chunk{attemptId,revision,index,time,chunk}` / `end{…,outcome}` | **已迁移**：start 帧记 attempt→(turn,step)；chunk 用 `chunk.index`（内容块下标）保持 `${turn}:${step}:${blockIndex}` 去重键；替换 attempt 清同 `turn:step:` 前缀累积、abandoned end 再清；纯函数 `foldStreamFrame` | `src/bridge/index.ts`、`updates.ts`、`tests/stream-frames.test.ts` |
| 2 | `SessionPersistence.locate(header) → {kind,path}` | `resolveCurrentLog(id, signal?) → path \| undefined`（仅当前代；历史代返回 undefined） | **已迁移**：`deletePersisted` 改 async；路径围栏抽为 `sessionDirForDelete`（sessions 根**分隔符边界** + UUID 目录名）；不再要求 header.cwd | `session-store.ts`、`tests/session-store.test.ts`、`tests/session-history.test.ts`（delete→resume 失败） |
| 3 | `system-prompt.config.persona` | `personaPrefix` / `personaSuffix`（+`includeIdentity`） | **已迁移**：身份句进 prefix，cwd/sandbox 说明进 suffix（与官方 `dsh-acp-app` 同形） | `cordis.patch.yml`；`scripts/preset-smoke.mjs` fixture 的 `dsh-persona` `text:`→`prefix:` |
| 4 | `commands.execute(agent, line, {mediaType,data}[], signal)` | `(agent, line, ({type:'image'}&EncodedImageAttachment \| {type:'file',receiptId})[], signal)` | **已迁移**：`encodedImages` 加 `type: 'image'` | `src/bridge/index.ts` |
| 5 | `SESSION_FORMAT_VERSION = 0`（无迁移，拒绝其他版本） | `= 3`，配 `dsh-session-format-v0→v1→v2→v3` 迁移链；header 增 `isSeeded`/`delegationDepth` 等，`Session.fromRestore` 加 `eventState`、`seedSource`→`eventState` | **非命中**：插件经 `sessionQuery`/`ctx.sessions` 读写，不构造 seed、不读 `version`；实测旧 v0 日志由宿主自动迁移（preset-smoke 新会话落盘即 `version:3`） | `tests/session-history.test.ts`（旧 home 会话 list/resume） |
| 6 | `EpochHeader.system` | 移除；system prompt 成为 surface 节点 0（`system/message`） | **非命中**：插件不读 `EpochHeader.system`；回放 switch 默认忽略 `system/message` | `src/bridge/replay.ts` |
| 7 | `assistant/message{message,usage}` | 增 `stream: AssistantStreamRecord[]`；新增 `assistant/attempt`（无 surface 的失败/取消 attempt） | **非命中（附加字段）**：提交块内容与 `derived` 语义未变；`assistant/attempt` 不产生 wire 面 | `src/bridge/index.ts` `deliverAssistantMessage` |
| 8 | `Context.agent?`；`AgentSetup(ctx)` | `Context.agent` 移除；`AgentSetup(ctx, agent)`；`Create/ResumeAgentOptions.parentAgent?` | **非命中**：插件只用 `ctx.agents`，setup 回调 1 参兼容 | `src/bridge/index.ts` |
| 9 | `Inbox` 独立模块 + splice 同步可读旧值 | `Inbox` 合入 runtime-types；`agent/inbox/spliced` 语义改为"投影先于 append 返回提交" | **非命中**：插件只订阅 `agent/inbox/claimed`（payload 未变） | `dsh-agent/lib/types/runtime-types.d.ts` |
| 10 | `dsh-attachment` 独立 `admitPromptContent(store, …)`；`saveImages` | `admitPromptContent` 成为 store 方法；新增 FileBlock/`saveFile`/`readFileStream`/`admitsEncodedFile`/`isAttachmentError` | **非命中**：插件用 `saveImages` + `isImageAdmissionError`（两者仍在导出面）；ACL 附图路径未变 | `src/bridge/content.ts` |
| 11 | `dsh-llm` 无文件块；`StreamChunk` | `FileBlock`/`projectFilesToText`/`SystemPromptUpdate`（均为增量）；`StreamChunk` 联合体逐字未变 | **非命中**：stub adapter 与 delta 判定无需改 | `tests/*`、`scripts/wire-probe.mjs` |
| 12 | `dsh-app-boot` 自带 manifest 类型 | `DshBundleManifest/DshProfileManifest/ProfilePatchReload` 迁到 `dsh-package-manifest`；增 `loadProfileDirectory` | **非命中**：`dev-bin.ts` 只用 `boot`/`installFailLoud`/`loadOverlayPatches`（签名未变）与 `manifest.dsh.bundle.patch` 字面读取 | `src/dev-bin.ts` |
| 13 | base 默认 model `deepseek-v4-flash`；挂 `tool-str-replace-editor`；`standard` preset 无 `present` | base 默认 `deepseek-flash`；删 `tool-str-replace-editor` 行；`standard` 增 `@deepseek-ai/dsh-tool-present` | **已迁移（挂载面）**：golden 再基线化（−str_replace_editor，+present）；路由默认**保持** `deepseek-v4-flash`（新目录仍在，官方 `dsh-acp-app` 同版本同值） | `scripts/standard-mounts.json`、`cordis.patch.yml` |
| 14 | 事件名表 / 词汇表 | `KNOWN_SESSION_EVENT_TYPES`：删 `assistant/chunk`、`tool/code-dispatch*`，增 `assistant/attempt`、`system/message`、`deliverables/presented`、`feedback/message-*`、`subagent/catalog`、`tool/ptc-dispatch*` | **非命中**：插件自写事件仅 `model/selection`（仍在表内，ignorable 风险不适用） | `dsh-session/lib/types/known-event-types.js` |

**判定 N/A**：Web Client 面（`dsh.client`/客户端 bundle/宿主 UI 文本锚定/webServer 路由）、Remote/`apiProxy`/`ctx.remote`、headless stderr 契约、PTC、telemetry/隐私面——插件为宿主侧 stdio bundle，均不适用。

## 4. 验证记录（本次实跑）

| 层 | 命令 | 结果 |
|---|---|---|
| 基线（迁移前，`0735fe7b`） | `pnpm typecheck && pnpm build && pnpm test && node scripts/conformance.mjs && node scripts/preset-smoke.mjs` | 全绿：149 tests、`CONFORMANCE OK`、`PRESET SMOKE OK`、`git status` 干净（build 幂等） |
| L1 依赖解析 | `pnpm install` + 锁文件 grep | cohort 统一 0.1.5-rc.1，旧版本零残留 |
| L2 静态 | `pnpm typecheck && pnpm build` | 0 错；`lib/` 与源码同提交 |
| L3 单测 | `pnpm test` | **160 passed**（149 基线 + `foldStreamFrame`/`clearStreamKeys` 11 项；含 spawn 探针：帧纯净、会话历史、elicitation 门控） |
| L4 wire 一致性 + 挂载审计 | `node scripts/conformance.mjs` | `ACP v1 CONFORMANCE OK`；mount 矩阵 27 工具 / 5 斜杠与 golden 精确一致 |
| L5 部署字段 | `node scripts/preset-smoke.mjs` | `PRESET SMOKE OK`（bogus / user-root preset / fallback），落盘会话 header 为 `version: 3` |
| L6 端到端行为 | `node scripts/wire-drive.mjs`（stub LLM，隔离 DSH_HOME） | prompt → 提案 → bash 卡片 → 审批往返 → 回读 → plan → ask 表单 → 终答，`stopReason: end_turn`；`agent_thought_chunk`/`agent_message_chunk` 出现在 `tool_call` **之前**（live delta 已恢复） |
| L7 运行时事件验证 | 临时插桩（已移除，未入库） | `agent/assistant-stream` 帧实收：`start/chunk/end` 各一轮，`record=true same=true`，chunk 类型含 `reasoning-delta`/`text-delta`/`tool-call-delta`/`block-end`/`finish` |
| L8 CLI profile 路径 | 隔离 `DSH_HOME` + `dsh plugin --profile acp add <dir>` + `dsh --profile acp` | 模板组合下由官方桥应答（见 §5.9）；按 README 修正 bundles 后：`agentInfo.name = dsh-acp-v1` / `version 0.4.0` / `loadSession: true` / `session/new` + `session/close` ok / exit 0 |
| 帧纯净 | `tests/frame-purity.test.ts`（spawn `lib/dev-bin.js`） | 通过（stdout 仅 JSON-RPC） |

> 注：`ctx.logger.warn` 在本 dev boot 下不落 stderr（harness logger 级别），排障时曾因此误判事件未送达；诊断改用 `process.stderr.write` 后确认事件正常。生产诊断仍按不变式走 `ctx.logger`。

## 5. 缺口声明与残留风险

1. **走廊缺口段（显式声明）**：本地升级技能的版本卡止于 `dsh-v0.1.2-rc.1`；`0.1.2-rc.1 → 0.1.5-rc.1` 四段边**无卡片**。本报告结论由已发布产物（npm 物化 `a/`/`b/` + 本机 0.1.5-rc.1 profile cohort）、逐包声明面 diff、以及实跑验证派生；**不等于**上游审查结论。向上游补卡是独立活动（`.agents/` 为本地 gitignore 目录，本次零改动）。
2. **GitHub 富化不可用**：无 `commits.txt`/`reverts.txt`，revert 意图**不可检测**；本走廊的适配不依赖 revert 判断。
3. **重试 attempt 的已发增量不可撤回**：替换 attempt 会重置累积并在提交时补发整段（原 attempt 的增量可能已到客户端）；这是"提交不丢尾"与"绝不重复"两约束下可接受的行为。
4. **仅存历史代日志的会话**：`resolveCurrentLog` 对"只有旧代文件、尚未被 0.1.5 宿主迁移"的会话返回 `undefined` → delete 降级为告警（可选手化：删除前先 `sessionQuery.readSession` 触发迁移）。
5. **路由默认值**：保持 `deepseek-official/deepseek-v4-flash`（新目录中仍存在，官方 `dsh-acp-app` 同版本同值）；`deepseek-flash` 已是 base 新默认并出现在目录首项，建议官方 app 切换时同步跟进。
6. **挂载面新增 `present`**：卡片走通用分类（非 execute），暂无专属标题规则；如需可后续按 `tool-cards.ts` 模式补。
7. **安装通道**：cohort 精确钉版、锁文件无混合；`pnpm install` 走公共 registry（本机 npm 可达、GitHub 不可达）。
8. **无 CI**：门禁仍以 AGENTS.md 的本地四命令为准（含 `lib/` 新鲜度纪律）。
9. **CLI 模板漂移（0.1.5 线实锤，非本次引入）**：在隔离 `DSH_HOME` 里执行
   `dsh plugin --profile acp add /path/to/dsh-acp` 后，模板生成的 profile
   `dsh.profile.bundles` = `["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-acp-app",
   "dsh-acp-v1"]`；实测应答客户端的是**官方桥**
   （`agentInfo.name = deepseek-harness-acp`、`session/close` 回 invalidParams），
   本插件拿不到连接。手动把 `@deepseek-ai/dsh-acp-app` 从 bundles 移除后，
   同一 profile 实测 `agentInfo.name = dsh-acp-v1`、`version = 0.4.0`、
   `loadSession: true`、`session/new` + `session/close` 正常、EOF exit 0。
   README（en/zh）已加入此安装后检查；本机**已部署**的
   `~/.dsh/profiles/acp` 的 bundles 本就只有 base + 本插件，不受影响。

## 6. 回滚

- 迁移前基线：`HEAD = 0735fe7b`，`/tmp/baseline-hashes.txt` 记录 `pnpm-lock.yaml` 与 `lib/` 全文件 sha256；基线测试输出 `/tmp/baseline.log`。
- 回滚方式：`git checkout -- .`（或 revert 本次 commit）+ `pnpm install` 恢复旧 cohort；`lib/` 为提交产物，随源码一并还原；`acp` profile 是 `link:` 安装，重启 `dsh --profile acp` 即回到旧行为。
- 未触碰：`~/.dsh` 下其他 profile/settings/credentials、`.agents/`、`tmp/` 外任何路径。
