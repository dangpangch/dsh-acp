# 技术文档（docs/design.zh.md）· dsh-acp-interactive

> 交付与使用（安装、Zed `settings.json`、冒烟）见仓库根 README；本文是**唯一
> 的技术/设计文档**，合并原 decisions 决策记录与安装手册中的技术部分。源码
> 注释里引用的 `design.zh.md §N` 即指本文对应小节。

## 1. 定位

dsh-acp-interactive **本质上是一个 dsh plugin**（dsh bundle 包，声明
`dsh.bundle.patch: cordis.patch.yml`），目的：

- 补足 **dsh 原生 ACP 缺失的能力**：官方 `@deepseek-ai/dsh-acp` 是
  automation-only（fresh-only、committed-only、无交互面），与 Zed 的交互要求
  不兼容；本插件是其**交互档补充**。
- 把 DeepSeek Harness 作为 **Zed Editor 的自定义 agent server extension**
  提供（交互式 ACP v1 服务器，经 `dsh plugin --profile acp add <url|dir>`
  装入 profile、`dsh --profile acp` 启动，走 stdio + JSON-RPC）。
## 2. 组成与进程模型

### 2.1 bundle 组合

- profile `package.json` 的 `dsh.profile.bundles`：`@deepseek-ai/dsh-base` +
  `dsh-acp-interactive`（按序作为补丁层）。
- `cordis.patch.yml` 一行一个补丁（`- insert:` 追加行 / `{id, config}` 替换整
  行 config）：
  - `system-prompt`：ACP 会话专属简洁编码 persona（含 sandbox 提示、验证工作
    的要求），**替换** dsh-base 默认 persona；
  - `hmr.disabled: true`：ACP stdio 会话不能热重载（会撕断连接）；
  - `agent-presets`（`@deepseek-ai/dsh-agent-presets`，`default: standard`）：
    每个 ACP agent 由 preset 组合；dsh CLI profile boot 自动补 shipped preset
    root，独立 dev boot 须自带 roots（fixture overlay）；
  - `dsh-acp-interactive`：bridge 行（provider `deepseek-official` / model
    `deepseek-v4-flash`，客户端可经 configOptions 逐会话切换）。
- dsh-base 提供全部宿主行（llm / agents / sessions / persistence /
  session-query / projection / approval / sandbox / commands / 工具注册 /
  llm-deepseek 默认路由…）；未含 `agent-presets` 行与 `tool-ask-user` 行
  （后者由 elicitation 桥按需补 host 行 + `userQuestions` provider）。

### 2.2 进程与生命周期

- 单进程一条 `AgentSideConnection`（stdin/stdout），每 ACP 会话一个
  `SessionRecord`（cwd / agent / selection / inflight / 已发送折叠 / …），
  输出按会话**串行化**投递。
- **stdout 纪律**：只允许 JSON-RPC；一切诊断走 `ctx.logger`（stderr）；
  launcher 不写 stdout。
- **EOF/退出**：SDK 读流下 `process.stdin 'end'` 不触发；以 `conn.closed`
  （输入流结束即关闭连接）为准 → 每会话 quiesce（drain 在途请求）→
  `ctx.appExit(0)`（launcher 发布的退出请求，无 `cmdline` 服务）。
- 会话级 cancel/close：单会话 quiescent teardown（`requestStop` → drain →
  dispose → `sessions.flush` 落盘），绝不触碰兄弟会话。
- 未决 ACP 请求集合：客户端刚发请求就关 stdin 时，先回完再退出
  （immediate-EOF 冒烟约束）。

## 3. ACP ↔ dsh 映射

### 3.1 会话生命周期

