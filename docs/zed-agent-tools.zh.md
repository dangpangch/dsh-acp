# dsh-acp-v1 × Zed agent tools 对照审计

- **审查对象**: `dsh-acp-v1` 0.4.0（宿主侧 bundle 插件：把 DSH 经 ACP v1 / stdio 暴露给
  Zed Agent Panel）
- **审查问题**: 本插件对 **Zed 的 agent tools**（Zed 内置工具清单）是否提供了支持
- **审查时点**: 2026-09-15（Zed 文档抓取日；下文所有 Zed 侧断言均出自该日抓取的 zed main 文档）
- **基线**: Zed 文档 [Tools](https://zed.dev/docs/ai/tools)、
  [Tool Permissions](https://zed.dev/docs/ai/tool-permissions)、
  [External Agents](https://zed.dev/docs/ai/external-agents)、
  [MCP](https://zed.dev/docs/ai/mcp)；ACP SDK `1.4.0`（随仓库钉住的 schema 快照）；
  dsh cohort `0.1.5-rc.1`（**报告时点**；2026-10-01 走廊已迁至 `0.2.0-rc.2`，standard
  挂载面变为 26 个工具——0.2.0 的 standard 声明里 `tool-ralph` 为 `disabled: true`，
  见 `docs/compat-audit-0.2.0-rc.2.zh.md`）；standard preset 挂载面 golden `scripts/standard-mounts.json`；
  仓库既有的 Zed 1.18 呈现假设（`docs/design.zh.md:120,163`、`README.zh.md`）
- **结论**: **不支持**，且不是遗漏而是既有决策（`docs/design.zh.md` §3.6）。
  Zed 内置工具是 Zed 原生 agent 私有能力，ACP 没有任何"调用客户端工具"的方法；
  外部 agent 能拿到的客户端执行面只有 `fs/read_text_file`、`fs/write_text_file`、
  `terminal/*`（外加 `session/request_permission`、`elicitation/create`），而这三样
  本桥刻意未接。dsh 以**自己的等价工具**覆盖了 16 项中的 10 项，5 项只能经 `bash`
  绕行，1 项（`diagnostics`）在任何通道上都不可达。

## 1. 结论摘要（TL;DR）

1. **Zed 工具不可直接调用**：ACP v1（SDK 1.4.0）中客户端（Zed）对外提供的方法里，
   与"执行工具"有关的只有 `fs/read_text_file`、`fs/write_text_file`、`terminal/create`、
   `terminal/output`、`terminal/wait_for_exit`、`terminal/kill`、`terminal/release`。
   `diagnostics`（LSP）、`grep`、`find_path`、`list_directory`、`copy_path`、
   `create_directory`、`delete_path`、`move_path`、`fetch`、`search_web`、`skill`、
   `spawn_agent` **没有任何 ACP 通道**，外部 agent 无法触发 Zed 的原生实现。
2. **dsh 侧等价覆盖 10/16**：`read_file→read`、`edit_file→edit`、`write_file→write`、
   `terminal→bash`（Windows `pwsh`）、`grep→grep`、`find_path→glob`、
   `fetch→web_fetch`、`search_web→web_search`、`skill→skill`、
   `spawn_agent→subagent`/`subagent_fork`。
   5 项（`list_directory`、`copy_path`、`create_directory`、`delete_path`、`move_path`）
   没有一等工具，只能经 `bash`（`ls`/`cp`/`mkdir`/`rm`/`mv`）或 `glob` 表达；
   `diagnostics` 完全没有对应能力。
3. **唯一"用上 Zed 那批实现"的通道是客户端委托（未接）**：`fs/*` 与 `terminal/*` 就是
   Zed 给外部 agent 的那两个执行面（编辑进 Zed 的 Edited Files、命令进 Zed 集成终端与
   Zed 权限面），本仓库在 `docs/design.zh.md` §3.6 明确未实现，全仓库无调用点
   （§2.2 证据），因此现状是"Zed 工具 0 项直接可用、dsh 等价能力 10 项等价 +
   5 项 bash 绕行 + 1 项不可达"。
4. **权限面不同**：Zed 的 `agent.tool_permissions` 只管 Zed 原生 agent（键为
   `terminal`/`edit_file`/`write_file`/`delete_path`/`move_path`/`copy_path`/
   `create_directory`/`fetch`/`search_web`/`skill`、`mcp:<server>:<tool>`）；本桥的工具
   由 dsh 的沙箱 + 审批栈门控，再映射成 ACP `session/request_permission`
   （allow-once / allow-always / reject-once）。

## 2. 事实基线

### 2.1 Zed 内置工具（16 个）

来源 [Zed Tools 文档](https://zed.dev/docs/ai/tools)（2026-09-15 抓取）。该文档自述
"exact tool list can vary by Agent Profile, selected model provider, and Zed version"，
故下列清单是**时点快照**，不是对所有 Zed 版本成立的事实；权限键来自
[Tool Permissions](https://zed.dev/docs/ai/tool-permissions)。

| 类别 | 工具 | 语义（文档摘要） | 权限键 |
|---|---|---|---|
| 读/搜 | `diagnostics` | 单文件或全工程的错误/警告（LSP），编辑后自检 | 无（只读） |
| 读/搜 | `fetch` | 抓 URL → Markdown | `fetch` |
| 读/搜 | `find_path` | glob 模式找文件路径 | 无（只读） |
| 读/搜 | `grep` | 工程内正则搜内容 | 无（只读） |
| 读/搜 | `list_directory` | 列目录内容 | 无（只读） |
| 读/搜 | `read_file` | 读文件内容 | 无（只读） |
| Web | `search_web` | 联网搜索（**仅 Zed Pro / Zed provider**） | `search_web` |
| 编辑 | `copy_path` | 递归复制文件/目录 | `copy_path` |
| 编辑 | `create_directory` | `mkdir -p` | `create_directory` |
| 编辑 | `delete_path` | 递归删除并确认 | `delete_path` |
| 编辑 | `edit_file` | 文本替换式编辑 | `edit_file` |
| 编辑 | `move_path` | 移动/重命名 | `move_path` |
| 编辑 | `write_file` | 新建或整文件覆盖 | `write_file` |
| 编辑 | `terminal` | 执行 shell 命令并返回输出 | `terminal` |
| 其他 | `skill` | 装载某个 Skill 的 `SKILL.md` | `skill` |
| 其他 | `spawn_agent` | 起一个同工具集的子 agent | 无（Profile 开关） |

### 2.2 ACP v1 客户端面（SDK 1.4.0）与本桥实际使用

按 schema 的 `x-side: "client"` 逐方法枚举（`node_modules/@agentclientprotocol/sdk/schema/schema.json`）：

| 客户端方法 | 能力门 | 本桥是否使用 | 证据 |
|---|---|---|---|
| `fs/read_text_file` | `clientCapabilities.fs.readTextFile` | **否** | 全仓库无 `readTextFile(` 调用点（`grep -rn "readTextFile" src/` = 0） |
| `fs/write_text_file` | `clientCapabilities.fs.writeTextFile` | **否** | 同上（`writeTextFile` = 0） |
| `terminal/create` `output` `wait_for_exit` `kill` `release` | `clientCapabilities.terminal` | **否** | 全仓库无 `createTerminal(` 调用点 |
| `session/request_permission` | 无（基线） | 是 | `src/bridge/index.ts`（审批映射，design §3.5） |
| `elicitation/create` | `clientCapabilities.elicitation.form` | 是 | `src/bridge/index.ts:303,317,1323`（只读 `elicitation.form`） |
| `elicitation/complete`（通知） | `clientCapabilities.elicitation.url` | 否 | 无生产者，全仓库无 `completeElicitation` 调用点 |
| `session/update`（通知） | 无（基线） | 是 | 全部会话帧 |
| `mcp/connect` `mcp/message` `mcp/disconnect`（**UNSTABLE**） | `mcpCapabilities.acp` | 否 | `initialize` 未声明 `mcpCapabilities`（`src/bridge/index.ts:1334`）；`session/new` 的 `mcpServers` 接受但忽略（`src/bridge/index.ts:1159`） |

补充：`document/didOpen|didChange|didFocus|didSave|didClose` 在 schema 中是
**客户端→agent 的通知**（`x-side: "agent"`），不属于"工具"，本桥也没有处理器（§6）。

`scripts/conformance.mjs:132` 虽然在 `initialize` 里声明了
`fs: { readTextFile: true, writeTextFile: true }`，但只是模拟真实 Zed 的请求形状——
探针从不期待桥发起 `fs/*` 请求（客户端方法校验表只覆盖
`session/request_permission` 与 `elicitation/create`）。

### 2.3 dsh-acp 实际工具面（standard preset，0.2.0-rc.2 走廊 26 个）

来源 `scripts/standard-mounts.json`（0.2.0-rc.2 走廊 golden；报告时点 0.1.5-rc.1 为
27 个，含 `ralph`）：

```
ask_user_question  bash  create_goal  edit  exit_plan_mode  get_goal  glob  grep
interrupt_agent  job_kill  job_list  job_output  list_agents  present  read
read_image  send_message  skill  subagent  subagent_fork  todo_write  update_goal
web_fetch  web_search  workflow  write
```

- Windows 上 `bash` 由 `pwsh` 取代（本包 `presets/standard.patch.yml` 的平台门控；
  0.2.0 起 preset 声明随本 bundle 分发，不再来自 `@deepseek-ai/dsh-agent-presets`）。
- 该 golden 只覆盖 `standard` preset；`minimal`/`ptc`/`cordis` 未基线化，本审计不逐项断言。
- dsh 侧实现面（0.1.5-rc.1；0.2.0 包名/行号漂移见迁移报告）：`edit`/`read`/`read_image`/`write` 来自
  `@deepseek-ai/dsh-tool-fs`，`glob`/`grep` 来自 `@deepseek-ai/dsh-tool-fs-search`，
  `bash` 来自 `@deepseek-ai/dsh-tool-bash`；`ctx.fs` 服务只提供
  `resolve/stat/lstat/readText/streamText/readBytes/readByteRange/listDir/writeText/editText`，
  **没有** copy/move/mkdir/delete 的一等 API（delete/move/copy 类操作在 dsh 里走 shell）。

## 3. 逐项对照

"ACP 可达性"列指：外部 agent 能否经 ACP 触发 Zed 侧**同类**实现（而非调用同名工具）。

| Zed 工具 | dsh-acp 等价物 | ACP 可达性 | 判定 | 备注 |
|---|---|---|---|---|
| `read_file` | `read`（+ `read_image`） | 读取有 `fs/read_text_file`（未接） | 等价 | ACP 只有整文件读 + `line`/`limit`，无 Zed 的 LSP 语义 |
| `edit_file` | `edit` | 无（写只有整文件 `fs/write_text_file`，未接） | 等价 | ACP 无 patch/替换类方法 |
| `write_file` | `write` | `fs/write_text_file`（未接） | 等价 | 同上 |
| `terminal` | `bash`（Windows `pwsh`）+ `job_list`/`job_output`/`job_kill` | `terminal/*`（未接） | 等价 | 执行环境与权限面不同：dsh 跑在自己的 sandbox/审批层，且另有后台任务工具 |
| `grep` | `grep` | 无 | 等价 | |
| `find_path` | `glob` | 无 | 等价 | |
| `fetch` | `web_fetch` | 无 | 等价 | dsh 侧为公共 HTTP(S) 抓取；Zed 侧不受终端沙箱约束但受 `fetch` 权限/工程信任约束 |
| `search_web` | `web_search` | 无 | 等价（有前提） | dsh-base 默认挂 DeepSeek 搜索 provider（`DEEPSEEK_API_KEY`）；Zed 的 `search_web` 仅 Zed Pro/Zed provider |
| `skill` | `skill` | 无 | 等价 | dsh 从 `~/.agents/skills`、工程根装载；user-invocable skill 另在 `/` 目录通告 |
| `spawn_agent` | `subagent`、`subagent_fork`（+ `send_message`/`interrupt_agent`/`list_agents`） | 无 | 等价 | dsh 侧可改子 agent 模型路由、支持后台/持续子 agent |
| `list_directory` | 无一等工具（`glob` / `bash ls`） | 无 | 缺一等工具 | dsh fs 服务有 `listDir` 但没有暴露成模型面工具 |
| `create_directory` | 无一等工具（`bash mkdir`） | 无 | 缺一等工具 | |
| `copy_path` | 无一等工具（`bash cp`） | 无 | 缺一等工具 | |
| `move_path` | 无一等工具（`bash mv`） | 无 | 缺一等工具 | |
| `delete_path` | 无一等工具（`bash rm`） | 无 | 缺一等工具 | dsh 卡片仍会把 delete 类调用标成 `delete` kind（`tool-cards.ts`） |
| `diagnostics` | **无** | 无 | **不可达** | dsh 无 LSP 面；ACP 也没有诊断类方法 |

反向（dsh 超出 Zed 清单 16 项的部分）：`ask_user_question`、`todo_write`、
goal 组（`create_goal`/`get_goal`/`update_goal`/`exit_plan_mode`）、
`job_list`/`job_output`/`job_kill`、`workflow`、`ralph`、`present`、`read_image`。

## 4. 呈现与权限面差异（只描述，不改动）

| 维度 | Zed 原生工具 | dsh-acp 现状 |
|---|---|---|
| 审批 | `agent.tool_permissions`（`allow`/`confirm`/`deny` + 正则 allow/deny/confirm，含内建 `rm -rf /` 级硬规则） | dsh sandbox/policy + `approval/request` → ACP `session/request_permission`（allow-once / allow-always / reject-once，`docs/design.zh.md` §3.5） |
| 编辑可见性 | 工具直接写 Zed buffer，进 "Edited Files" 审查区（accept/reject） | dsh fs 工具带结构化 diff 卡 + `tool_call.locations`（design §3.4）；**`bash` 里改的文件不进 Zed 的改动文件审查**（`docs/model-config.zh.md` §5 第 5 条） |
| 终端 | 每次调用起一个 shell，输出回卡；可被 `terminal` 权限规则按命令逐个匹配 | `bash` 在 dsh 沙箱内执行，输出经卡片展示（execute 卡已 read 化，design §3.4）；客户端内从不执行任何命令（`README.zh.md`「明确不做」） |
| 工具清单来源 | Agent Profile（`agent.profiles.*.tools`） | 预设（`standard`/`minimal`/`ptc`/`cordis`）+ 会话选项 `preset`（空白会话可切） |

## 5. 建议（只读结论）

1. **`diagnostics`（唯一真正的能力缺口）**：ACP 没有诊断通道，dsh 也没有 LSP 客户端。
   可行路径只有两条：
   - 让模型用 `bash` 跑项目自带检查（typecheck/test/lint）——现状即可，无需改动；
   - 经 MCP 装一个提供诊断/代码理解的服务器——但本桥当前**接受并忽略**
     `session/new.mcpServers`（`src/bridge/index.ts:1159`，P1-6），要走这条路必须先做
     MCP 挂载支持，属另一项工作。
2. **5 个文件管理工具（`list_directory`/`copy_path`/`create_directory`/`delete_path`/`move_path`）**：
   dsh 侧以 `glob` + `bash` 覆盖；若要一等工具，需要新增模型面工具与承载它的预设
   （预设拥有模型面，见 `AGENTS.md` 不变量）。本审计只登记为备选，不建议在没有明确
   需求时新增——这些操作在 dsh 现有工具面下已可表达。
3. **若要真正"用上 Zed 的工具"**：唯一通道是 `fs/*` + `terminal/*` 客户端委托
   （即 `docs/design.zh.md` §3.6 明确不做的那一项）。其收益是 Edited Files 审查、
   Zed 集成终端、Zed 权限面；代价是命令离开 dsh 沙箱/审批层、必须随客户端能力声明
   动态门控、且 ACP 只覆盖整文件读写（copy/move/mkdir/delete 仍然没有通道）。
   是否反转该安全决策需单独确认，不在本次范围。
4. **文档层面**：本报告即为"Zed 工具是否被支持"的持久答案；Zed 工具清单随版本漂移时，
   按 §7 的方法重新抓取并更新第 3 节表格，而不是从记忆里改。

## 6. 相邻发现（未实测，不作为结论）

ACP schema 里存在 `document/didOpen|didChange|didFocus|didSave|didClose`
（`x-side: "agent"`，即客户端把编辑器里的打开/改动/聚焦/保存/关闭事件推给 agent）。
本桥没有这些方法的处理器（`grep -rn "document/did" src/` = 0）。Zed 是否真的发送、
1.18 是否包含、发送频率与体积如何，**均未实测**；本节仅记录通道存在，不构成缺口或承诺。

## 7. 复核方法（可重演）

```bash
# 1) 桥是否使用客户端工具面（期望：src/ 下 0 命中）
grep -rn "readTextFile\|writeTextFile\|createTerminal" src/
# 2) 桥读取了哪些客户端能力（期望：只有 elicitation）
grep -rn "clientCapabilities" src/bridge/index.ts
# 3) dsh 侧实际挂载面（0.2.0-rc.2 走廊期望：26 个工具 / 5 条 slash）
cat scripts/standard-mounts.json
# 4) ACP 客户端方法清单（schema 的 x-side: client）
python3 - <<'PY'
import json
d=json.load(open('node_modules/@agentclientprotocol/sdk/schema/schema.json'))
for n,v in d['$defs'].items():
    if isinstance(v,dict) and v.get('x-side')=='client':
        print(v.get('x-method'))
PY
```

Zed 侧重新抓取：`https://zed.dev/docs/ai/tools`、`/ai/tool-permissions`、
`/ai/external-agents`、`/ai/mcp`（Zed 文档未标版本号，需记录抓取日期）。

## 8. 与既有决策的关系

本审计的结论不是新缺口，而是既有决策的复核：

- `docs/design.zh.md` §3.6「能力纪律」：`terminal/fs 执行委托`（工具仍在 dsh 沙箱内跑）
  属**未实现且不悬空声明**的项；MCP 非空 `mcpServers` 接受并忽略（P1-6）。
- `docs/model-config.zh.md` §5 第 5 条「终端/文件系统委派未接」：Zed 客户端支持 PTY
  终端与 project buffers，但 dsh 工具在 agent 运行时内自行执行，桥只观察 session 事件，
  没有工具执行缝。
- `README.zh.md`「明确不做」：命令只在 dsh 沙箱/审批层执行，客户端内从不执行任何东西。

因此：**Zed agent tools 不支持是刻意的边界，不是回归**；本文把它固化成可逐项复核的
对照表，供后续"是否要做客户端委托 / 是否要支持 MCP 挂载 / 是否要补文件管理工具"的
决策引用。
