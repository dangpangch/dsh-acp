# dsh-acp-v1 模型与模型选项配置报告

调查 dsh-acp-v1 中与"模型"和"模型选项"（configOptions）有关的全部配置面、
数据流与边界状态。所有结论都经过源码核对或无头复现验证（2026-09-06，sdk 1.4.0 /
dsh 0.1.2-rc.1 基线）。行号以当前工作区为准，后续提交可能漂移。

配套文档：整体映射见 `docs/design.zh.md`（§3.5 configOptions、§3.6 能力纪律）；
本报告只深挖模型/选项这一条线。

## 1. 总览：一条模型从配置到下拉框的路径

```
部署侧配置                      运行时目录（dsh-llm）                桥（dsh-acp-v1）                        Zed
────────────────────────       ─────────────────────────           ─────────────────────────────        ──────────────
cordis.patch.yml 桥行    ──┐    llm-deepseek 适配器                ctx.llm.listProviders()        session/new
  provider/model          │      (settings.yaml `llm-deepseek:`)      ctx.llm.listModels(id)    ──▶  configOptions
                          ├──▶  llm-pi-ai 适配器                      ctx.llm.resolveModelInfo()      (模型/思考/权限 select)
settings.yaml 各节        │      (settings.yaml `llm-pi-ai.providers`)         │
  llm-deepseek:           │            │ 严格校验(INVALID_CATALOG…)             ├─ set_config_option
  llm-pi-ai:              │            └ llm/adapters-updated ──────────┐     │    → ModelSelectionRef 变更
  agent-default-model:    │                                            ▼     │    → model/selection 事件(持久化)
                          │                                       config_option_update
                          │                                        (全量替换推送)
                          └─ agent-default-model 行：对 ACP 会话不生效（见 §2.3）
session/load → lastModelSelection(events) → 恢复上次模型/思考档
```

## 2. 配置源（部署侧）

### 2.1 桥默认路由：唯一的 ACP 会话起点

- `BridgeConfig { provider?, model? }`（`src/bridge/index.ts:113`），由 bundle patch 的
  桥行供值：`cordis.patch.yml:46-50` shipped 默认 `deepseek-official/deepseek-v4-flash`。
- `routeDefaults()（`src/bridge/index.ts:684`）`（`src/bridge/index.ts`）把这两个值同时用于两处：
  1. `agentOptions { provider, model }` 传给 `agents.create()/resume()`；
  2. 会话级 `ModelSelectionRef`（`installModelSelection`）——prompt 组装时以该 ref
     的当前值为准（dsh-agent："Prompt assembly snapshots the selected model"）。
- **推论**：改 ACP 会话的默认模型必须改桥行（或用户 profile patch 覆盖，见 §6.1），
  改 dsh 的默认模型设置对 ACP 会话无效（见 §2.3）。

### 2.2 模型目录：dsh-llm 适配器

目录成员由 dsh-base 注册的适配器决定（`dsh-base/cordis.patch.yml:492-499, 100-108`）：

| 适配器 | 激活条件 | settings 节 |
|---|---|---|
| `llm-deepseek` | 常驻 | `llm-deepseek:` |
| `llm-pi-ai` | 休眠：settings 供出 `providers` profile 后激活，零 profile = 零路由 | `llm-pi-ai:` |

目录成员资格是**建议性的**（dsh-llm："an adapter may accept unlisted model ids"）——
选择器列表 ≠ 路由白名单；`resolveModel` 对未列 id 也能解析（deepseek 适配器直接
合成元数据，`dsh-llm-deepseek/lib/index.js:1563`）。

**deepseek 侧（`llm-deepseek:` settings 节）**：

- `apiKeyEnv`（默认 `DEEPSEEK_API_KEY`）、`baseURL`、`maxTokens`、`defaultContextWindow`、
  `models[]`（可覆盖内置目录：id/name/description/contextWindow/maxTokens/inputModalities）。
- `thinking: "enabled" | "disabled"`（部署级开关）与 `reasoningEffort: off|low|high|max`
  （部署默认档）。