| ACP | dsh | 备注 |
|---|---|---|
| `session/new` | `ctx.agents.create`（cwd + setup 内 `agentPresets.mount(standard)`） | 一次性建号，durable flush |
| `session/list` | `ctx.sessionQuery.listSessions` | 最新在前，header 摘要 |
| `session/load` | `agents.resume` + **回放历史通知流** | ACP 语义 = 把完整历史作为通知回放给客户端（见 §4） |
| `session/resume` | `agents.resume`（不回放） | 恢复上下文继续对话 |
| `session/close`/`delete`/`cancel` | 对应 quiescent teardown / sessionQuery 删除 | cancel 后回合以 `cancelled` 结束 |

### 3.2 prompt 入口与内容

- 单飞（同一会话并发 prompt 拒绝）；文本/图片准入：
  `contentForPrompt`（文本块先过 **skill 归一化**：`/skill:<name>` → 裸
  `/name` 手势——因为 dsh `tool-skill` pre-step 只认裸 `/kebab-name`，归一后
  才会装载 skill 正文）、`scanPrompt`、`encodedImages`（附件落盘 + 识图能力
  门控）。
- **resource 块优雅降级**（`resourceText`，pi-acp 同款）：客户端忽略
  `embeddedContext:false` 通告硬塞 `resource` 块时不炸——text resource 的正文
  以 `[embedded context <uri> (<mime>)]` 折叠拼进相邻文本段；blob/未知 payload
  只留标记不倾倒解码字节；纯 resource 提示也算非空。audio 仍是唯一硬拒绝。
- 斜杠行（以 `/` 开头的整行）→ dsh 命令平面；未知命令回退为普通用户文本。
- 进入模型：`agent.followup`；取消走 agent cancel。

### 3.3 流式与回合结束

- `session/event` 监听：`assistant/chunk`（text/reasoning delta）按
  (turn,step,index) 折叠增量 → `agent_message_chunk` / `agent_thought_chunk`
  （只发新尾缀，杜绝重复）；提交块 `assistant/message` 只补缺失尾段。
- 回合结束按 `codec.ts` 表映射 stopReason（completed/aborted/blocked/error →
  `end_turn`，interrupted → `cancelled`，max-tokens → `max_tokens`）；
  **error 结尾不平账为 stopReason**，而是把在途 `session/prompt` 以 internal
  error 拒绝（`settledStopReason`）。
- `usage_update` 源：`sessionProjections.snapshot().values.contextPressure`。

### 3.4 工具卡片

