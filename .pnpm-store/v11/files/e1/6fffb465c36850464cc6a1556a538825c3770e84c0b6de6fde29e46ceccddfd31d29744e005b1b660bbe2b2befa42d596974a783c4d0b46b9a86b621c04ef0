/** Browser caller for generic Connection unary RPC channels. */
import type { ClientConnectionRpc } from '../rpc.ts';
/** Transport this caller posts through; same signature as the global `fetch`. */
export type RpcFetch = (input: URL, init: RequestInit) => Promise<Response>;
/**
 * Create the browser-backed generic RPC caller.
 * @param doFetch - transport override; defaults to the page's global fetch.
 * @returns caller that owns request correlation and response-envelope validation.
 */
export declare function createWebConnectionRpc(doFetch?: RpcFetch): ClientConnectionRpc;
//# sourceMappingURL=rpc.d.ts.map