- **reasoning 元数据是合成的**（`dsh-llm-deepseek/lib/index.js:1563-1585`）：
  - `thinking: "disabled"` → 仅 `off` 一档（`defaultEffort: off`）；
  - 否则恒为 `off/low/high/max` 四档，`defaultEffort` 取 settings 的 `reasoningEffort`
    （`off→off、low→low、max→max，其余→high`）。
- 请求期白名单 `reasoningEffort()`（`:26-29`）：非法值抛
  `UNSUPPORTED_REASONING_EFFORT`——这是"模型真实支持什么"的最终裁决。

**pi-ai 侧（`llm-pi-ai.providers.<id>` profile，`dsh-llm-pi-ai/lib/index.js:940-975`）**：

每个 provider profile 可配：`apiKeyEnv`、`displayName`、`api`（线协议）、`baseURL`、
`headers`、`models[]`、`modelOverrides`、`compat`（20+ 开关）、`defaultContextWindow/
defaultMaxTokens/defaultInput`、`thinkingBudgets`、`cacheRetention`、`transport`、
超时与重试策略等。单模型条目（`modelFields`，`:921-930`）：

```yaml
llm-pi-ai:
  providers:
    tokenrouter:
      apiKeyEnv: TOKENROUTER_API_KEY
      api: openai-completions
      baseURL: https://api.tokenrouter.com/v1
      models:
        - id: z-ai/glm-5.3-free          # id 可含斜杠（OpenRouter 风格）
          name: glm-5.3
          contextWindow: 128000
          input: [text]                  # text|image
          reasoningEfforts:              # 思考档声明（缺省=无思考控制）
            off: null                    # off 留空 = 支持、不发参数
            low: low                     # 其余键=线上参数拼写；未列的级别=不支持
            high: high
          compat: { … }                  # 每协议 quirk 开关
```

- `reasoningEfforts` 解析（`:543-546, 549-570`）：**未声明** → 借用安装目录同 id 条目
  的能力，借不到 = `reasoning: false`（无思考控制）；`false` → 显式无思考；声明 dict →
  pi 的 7 级词表（`off/minimal/low/medium/high/xhigh/max`，`:291`）全部显式钉死，
  未列级别一律不可用。
- level 词表是 pi 的 7 级；**dsh-acp-v1 的 canonical 兜底表与其同词表**。

### 2.3 `agent-default-model` 行：对 ACP 会话不生效（重要）

dsh-base 注册 `agent-default-model` 行（`dsh-base/cordis.patch.yml:74-79`），settings
的 `agent-default-model:` 节供值。其语义是"**没有会话级选择的 Agent** 的默认模型"
（`dsh-agent-default-model/lib/types/index.d.ts:2`）。而桥对每个 ACP 会话都安装自己的
`ModelSelectionRef`（§2.1），所以：

> 用户在 dsh Web 设置里改"默认模型"**不会**改变新 ACP 会话的路由——ACP 会话永远
> 从桥行配置出发。这是"Zed 显示的模型与实际运行模型错位"现象的深层根源（§5.2）。

### 2.4 subagent 模型选择

`cordis.patch.yml:37-40` 挂了 Host-scope 的 `subagent-model-selection-settings` seat
（shipped `standard` 预设在 base-only profile 上需要它）。桥自身不暴露 subagent 模型
的选择 UI——subagent 跟随各自预设/宿主行为。

## 3. 桥内管线：目录 → configOptions

### 3.1 读取缝隙

`LlmCatalogService`（`src/bridge/index.ts:229-240`）：`listProviders()` /
`listModels(providerId)` / `resolveModelInfo(provider, model)`。llm 服务缺席时整条
模型线降级（无 model/thought select）。

### 3.2 dsh-llm 校验规则（决定选择器里"有什么"）

- `listModels` 严格校验：模型必须携带与路由一致的 `provider` 字段、非空 id/name，
  否则整个路由抛 `INVALID_CATALOG`（`dsh-llm/lib/index.js:1471-1487`）——**缺 provider
  字段的模型根本进不了 picker**（wire-probe stub 曾踩过）。