- `tool/call` → `session_update: tool_call`（toolCallId/kind/status/title/
  name/rawInput/**locations**）；`tool/result` → `tool_call_update`
  （completed/failed + content ≤8000 字符截断 / **diff 卡**，见下）。
- 分类 `toolKindFor`：bash/pwsh→execute、write/edit/str_replace…→edit、
  read/read_image→read、search 系→search、rm/delete 系→delete、其余 other。
- **标题自解释**（`tool-cards.ts`）：Zed 1.18 把 execute 类
  当终端卡渲染，头部唯一可见文本是 `title`，且隐藏 rawInput
  （`should_show_raw_input = !is_terminal_tool && …`）；external ACP agent 没
  有真实 Zed terminal，故 `title` = 原样命令（trim、400 字符截断 + `…`），呈
  现原生 "Run Command" 卡。title 是每种卡片的 primary text（其余类型的参数
  只在 raw-input 展开里），故：路径类工具（read/read_image/write/edit/
  str_replace_editor/rm）标题 = `工具名 + 显示路径`（绝对路径在 cwd 下时显示
  为 cwd 相对；live/replay 语义一致）；search 类 = `工具名 + pattern`
  （` in <path>` 作用域可选，与宿主自身搜索卡同款）；其余（todo_write、
  ask_user_question…）与解析不出参数的调用保持裸工具名。
- **follow-along locations**（`toolCallLocation`，pi-acp 惯例）：工具参数里的
  `file_path`/`path` 按 cwd 绝对化后进 `tool_call.locations`，Zed 便随卡片实
  时高亮/跳转 agent 正在触碰的文件。行号按参数形状推断：`read` 的 `offset`、
  str_replace_editor 的 `view_range` 首行 / `insert` 的 `insert_line+1`、
  edit/str_replace 的 `old_string` 在**当前文件**中唯一匹配到的行（工具执行
  前同步读一次，pi-acp 同款；读不到/重复匹配只丢行号不丢路径）。不带文件参
  数的工具（bash/grep/todo…）不发 locations。
- **结构化 diff 卡**（`diffForToolCall` + `toolCallDiffContent`）：ACP
  `ToolCallContent {type:'diff'}` 让客户端渲染真正的 diff 视图而非 8KB 截断
  文本。来源两档：① 持久 `tool/result` 的 `meta.diffs`——dsh-tool-fs 的
  write/edit 本就把"应用后的上下文 hunk"投影进 meta；② 参数自描述——
  str_replace_editor 不产 meta，其 `old_str→new_str` / `create` 的
  `file_text` 即 diff；write 创建新文件时 meta 为空数组，同样回落到整文件新
  建 diff。失败/非变更调用不发 diff；确认文本仍随 diff 一起发，不支持 diff
  的客户端降级为纯文本卡。
- `ask_user_question` 的调用记录到 `askCall`（按会话），其结果→elicitation。
- live 与 replay（§4）共用同一批纯函数，卡片逐字节一致（replay 不做行号推
  断——文件早已变化，只发路径；call↔result 的 diff 配对在 replay 侧用
  callId map 重建）。

### 3.5 plan / 斜杠目录 / skills / 会话选项 / 权限

- **plan**：`todo/write` 整体替换 → `plan` 更新；`turn/start` 清空（曾显示过
  才发空表）。replay 折叠历史到最终一张 plan。
- **斜杠目录**（`available_commands_update`）：Zed 1.18 对 external ACP
  agent **只认 available_commands**（客户端 skill 不进 `/` 菜单，也没有 agent
  侧的 Commands/Skills/Actions 分组），故目录 = dsh 命令平面（`ctx.commands`）
  + **user-invocable skills**（`ctx.skills`，cwd=会话 cwd、scope=agent；根：
  `~/.agents/skills`、`$DSH_HOME/skills`、工程 `.agents/skills`/`.dsh/skills`）。
  命名沿用 pi-acp 惯例：skill 通告为 `skill:<name>`（弹窗 `/skill:find-skills`），
  命令保持原名；命令块 + skill 块分区、各自保序、命令赢同名。变更经
  `skills/change` / `commands/change` 实时重通告。
- **skill 执行**：prompt 文本归一化 `/skill:<name>` → `/name`（§3.2），进入
  dsh tool-skill pre-step 展开（与 dsh Web "/" 选 skill 同路径，非命令平面）。
- **configOptions**：Model / Thought Level / Write permission 三个 select，
  数据源 `ctx.llm.listProviders/listModels/resolveModelInfo` +
  `ctx.permissionPresets.resolve/optionOf/set`；`permission` 写会话授权档
  （read-only / workspace-write / danger-full-access）。
- **权限**：`approval/request`（带 callId 的桥内请求）→ ACP
  `session/request_permission`（allow-once / reject-once 两个选项），结果映射
  `allowed-once` / `rejected` / `cancelled`；外来或无 callId 的请求 next()
  放行给宿主。
- **elicitation**：`ctx.userQuestions.registerProvider` + 表单
  `createElicitation`（绑定 session/tool_call_id），客户端声明
  `elicitation.form` 才启用。
- **认证**：`authenticate`（env `DEEPSEEK_API_KEY` 或 dsh Web 凭据），缺 key
  返回 `AUTH_REQUIRED` + sign-in 方法。

### 3.6 能力纪律与边界

先实现、后声明；未实现一律**不悬空声明**：session fork、terminal/fs 执行委托
（工具仍在 dsh 沙箱内跑）、`additionalDirectories`、audio/embeddedContext、
Windows。`embeddedContext` 虽不声明（embedded resource 不是一等 prompt 输
入），但 `resource` 块会**优雅降级**为纯文本继续跑（§3.2），而非拒绝整个
prompt。diff 卡片与 locations 属于 `tool_call`/`tool_call_update` 的可选字
段，无需能力声明（§3.4）。MCP：非空 `mcpServers` → `invalidParams`（如实
拒绝，本轮不做）。

## 4. 会话历史与回放（durable history）

- 数据源：`ctx.sessionQuery`（listSessions / readSession events）+ 
  `ctx.sessions.flush` 在 close/dispose 时落盘。
- **load = resume + 回放**：只回放提交且模型可见的事实——
  `user/message` 中 `source: 'user'` 的直发提问以 `user_message_chunk`
  回放（带 messageId 供客户端分块合并；注入上下文/goal 轮/compaction
  checkpoint 等合成 user 角色事件不回放）、
  `assistant/message` 文本/思考块整体流出、`tool/call`+`tool/result` 卡片复现
  （同 live 纯函数，含 locations 路径与 meta/参数来源的 diff 卡；行号推断回
  放不做）、图片降级为 `[image: …]` 占位、todo 历史折叠为**一张**
  最终 plan；原始 delta / usage / 私有呈现数据不进回放。
- `session/resume` **不回放**（SDK 语义）。

## 5. 设计决策记录

| 项 | 决策 |
|---|---|
| 交付形态 | dsh bundle 插件（private，`dsh.bundle.patch`）；非独立 server，非 npm/ACP Registry 发布 |
| 安装（本地） | `dsh plugin --profile acp add <目录>`（pnpm `link:`，改后 `pnpm build` 即生效） |
| 安装（远程） | `dsh plugin --profile acp add https://github.com/dangpangch/dsh-acp.git`（HTTPS，纯拉取；升级 = remove + add） |
| 分发 | `lib/` 预构建产物入库提交：远程安装无 build 脚本，绕开 pnpm 11 `allowBuilds` 拦截；profile 只装运行时依赖（dsh-base 等由 CLI shipped root 提供） |
| Zed 接入 | Custom Agent：`agent_servers` 里 `command: "dsh"`（npm -g 全局安装进 PATH）、`args: ["--profile", "acp"]` |
| 组合 | dsh-base + preset `standard`（agent setup 内 mount）+ bridge 行（provider deepseek-official / model deepseek-v4-flash，会话可切） |
| stdout/EOF | 仅 JSON-RPC；`conn.closed` → quiesce → `appExit(0)` |
| 会话历史 | load=resume+回放提交事实；resume=不回放；delete 后 resume → invalidParams |
| 斜杠目录 | 命令平面 + user-invocable skills；`skill:<name>` 命名、分区保序、变更实时重通告（见 §3.5） |
| skill 执行 | prompt 归一 `/skill:<name>`→`/name`，tool-skill pre-step 装载（见 §3.2） |
| 工具卡标题 | execute 卡 title = 具体命令行；路径卡 = 工具名+显示路径；search 卡 = 工具名+pattern（见 §3.4） |
| follow-along | `tool_call.locations`：file_path/path 绝对化 + 行号推断（read offset / view_range / insert+1 / old_string 唯一匹配，见 §3.4） |
| diff 卡片 | `tool_call_update` 结构化 diff：优先持久 meta.diffs（write/edit hunk），回落参数自描述（str_replace_editor / 新建文件，见 §3.4） |
| resource 块 | 不声明 embeddedContext，但优雅降级为纯文本（pi-acp 同款，见 §3.2） |
| elicitation | userQuestions provider + createElicitation（client capability 门控） |
| 权限档 | config option `permission`（permissionPresets.set） |
| MCP | 本轮不做：非空 mcpServers → invalidParams |
| 能力纪律 | 先实现、后声明（list/load/delete/resume 随实现同步开启） |

## 6. 验证与验收

### 6.1 离线验证

```bash
pnpm typecheck && pnpm build          # tsc --noEmit；tsdown -> lib/
pnpm test                             # vitest（104 项；含真实 spawn 的帧纯净与会话历史探针）
node scripts/history-probe.mjs        # 会话历史端到端（隔离 DSH_HOME）
# dev boot smoke（隔离 DSH_HOME）
printf '…initialize…\n…session/new…' | node lib/dev-bin.js   # 2 result + exit 0
# CLI profile smoke（隔离 DSH_HOME）
DSH_HOME=$(mktemp -d) dsh plugin --profile acp add https://github.com/dangpangch/dsh-acp.git
printf '…' | DSH_HOME=$DSH_HOME dsh --profile acp            # 2 result + exit 0
```

### 6.2 真实 Zed 验收清单

> 依赖真实模型 key；排障看 `dev: Open Acp Logs` 与服务端 stderr（stdout 不应
> 有非协议输出）。

1. Custom Agent 线程建立，文本/思考流式可见；
2. 沙箱权限：写工程内成功、写工程外被拦并弹 Allow once / Reject once；
3. 工具卡片：标题自解释（execute 卡显示具体命令行；read/glob/edit 卡显示工
   具名 + 路径/pattern），有输出/退出码；
4. follow-along：read/edit 卡片让 Zed 实时高亮 agent 正在看的文件（含行
   号）；编辑卡片渲染真正的 diff 视图（非截断文本）；
5. 长回答增量流式；
6. 齿轮菜单切换 Model / Thought Level / Write permission 且下回合生效；
7. `/` 菜单：命令 + `/skill:find-skills` 式 skill 条目，选中即装载执行；
8. 关闭线程后从 recent threads 恢复（resume/load），上下文连贯（回放卡片与
   live 逐字节一致，diff 卡复现）；
9. ask 表单可作答；
10. 取消长任务 → 回合 cancelled、无残留子进程；
11. 缺 key → Authenticate 引导，配好即恢复；
12. 诊断：Acp Logs 有 JSON-RPC 记录、stderr 无协议帧泄漏。

### 6.3 诊断约束速记

| 现象 | 处置 |
|---|---|
| stdout 出现非 JSON 行 | 违反不变量 → 报告（launcher 不应写 stdout） |
| 进程秒退 | 看 stderr（多为组合/预设问题）；`dsh --profile acp </dev/null` 应 exit 0 |
| 工具卡只有工具名、没有命令 | 旧构建：`pnpm build` 后重启线程（execute 卡标题=命令） |
| 工具卡不带文件定位/没有 diff 视图 | 旧构建：`pnpm build` 后重启线程（locations/diff 卡随 §3.4 新增） |
| `/` 无 skill | skill 需 user-invocable 且位于 dsh 扫描根；装/删后本会话实时刷新 |
| `/skill:名` 不生效 | 看是否出现 `Load skill …` 工具卡（归一化→pre-step 装载路径） |

## 7. 布局

```
src/bridge/index.ts     插件入口：AgentSideConnection + 会话生命周期 + 事件映射
src/bridge/catalog.ts   斜杠目录合并（命令平面 + user-invocable skills；纯函数）
src/bridge/replay.ts    持久历史 → ACP 回放帧（纯函数）
src/bridge/tool-cards.ts 卡片分类/rawInput/标题/locations/diff（标题自解释：execute=命令、路径类=工具名+路径、search=pattern；纯函数）
src/bridge/{codec,updates,content,config-options,session-store}.ts  纯映射/builder 模块（§3）
src/dev-bin.ts          独立 dev/test boot（dsh-base + 本包 patch + presets fixture）
cordis.patch.yml        bundle 补丁（§2.1）
scripts/history-probe.mjs  会话历史端到端探针
```
