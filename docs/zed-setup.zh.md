# 安装与验收手册（docs/zed-setup.zh.md）

## 1. 前提

- dsh CLI 已安装（本机 `dsh --version` = 0.1.1-rc.2）。
- pnpm 可用（`dsh plugin` 转发到 pnpm）。
- DeepSeek API key 已配置：`DEEPSEEK_API_KEY` 环境变量，或在 dsh web
  （Models 设置，写入 `~/.dsh/.credentials.yaml`）中配置过。

## 2. 安装（本机已验证）

```bash
# 1) 把本仓库装成 dsh profile `acp` 的 bundle（第一次会创建 profile）
dsh plugin --profile acp add /home/pang/ws/harness/dsh-acp

# 2) 冒烟（可选）：stdout 必须只有 JSON-RPC，EOF 后 exit 0
printf '%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":1,"clientCapabilities":{}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"session/new","params":{"cwd":"/tmp","mcpServers":[]}}' |
  dsh --profile acp
```

修改本仓库代码后 `pnpm build` 即生效（profile 以 `link:` 引用本目录）。

## 3. Zed 配置（Custom Agent）

Zed `settings.json` 添加（见 `examples/zed-custom-agent.json`）：

```json
"agent_servers": {
  "DeepSeek Harness (acp)": {
    "type": "custom",
    "command": "/home/pang/.local/share/fnm/node-versions/v24.18.0/installation/bin/dsh",
    "args": ["--profile", "acp"]
  }
}
```

在 Agent Panel 新建线程时选择该 server。注意：**从终端启动 Zed**（或把
command 换成绝对路径），否则 GUI 启动的 Zed 看不到 fnm/nvm 的 PATH。

## 4. 真实 Zed 验收清单（用户执行）

> 依赖真实模型 key。全部通过 = 本里程碑完成。排障看 `dev: Open Acp Logs`
> 与服务端 stderr（服务端 stdout 不应有任何非协议输出）。

- [ ] 1. Custom Agent 路径：Agent Panel 新线程 → 模型答复正常（文本流式可见）。
- [ ] 2. 沙箱与权限：让 agent 写工程内文件成功；写工程外文件被拦，弹
      Allow once / Reject once 可应答。
- [ ] 3. 工具卡片：让 agent 跑 bash 与编辑文件 → 卡片含命令/输出/退出码。
- [ ] 4. 流式：长回答文本增量可见；思考流式可见（若模型启用）。
- [ ] 5. 会话选项：线程齿轮菜单能切 Model / Thought Level / Write permission；
      下一回合生效。
- [ ] 6. 斜杠技能：`/` 菜单列出命令 + **已安装的 user-invocable skill**
      （`~/.agents/skills` 全局、工程 `.agents/skills`/`.dsh/skills` 局部均出现）；
      命名沿用 pi-acp 惯例：skill 以 `/skill:find-skills` 形式出现在列表，
      命令保持原名（`/permission`、`/compact` 等），按“命令块 + skill 块”分区
      （Zed 1.18 无 agent 侧 Commands/Skills/Actions 分组）；
      `/permission`/`/compact` 等命令可执行，选一个 skill（如 `/skill:find-skills`）
      回车 → agent 装载该 skill 指令并按其行事。
- [ ] 7. 会话历史（Zed ≥ v0.225）：关闭线程后从 recent threads 恢复 →
      `session/resume`（或 load）后继续对话，上下文连贯。
- [ ] 8. ask 表单：agent 触发提问时（若有模型行为触发）出现表单可作答。
- [ ] 9. 取消：长任务取消 → 回合以 cancelled 结束、无残留子进程。
- [ ] 10. 认证：无 key 时 agent 报 Authenticate（sign-in 指引），配置后恢复。
- [ ] 11. 诊断：`dev: Open Acp Logs` 有 JSON-RPC 记录；服务端 stderr 无协议帧泄漏。

## 5. 排障速查

| 现象 | 处置 |
|---|---|
| 进程秒退、无输出 | 看 stderr：多为组合/预设问题；`dsh --profile acp </dev/null` 应 exit 0 |
| 模型调用报无 key | env 或 dsh web Models 配置 key 后重试 |
| GUI Zed 找不到 dsh | command 用绝对路径（见 examples） |
| stdout 出现非 JSON 行 | 违反不变量 → 报告（launcher 不应写 stdout） |
| 会话历史不出现 | 需同 cwd（工作区）且会话已 close（flush）过 |
| `/` 菜单没有 skill | skill 需 user-invocable 且位于 dsh 扫描根：`~/.agents/skills`、`$DSH_HOME/skills`、工程 `.agents/skills` / `.dsh/skills`；装入/移除后本会话实时刷新，新会话必刷 |
| `/skill:名` 回车后不生效 | 观察工具卡是否出现 `Load skill …`（bridge 把 `/skill:名` 归一为 `/名` 后由 dsh tool-skill pre-step 装载）；stderr 有 skill 相关告警则贴出 |