- `resolveModelInfo` 的 reasoning 语义（`:1499-1546`）：适配器返回 `reasoning` 缺席 =
  该模型无思考控制；返回**空 efforts = 抛错**（`INVALID_MODEL_REASONING`）。因此桥
  看到的三态是干净的：有档位 / 无思考控制 / 查询失败。

### 3.3 三个 select 的构建（`refreshConfigOptions`，`src/bridge/index.ts:722-796`）

| select（id / category） | 数据源 | 消失条件 |
|---|---|---|
| `model` / `model` | 目录平铺为 `provider/model` 复合 id（`config-options.ts:147-172`） | 目录零模型（返回 null）或会话无路由 |
| `thought_level` / `thought_level` | `resolveModelInfo().reasoning`（§3.4 三态） | resolved-but-effortless（`offered.length === 0`） |
| `permission` / `permission` | 三个写权限预设 | `permissionPresets` 缝隙缺席 |

- 复合 id 按**第一个 `/`** 分割 provider/model，OpenRouter 式带斜杠 id
  （`tokenrouter/z-ai/glm-5.3-free`）安全。
- **stale-route 回退**：currentValue 只能取目录里存在的项，否则回落第一项
  （`config-options.ts:162-170`）——选择器永不指向不存在的条目。
- 逐提供方 `listModels` 失败：warn + 该提供方静默掉出 picker；**部分失败不阻塞会话**。

### 3.4 thought_level 三态（2026-09-06 修复后的最终语义）

| reasoning 元数据状态 | supportedEfforts | 选择器 | 依据 |
|---|---|---|---|
| 有档位（声明 N 档） | 那 N 档 | 展示声明的档位；模型有 `defaultEffort` 时无 `provider-default` 项，currentValue=默认档 | 模型元数据 |
| 已解析、零档位（如 pi-ai 模型未声明 `reasoningEfforts`） | **空集** | **整个 select 隐藏** | 空集下任何选择都会在请求前被剥离，展示兜底表=广告不存在的档位（用户报告的 bug） |
| 查询失败（真未知） | undefined（保留选择） | canonical 7 档 + `provider-default` | 未知≠不支持，选择保留、由 harness 请求期裁决 |

- `provider-default` 是**仅展示**的 id（`PROVIDER_DEFAULT_REASONING_EFFORT`，
  `config-options.ts:12`）：选中它 = 剥离显式 effort，回到提供方默认。
- current 永不默认到 `off`（`currentEffortFor`，design §6.3）。
- 请求前守卫 `guardReasoningEffort`（`config-options.ts:100-107`）：空集剥一切、未知集
  保留——双保险，防止旧选择流进请求组装。
- **失效选择自愈**（2026-09-06 补）：守卫剥离改为经 `setSelection` 持久化——旧构建或
  目录变更遗留的 `model/selection` 快照在重载/刷新时被修正回写，不会随重载复活；
  thought_level 下拉 currentValue 经 `thoughtLevelCurrentFor` 校验，只取 offered 内的
  档位，否则回退 `defaultEffort` / `provider-default`（镜像 model 下拉的 stale-route
  规则，`config-options.ts:164-170`）。

### 3.5 空目录 → AUTH_REQUIRED

`session/new` 前置探测 `catalogAvailability`（`config-options.ts:189`）：所有提供
方都应答且零模型（确证为空）→ `RequestError.authRequired`（data 带 authMethods）；
任一查询失败不算数（不阻塞）。对齐 pi-acp 的"空目录=未认证"语义，让 Zed 出
Authenticate 横幅而不是开出空 picker 的会话。

## 4. 运行时切换与持久化

- **切换**：`session/set_config_option`（`src/bridge/index.ts`）→ `applyConfigOption`：
  - `model`：解析复合 id → `setSelection`；**切换模型清除已选 effort**（新模型的
    提供方默认接管）。
  - `thought_level`：对当前模型的 offered 表校验，`provider-default` = 剥离 effort；
    零档位模型上任何值 → invalidParams（§3.4）。
  - 每次调用返回**全量**刷新后的 configOptions。
