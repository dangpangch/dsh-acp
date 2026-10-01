import { a as boot, i as rootEntriesPath, n as devOverlayOps, o as installFailLoud, r as ownPatchOps, t as basePatchOps } from "./dev-boot-BldKnWAl.js";
//#region src/dev-bin.ts
const NAME = "dsh-acp-v1-dev";
installFailLoud(NAME);
let app;
let disposed = false;
process.stdout.on("error", () => {
	try {
		process.exit(0);
	} catch {}
});
async function disposeOnce() {
	if (disposed) return;
	disposed = true;
	await app?.fiber?.dispose();
}
let stdinEnded = false;
const stdinEndExits = () => {
	setTimeout(() => {
		disposeOnce().then(() => process.exit(0));
	}, 400);
};
process.stdin.on("end", () => {
	stdinEnded = true;
	stdinEndExits();
});
const patches = [
	...basePatchOps(NAME),
	...ownPatchOps(NAME),
	...devOverlayOps(NAME)
];
app = await boot(NAME, rootEntriesPath(NAME), patches);
if (stdinEnded) stdinEndExits();
process.on("SIGINT", () => void disposeOnce().then(() => process.exit(0)));
process.on("SIGTERM", () => void disposeOnce().then(() => process.exit(0)));
process.stdin.resume();
//#endregion
export {};
