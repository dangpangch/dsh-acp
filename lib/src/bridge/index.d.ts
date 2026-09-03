import Schema from "@deepseek-ai/schemastery";
import { Stream } from "@agentclientprotocol/sdk";
import { Context } from "@deepseek-ai/cordis";
//#region src/bridge/index.d.ts
/** Stable cordis plugin name (design.zh.md §5). */
declare const name = "dsh-acp-interactive";
/** Agent spine services this bridge programs (validated on the rc.2 baseline). */
declare const inject: string[];
/** Deployment route defaults; per-session config options may override. */
interface BridgeConfig {
  provider?: string;
  model?: string;
  /** Runtime-only transport override; production uses stdio. */
  stream?: Stream;
}
declare const Config: Schema<BridgeConfig>;
/**
 * Apply the bridge. On a serving invocation the app already published
 * readiness (stdin is ours); open the AgentSideConnection over stdin/stdout
 * and route session/* to per-session agent records.
 */
declare function apply(ctx: Context, config?: BridgeConfig): void;
//#endregion
export { BridgeConfig, Config, apply, inject, name };