- **生效时机**：切换只改 `ModelSelectionRef` 并追加 `model/selection` 事件到会话日志；
  "下一次 turn/step"生效（prompt 组装在委派前快照选择）。
- **持久化/恢复**：`model/selection` 是桥独写的日志事件（`selection-event.d.ts`，
  在 harness 运行时持久化白名单内）；`session/load|resume` 在构建 configOptions **前**
  取 `lastModelSelection(events)` 恢复路由+档位（`session-store.ts:171`，commit
  414c880e，pi-acp 的"会话是唯一事实源"模式）。旧会话无快照 → 保持桥默认。
- **目录热更新**：订阅 `llm/adapters-updated`（dsh-llm 在每次注册/replace 时发布）→
  对每个在线会话重建 configOptions 并以 `session/update` 的 `config_option_update`
  变体推送——**全量替换快照，非增量**（`updates.ts` `configOptionsUpdate`）。
  重建失败只 warn（保留旧下拉）；replay 中/已关闭的会话跳过。
- **标题实时推送**：`session/title` 日志事件（dsh-session-title 服务在用户重命名/
  provider 生成时写入）→ `session_info_update` 推送（`updates.ts` `sessionInfoUpdate`），
  客户端会话列表实时显示标题；load/resume 后用 `lastSessionTitle` 补推一次持久化
  标题（firehose 不回放历史事件），按 record 去重。
- **权限 allow-always**：`session/request_permission` 提供三选项
  （allow-once / allow-always / reject-once）。dsh 审批词表是一次性的，allow-always
  由桥记录在会话级 tool allowlist，后续同工具请求自动应答 `allowed-once`（内存态，
  重载后重问）。
- **image 能力**：`promptCapabilities.image` 是连接级声明，按**默认路由**的
  `inputModalities` 判定（`supportsImages`，`src/bridge/index.ts`）——中途切到支持
  图像的模型不会（也无法，ACP v1 语义）动态打开。已知取舍。

## 5. 客户端（Zed）交互事实

### 5.1 configOptions 是唯一选择器面

Zed 在 `configOptions` 存在时忽略 `models`/`modes`（`config-options.ts:6-9` 记录的
quirk），所以全部选择器必须是 config option；v1 SDK 的 `NewSessionResponse` 也没有
`models` 字段（pi-acp 双广告的做法不适用于 v1）。

### 5.2 `default_config_options` 是 Zed 侧显示预置，不发请求

Zed 的 `agent_servers.<id>.default_config_options`（如 `{"model":
"tokenrouter/z-ai/glm-5.3-free", "thought_level": "low"}`）会在新会话 UI 里**直接显示
为已选项**。实测证据（2026-09-06，会话 `4157d4b6`/`4fa6a71c`）：会话日志只有一个
session 头、零个 `model/selection` 事件——即桥从未收到任何 `set_config_option`。

由此产生一个**显示错位**：Zed 显示"tokenrouter 已选"，而桥上新会话实际当前模型仍是
桥行默认（deepseek），thought 选项也是 deepseek 的档位——"tokenrouter 的思考等级
怎么是 off/low/high/max"。这不是桥的 bug；桥一旦收到模型切换就会返回正确快照。

### 5.3 对齐方法

- **推荐**：profile patch 覆盖桥路由到用户真正的默认模型（§6.1），使桥的 currentValue
  与 Zed 预置一致；
- 或删掉/改掉 Zed 的 `default_config_options.model` 预置；
- 注意：留着 `thought_level` 预置且当前模型无可控档位时，Zed 真正发送该预置会被桥
  invalidParams 拒绝（§3.4 语义）。

## 6. 用户配置手册

### 6.1 改 ACP 会话默认模型/提供方

`~/.dsh/profiles/acp/cordis.patch.yml`（用户 patch 层，空数组 → 加条目）：

```yaml
- id: dsh-acp-v1
  config:
    provider: tokenrouter          # 必须是已注册的适配器路由（settings 激活的 pi-ai profile id）
    model: z-ai/glm-5.3-free       # 适配器可解析的 model id（可含斜杠）
```

