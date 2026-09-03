import { createServer } from "node:http";
import { Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
//#region lib/types/injections.js
/**
* Structured index injections: the typed rows plugins contribute to the boot
* HTML instead of raw `tapIndex` string transforms. Rows are pure
* JSON-serializable data because one table feeds two renderers: the served
* form renders rows into the index.html text ({@link renderIndexInjections}),
* and a static worker deployment ships the same rows over its boot payload
* for a page-side interpreter. Anything not expressible as a row stays on
* `tapIndex`, which runs after row rendering.
*/
/** Escape a row value before placing it in a quoted HTML attribute. */
function escapeHtmlAttribute(value) {
	return value.replaceAll("&", "&amp;").replaceAll("\"", "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function assertNever(row) {
	throw new Error(`webserver: unknown index injection row ${JSON.stringify(row)}`);
}
/** Render one row to markup with its placement. */
function renderRow(row) {
	switch (row.kind) {
		case "global": return {
			placement: "head",
			markup: `<script>globalThis[${JSON.stringify(row.name).replaceAll("<", "\\u003c")}] = ${row.value === void 0 ? "undefined" : JSON.stringify(row.value).replaceAll("<", "\\u003c")}<\/script>`
		};
		case "script": return {
			placement: row.placement,
			markup: `<script>${row.text}<\/script>`
		};
		case "script-src": return {
			placement: row.placement,
			markup: `<script src="${escapeHtmlAttribute(row.src)}"><\/script>`
		};
		case "style": return {
			placement: "head",
			markup: `<style>${row.text}</style>`
		};
		case "html": return {
			placement: row.placement,
			markup: row.html
		};
		default: return assertNever(row);
	}
}
/** Insert `markup` into `html` at `at`. */
function splice(html, at, markup) {
	return `${html.slice(0, at)}${markup}${html.slice(at)}`;
}
/**
* Render rows into an index.html body: head rows immediately after the
* opening head tag, body rows immediately after the opening body tag, each
* group in table order.
* @param html - the raw index.html body.
* @param rows - the collected injection table.
* @returns the html with every row rendered.
*/
function renderIndexInjections(html, rows) {
	let head = "";
	let body = "";
	for (const row of rows) {
		const rendered = renderRow(row);
		if (rendered.placement === "head") head += rendered.markup;
		else body += rendered.markup;
	}
	let out = html;
	if (head !== "") {
		const open = /<head(?:\s[^>]*)?>/i.exec(out);
		out = open === null ? `${head}${out}` : splice(out, open.index + open[0].length, head);
	}
	if (body !== "") {
		const open = /<body(?:\s[^>]*)?>/i.exec(out);
		out = open === null ? `${out}${body}` : splice(out, open.index + open[0].length, body);
	}
	return out;
}
//#endregion
//#region lib/types/index.js
/**
* @deepseek-ai/dsh-host-webserver — Web route-registration plugin: a node:http
* server plus the `webServer` service (HTTP and upgrade route registries, the
* structured index injection table with raw transform taps behind it, and the
* single fallback seat for everything no route claims). Knows no harness concepts and serves no files; the composing
* application's frontend plugin owns dist serving through the fallback hook.
* Web shape only — Electron loads dist over file:// and carries fetch over an
* IPC bridge. This package never prints: the URL line belongs to the shell.
*/
/**
* The browser HTTP carrier service. Activation listens immediately. Route
* registration order does not affect requests because configured named routes
* must be distinct, and the fallback handler answers anything not yet claimed
* during startup with 404 until its owner registers. A listen failure rejects
* initialization, and the boot process reports the failed fiber.
*/
var WebServer = class extends Service {
	config;
	static Config = z.object({
		host: z.union([z.const("127.0.0.1"), z.const("0.0.0.0")]).required(),
		port: z.natural().max(65535).required()
	});
	exact = /* @__PURE__ */ new Map();
	prefixes = /* @__PURE__ */ new Map();
	upgrades = /* @__PURE__ */ new Map();
	upgradedSockets = /* @__PURE__ */ new Set();
	indexTaps = [];
	fallback;
	server;
	listenedPort;
	constructor(ctx, config) {
		super(ctx, "webServer");
		this.config = config;
	}
	/** The listening port (the OS-assigned value when config.port is 0). */
	get port() {
		return this.listenedPort;
	}
	/** The configured bind host (the loopback or all-interfaces literal). */
	get host() {
		return this.config.host;
	}
	/**
	* Register a named route. Duplicate (kind, path) throws — route patterns are
	* a composition-level contract, so a collision is a misconfiguration.
	* @param route - kind, path, and the owning handler.
	* @returns the disposer removing the route.
	*/
	register(route) {
		const table = route.kind === "exact" ? this.exact : this.prefixes;
		if (table.has(route.path)) throw new Error(`webserver: duplicate ${route.kind} route "${route.path}"`);
		table.set(route.path, route);
		return () => {
			table.delete(route.path);
		};
	}
	/**
	* Register an exact-path HTTP upgrade route. Duplicate paths throw because
	* one socket can have only one protocol owner.
	* @param route - pathname and handler owning negotiation plus socket use.
	* @returns the disposer removing the route.
	*/
	registerUpgrade(route) {
		if (this.upgrades.has(route.path)) throw new Error(`webserver: duplicate upgrade route "${route.path}"`);
		this.upgrades.set(route.path, route);
		return () => {
			this.upgrades.delete(route.path);
		};
	}
	/**
	* Claim the fallback seat: the handler answering every request no named
	* route matches (the SPA dist server in the shipped Web composition). One
	* owner only — a second registration throws, because two fallbacks cannot
	* compose.
	* @param handler - owns the full response lifecycle of unmatched requests.
	* @returns the disposer releasing the seat.
	*/
	registerFallback(handler) {
		if (this.fallback !== void 0) throw new Error("webserver: fallback already registered");
		this.fallback = handler;
		return () => {
			this.fallback = void 0;
		};
	}
	/**
	* Register a raw-HTML index transform, the escape hatch for markup no
	* {@link IndexInjection} row expresses: {@link renderIndex} applies taps in
	* registration order after rendering the structured rows.
	* @param transform - pure html-to-html function.
	* @returns the disposer removing the transform.
	*/
	tapIndex(transform) {
		this.indexTaps.push(transform);
		return () => {
			const at = this.indexTaps.indexOf(transform);
			if (at !== -1) this.indexTaps.splice(at, 1);
		};
	}
	/** Listen; resolves once the socket is bound (rejection = FAILED fiber). */
	async [Service.init]() {
		const handle = async (req, res) => {
			/* v8 ignore next -- `?? '/'` arm: node:http always sets url on server
			requests; the field is only optional on the client-side IncomingMessage type */
			const rawPath = new URL(req.url ?? "/", "http://x").pathname;
			const route = this.match(rawPath);
			if (route !== void 0) {
				await route.handler(req, res);
				return;
			}
			const fallback = this.fallback;
			if (fallback === void 0) {
				res.writeHead(404);
				res.end();
				return;
			}
			await fallback(req, res);
		};
		this.server = createServer((req, res) => {
			handle(req, res).catch((err) => {
				this.ctx.logger.warn(err instanceof Error ? err : new Error(String(err)));
				if (res.headersSent) {
					res.destroy();
					return;
				}
				res.writeHead(400);
				res.end();
			});
		});
		this.server.on("upgrade", (req, socket, head) => {
			const onError = (error) => {
				this.ctx.logger.warn(error);
				socket.destroy();
			};
			socket.on("error", onError);
			socket.once("close", () => {
				socket.off("error", onError);
				this.upgradedSockets.delete(socket);
			});
			let route;
			try {
				/* v8 ignore next -- node:http always sets url on server requests. */
				route = this.upgrades.get(new URL(req.url ?? "/", "http://x").pathname);
			} catch (error) {
				this.ctx.logger.warn(error instanceof Error ? error : new Error(String(error)));
				socket.destroy();
				return;
			}
			if (route === void 0) {
				socket.destroy();
				return;
			}
			this.upgradedSockets.add(socket);
			try {
				Promise.resolve(route.handler(req, socket, head)).catch((error) => {
					this.ctx.logger.warn(error instanceof Error ? error : new Error(String(error)));
					socket.destroy();
				});
			} catch (error) {
				this.ctx.logger.warn(error instanceof Error ? error : new Error(String(error)));
				socket.destroy();
			}
		});
		await new Promise((resolve, reject) => {
			this.server.once("error", reject);
			this.server.listen(this.config.port, this.config.host, () => {
				this.server.off("error", reject);
				this.server.on("error", (err) => {
					this.ctx.logger.error(err);
				});
				this.listenedPort = this.server.address().port;
				resolve();
			});
		});
		this.ctx.effect(() => async () => {
			const serverClosed = new Promise((resolve) => {
				this.server.close(() => {
					resolve();
				});
			});
			this.server.closeAllConnections();
			const upgradedClosed = [...this.upgradedSockets].map((socket) => new Promise((resolve) => {
				socket.once("close", () => {
					resolve();
				});
				socket.destroy();
			}));
			await Promise.all([serverClosed, ...upgradedClosed]);
		}, "webServer.listen");
	}
	/** Longest-prefix-wins over the prefix table after an exact-table miss. */
	match(pathname) {
		const exact = this.exact.get(pathname);
		if (exact !== void 0) return exact;
		let best;
		for (const [prefix, route] of this.prefixes) {
			if (pathname !== prefix && !pathname.startsWith(`${prefix}/`)) continue;
			if (best === void 0 || prefix.length > best.path.length) best = route;
		}
		return best;
	}
	/**
	* Run an index.html body through the registered taps in registration order
	* — called by the fallback owner on every index response it renders.
	* @param html - the raw index.html body.
	* @returns the transformed body.
	*/
	applyIndexTaps(html) {
		let out = html;
		for (const transform of this.indexTaps) out = transform(out);
		return out;
	}
	/**
	* Gather the structured injection table: one `webserver/index-inject` emit,
	* every subscriber pushes its current rows. Fresh per call, so subscribers
	* read live state (module graph, theme preference) at emit time.
	* @returns rows in subscriber activation order.
	*/
	collectIndexInjections() {
		const table = [];
		this.ctx.emit("webserver/index-inject", table);
		return table;
	}
	/**
	* Render one index.html body: the structured injection table first, then
	* the raw `tapIndex` transforms over the result.
	* @param html - the raw index.html body.
	* @returns the transformed body.
	*/
	renderIndex(html) {
		return this.applyIndexTaps(renderIndexInjections(html, this.collectIndexInjections()));
	}
};
//#endregion
export { WebServer, WebServer as default, renderIndexInjections };