改完重启 agent server（`lib/` 为预构建产物，profile 以 link 方式引用本仓库时
`pnpm build` 后重启即可）。

### 6.2 deepseek 部署开关

```yaml
llm-deepseek:
  thinking: disabled        # → 思考下拉只剩 Off（元数据由适配器合成）
  reasoningEffort: low      # → 关闭思考时非法；开启时作为 defaultEffort（off/low/high/max）
  models:                   # 可选：覆盖目录（名称/上下文/模态）
    - { id: deepseek-v4-flash, name: DeepSeek-V4-Flash, contextWindow: 128000, maxTokens: 8192 }
```

### 6.3 给 pi-ai 模型恢复思考下拉

模型未声明 `reasoningEfforts` 时下拉整体隐藏（§3.4）。要恢复，在 profile 的模型条目
声明**真实可控**的档位（拼写按该端点的 `reasoning_effort` 取值）：

```yaml
llm-pi-ai:
  providers:
    tokenrouter:
      models:
        - id: z-ai/glm-5.3-free
          reasoningEfforts: { off: null, low: low, high: high }
```

### 6.4 常见错误对照

| 信号 | 含义 | 处置 |
|---|---|---|
| `INVALID_CATALOG`（warn: model catalog for X failed） | 适配器目录条目缺 `provider` 等字段 | 修适配器/目录数据；该提供方掉出 picker |
| 模型下拉里根本没有某模型 | 路由未激活（pi-ai 无 profile）或目录校验失败 | 补 `llm-pi-ai.providers` 节 |
| thought_level 下拉消失 | 当前模型已解析但零可控档位（§3.4）——诚实行为 | 用 §6.3 声明档位 |
| 选了思考档但行为没变 | 旧会话/旧构建下的兜底表选择被空集剥离 | 重启到新构建；重载时该选择会被持久化自愈（§3.4） |
| Zed 弹 Authenticate | 目录确证为空（所有提供方零模型） | 配 key / 激活提供方 |
| Zed 显示的模型与实际不符 | `default_config_options` 只是显示预置（§5.2） | §5.3 对齐 |

## 7. 边界与已知取舍

1. **目录是建议性的**：适配器可接受未列 id；选择器列表不构成路由白名单，也不做
   请求期校验（校验在适配器/harness）。
2. **部分提供方失败静默掉线**：单提供方 `listModels` 失败只 warn，不阻塞会话创建
   （只有"确证全空"才 AUTH_REQUIRED）。picker 可能暂时缺一个提供方而无提示。
3. **image 能力按默认路由**（连接级，§4）。
4. **Zed 预置不回传**：`default_config_options` 是客户端状态（§5.2），桥无法感知
   Zed 显示的"已选模型"与实际路由的偏差。
5. **终端/文件系统委派未接**（`terminal/*`、`fs/readTextFile`/`fs/writeTextFile`）：
   Zed 客户端支持（PTY 终端、project buffers），但 dsh 的工具在 agent 运行时内
   自行执行，桥只观察 session 事件（tool/call → tool/result），无工具执行缝——
   接入需要上游 harness 提供 bash 可插拔 executor / 预工具 hook。bash 里改的文件
   因此不会出现在 Zed 的改动文件审查里（fs 工具带结构化 diff，会）。
6. **未实现的其余客户端面**：`logout`（env-key 认证无可登出物，未广告）、URL
   elicitation（无生产者）、`compaction_*`（UNSTABLE 且需客户端广告能力）、
   `setSessionMode`/`current_mode_update`（v1 以 configOptions 取代 modes）、
   `extMethod`/`extNotification`（Zed 亦未实现）。
7. **additionalDirectories 硬拒实际不可达**：Zed 仅在代理广告
   `session_capabilities.additional_directories` 时才发非空值，桥未广告（§2.1）。
   保留诚实报错作为防御。
5. **pi-acp 对比中明确不采纳**：`models` 字段双广告（v1 无此字段）、terminal auth、
   会话内切换写全局默认（dsh-acp-v1 严格 per-session）。
