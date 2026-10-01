import { LoadHookContext } from "node:module";
import { dshHomePath } from "@deepseek-ai/dsh-home-paths";
import { Context, Fiber, Inject, Service } from "@deepseek-ai/cordis";
//#region node_modules/.pnpm/@deepseek-ai+cosmokit@1.8.5/node_modules/@deepseek-ai/cosmokit/lib/types/misc.d.ts
/** String/symbol keyed dictionary type. */
type Dict<T = any, K extends string | symbol = string> = { [key in K]: T; };
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.5_@deepseek-ai+cordis@4.0.4_node-addon-require-builtin@0.1.7/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/internal.d.ts
/** Node internal module format names handled by loader hooks. */
type ModuleFormat = 'builtin' | 'commonjs' | 'json' | 'module' | 'wasm';
/** Source payload accepted by Node internal module load hooks. */
type ModuleSource = string | ArrayBuffer;
/** Result returned by a Node internal resolve hook. */
interface ResolveResult {
  format: ModuleFormat;
  url: string;
}
/** Result returned by a Node internal load hook. */
interface LoadResult {
  format: ModuleFormat;
  source?: ModuleSource;
}
type LoadCacheData = ModuleJob;
/** @see https://github.com/nodejs/node/blob/main/lib/internal/modules/esm/module_map.js */
interface LoadCache extends Omit<Map<string, Dict<LoadCacheData>>, 'get' | 'set' | 'has'> {
  get(url: string, type?: string): LoadCacheData | undefined;
  set(url: string, type?: string, job?: LoadCacheData): this;
  has(url: string, type?: string): boolean;
}
/** Minimal Node internal ModuleWrap surface used by HMR helpers. */
interface ModuleWrap {
  url: string;
  getNamespace(): any;
}
/** @see https://github.com/nodejs/node/blob/main/lib/internal/modules/esm/module_job.js */
interface ModuleJob {
  url: string;
  loader: ModuleLoader;
  module?: ModuleWrap;
  importAttributes: ImportAttributes;
  linked: Promise<ModuleJob[]>;
  instantiate(): Promise<void>;
  run(): Promise<{
    module: ModuleWrap;
  }>;
}
/**
 * Node 22/23 ModuleLoader interface.
 *
 * Key methods:
 * - getModuleJobForImport(specifier, parentURL, importAttributes)
 * - resolve(specifier, parentURL, importAttributes) → Promise<ResolveResult>
 * - resolveSync(specifier, parentURL, importAttributes) → ResolveResult
 */
interface ModuleLoaderV1 {
  version: 'v1';
  loadCache: LoadCache;
  import(specifier: string, parentURL: string, importAttributes: ImportAttributes): Promise<any>;
  register(specifier: string | URL, parentURL?: string | URL, data?: any, transferList?: any[]): void;
  getModuleJobForImport(specifier: string, parentURL: string, importAttributes: ImportAttributes): Promise<ModuleJob>;
  resolve(specifier: string, parentURL: string, importAttributes: ImportAttributes): Promise<ResolveResult>;
  resolveSync(specifier: string, parentURL: string, importAttributes: ImportAttributes): ResolveResult;
  load(specifier: string, context: Pick<LoadHookContext, 'format' | 'importAttributes'>): Promise<LoadResult>;
}
/** Node 24+ module request object. */
interface ModuleRequest {
  specifier: string;
  attributes?: ImportAttributes;
  phase?: ModulePhase;
}
/** @see https://github.com/nodejs/node/blob/main/src/module_wrap.h */
declare const enum ModulePhase {
  Source = 1,
  Evaluation = 2
}
/** Opaque Node internal module request type marker. */
type ModuleRequestType = unknown;
/**
 * Node 24+ ModuleLoader interface.
 *
 * Breaking changes from v1:
 * - getModuleJobForImport removed → getOrCreateModuleJob(parentURL, request, requestType)
 * - resolve removed (became private #resolve) → resolveSync(parentURL, request)
 * - Parameter order reversed for resolveSync, request object { specifier, attributes }
 * - LoadCache became typed Map<url, { [type]: ModuleJob }> with delete only setting undefined
 */
interface ModuleLoaderV2 {
  version: 'v2';
  loadCache: LoadCache;
  import(specifier: string, parentURL: string, importAttributes: ImportAttributes, phase?: ModulePhase, isEntryPoint?: boolean): Promise<any>;
  register(specifier: string | URL, parentURL?: string | URL, data?: any, transferList?: any[], isInternal?: boolean): void;
  getOrCreateModuleJob(parentURL: string, request: ModuleRequest, requestType?: ModuleRequestType): Promise<ModuleJob>;
  resolveSync(parentURL: string, request: ModuleRequest): ResolveResult;
  load(url: string, context: Pick<LoadHookContext, 'format' | 'importAttributes'>): Promise<LoadResult>;
}
/** Supported Node internal ESM loader shapes. */
type ModuleLoader = ModuleLoaderV1 | ModuleLoaderV2;
/** Helpers for locating the current Node internal module loader. */
declare namespace ModuleLoader {
  /**
   * Locate and classify the running Node internal module loader.
   *
   * The shape is decided by which module-job API the loader owns, never by the
   * Node version: v2 landed in 24.12.0, so a major-version test mistags every
   * 24.0–24.11.1 loader as v2 and makes consumers call `resolveSync` with
   * reversed parameters. Arity is not usable either — `resolveSync` reports 2
   * under both shapes. A loader owning neither API is left unclassified rather
   * than guessed, so consumers take their documented no-internals path.
   * @returns the classified loader, or `undefined` when none is reachable or its shape is unknown.
   */
  function fromInternal(): ModuleLoader | undefined;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.5_@deepseek-ai+cordis@4.0.4_node-addon-require-builtin@0.1.7/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/config/tree.d.ts
/** Mutable tree of loader entries. Persistence is supplied by subclasses. */
declare abstract class EntryTree {
  static readonly sep = ":";
  ctx: Context;
  enableLogs?: boolean;
  root: EntryGroup;
  store: Dict<Entry>;
  constructor(ctx: Context);
  get context(): Context;
  /** Iterate entries in this tree and any nested subtrees. */
  entries(): Generator<Entry, void, void>;
  /** Return pending import and lifecycle tasks owned by this tree. */
  getTasks(): Promise<void>[];
  /** Wait until this tree has no pending import or lifecycle tasks. */
  await(): Promise<void>;
  ensureId(options: Partial<EntryOptions>): string;
  /** Resolve an entry by id, including nested ids separated by `EntryTree.sep`. */
  resolve(id: string): Entry;
  resolveGroup(id: string | null): EntryGroup;
  /** Create an entry in the root group or a nested group. */
  create(options: Omit<EntryOptions, 'id'>, parent?: string | null, position?: number): Promise<string>;
  /** Stop and remove an entry from its parent group. */
  remove(id: string): void;
  /** Update an entry and optionally move it to another group. */
  update(id: string, options: Omit<EntryOptions, 'id' | 'name'>, parent?: string | null, position?: number): Promise<void>;
  /** Import a plugin module from a specifier or `cordis:` builtin. */
  import(name: string, getOuterStack?: () => string[]): any;
  /** Persist current tree state. In-memory trees may implement this as a no-op. */
  abstract write(): void;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.5_@deepseek-ai+cordis@4.0.4_node-addon-require-builtin@0.1.7/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/config/group.d.ts
/** Runtime owner for a list of child loader entries. */
declare class EntryGroup {
  ctx: Context;
  tree: EntryTree;
  static readonly key: unique symbol;
  data: EntryOptions[];
  constructor(ctx: Context, tree: EntryTree);
  get context(): Context;
  create(options: Omit<EntryOptions, 'id'>): Promise<string>;
  unlink(options: EntryOptions): void;
  remove(id: string, isDispose?: boolean): void;
  update(config: EntryOptions[]): Promise<void>;
  stop(): void;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.5_@deepseek-ai+cordis@4.0.4_node-addon-require-builtin@0.1.7/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/config/entry.d.ts
/** Serialized plugin entry options stored in loader config files. */
interface EntryOptions {
  /** Stable id inside the containing entry tree. */
  id: string;
  /** Module specifier imported by the entry tree. */
  name: string;
  /** Config passed to the plugin. */
  config?: any;
  /** Marks this entry as a nested group. */
  group?: boolean | null;
  /** Prevents this entry and descendants from running. */
  disabled?: boolean | null;
  /** Required services or service intercept config for this entry. */
  inject?: Inject | null;
}
/** One configured plugin node inside an `EntryTree`. */
declare class Entry {
  loader: Loader;
  static readonly key: unique symbol;
  ctx: Context;
  fiber?: Fiber;
  parent: EntryGroup;
  options: EntryOptions;
  subgroup?: EntryGroup;
  subtree?: EntryTree;
  _initTask?: Promise<void>;
  constructor(loader: Loader);
  get context(): Context;
  get id(): string;
  /** True when this entry or any owning parent entry is disabled. */
  get disabled(): boolean;
  /**
   * Effective disabled state: a `!!js` expression evaluates against the loader
   * context. The raw node stays in the options, so write-back keeps the form.
   */
  private disabledOf;
  evaluate(expr: string): any;
  private _patchContext;
  refresh(): Promise<void>;
  /** Merge new options, restart as needed, and persist through the parent tree. */
  update(options: Partial<EntryOptions>, create?: boolean, force?: boolean): Promise<void>;
  /**
   * Parse a volatile-only raw config change and commit its values into the running fiber's references.
   * An invalid candidate is logged and leaves the running references unchanged; the raw config stays retained for the next activation.
   * @returns `false` when an ordinary effective value changed, so the caller applies the ordinary update lifecycle.
   */
  private _commitVolatile;
  getOuterStack: () => string[];
  /** Import and start the configured plugin if it is not already running. */
  init(): Promise<void>;
  private _init;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.5_@deepseek-ai+cordis@4.0.4_node-addon-require-builtin@0.1.7/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/config/isolate.d.ts
declare module './entry.ts' {
  interface EntryOptions {
    intercept?: Dict | null;
    isolate?: Dict<true | string> | null;
  }
  interface Entry {
    realm: LocalRealm;
  }
}
/** Symbol realm used to isolate service implementations by entry or label. */
declare abstract class Realm {
  protected store: Dict<symbol>;
  abstract get suffix(): string;
  access(key: string, create?: boolean): symbol;
  delete(key: string): void;
  get size(): number;
}
/** Entry-local isolation realm. */
declare class LocalRealm extends Realm {
  private entry;
  constructor(entry: Entry);
  get suffix(): string;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.5_@deepseek-ai+cordis@4.0.4_node-addon-require-builtin@0.1.7/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/index.d.ts
declare module '@deepseek-ai/cordis' {
  interface Events {
    'exit'(signal: NodeJS.Signals): Promise<void>;
    'loader/config-update'(): void;
    'loader/entry-init'(entry: Entry): void;
    'loader/partial-dispose'(entry: Entry, legacy: Partial<EntryOptions>, active: boolean): void;
    /**
     * Volatile config values were committed into the running fiber without a remount; dispatched to the owning fiber only.
     * @param paths - changed config paths as key arrays; every value is committed before dispatch.
     * @mode emit
     */
    'loader/volatile-update'(paths: readonly (readonly string[])[]): void;
    /**
     * Refresh entry context before applying config.
     * @param entry - entry containing the new raw config and optional current fiber.
     * @param next - continue context refresh and Loader's config update.
     * @mode waterfall
     */
    'loader/patch-context'(entry: Entry, next: () => void): void;
  }
  interface Context {
    loader: Loader;
  }
  interface EnvData {
    startTime?: number;
  }
  interface Fiber {
    entry?: Entry;
  }
}
/** Loader config and dependency intercept namespace. */
declare namespace Loader {
  /** Root loader configuration. */
  interface Config {
    /** Base URL used to resolve relative plugin specifiers and config paths. */
    baseUrl?: string;
  }
  /** Intercept config used when other plugins depend on `loader`. */
  interface Intercept {
    /** Keep dependent plugins pending while loader entries are still loading. */
    await?: boolean;
  }
}
/**
 * Service that owns a loader entry tree and imports configured plugins.
 *
 * Subclasses provide persistence by implementing `write()` on `EntryTree`.
 */
declare class Loader extends EntryTree {
  config: Loader.Config;
  [Service.config]: Loader.Intercept;
  envData: any;
  name: string;
  internal: ModuleLoader | undefined;
  builtins: Dict<any>;
  constructor(ctx: Context, config?: Loader.Config);
  write(): void;
  [Service.check](): boolean;
  showLog(entry: Entry, type: string): void;
  /** Return the loader entry id that owns `fiber`, if any. */
  locate(fiber?: Fiber): string | undefined;
  /** Hook for hosts that can restart the process on full-reload requests. */
  exit(): void;
  /** Normalize ESM/CJS/default export shapes before applying a plugin. */
  unwrapExports(exports: any): any;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-include@1.0.9_@deepseek-ai+cordis-plugin-loader@1.0.5_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/cordis-plugin-include/lib/types/index.d.ts
/** Runtime patch applied to entries loaded from an included config file. */
interface PatchOptions {
  id?: string;
  insert?: EntryOptions[];
  name?: string;
  config?: any;
  group?: boolean | null;
  disabled?: boolean | null;
  inject?: any;
  intercept?: any;
  isolate?: any;
  [key: string]: any;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-launch-environment@0.2.0-rc.2_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/dsh-launch-environment/lib/types/index.d.ts
/**
 * Which layer supplied a value, from most to least trusted: the environment
 * this process inherited, the invoking directory's `.env`, the Harness home's
 * `.env`.
 */
type LaunchEnvironmentSource = 'process' | 'project-env' | 'user-env';
/** One resolved variable and the layer it came from. */
interface LaunchEnvironmentEntry {
  /** The value as the layer supplied it; may be empty, which each owner judges for itself. */
  value: string;
  /** The layer that supplied it. */
  source: LaunchEnvironmentSource;
  /** Absolute path of the file that supplied it; absent for `process`. */
  path?: string;
}
/**
 * The frozen environment of one launch. Construct through
 * {@link createLaunchEnvironmentSnapshot}; nothing mutates it afterwards, so a
 * later `chdir`, workspace switch, or resumed session observes the same
 * values a consumer resolved at boot.
 */
interface LaunchEnvironmentSnapshot {
  /**
   * Resolve one name across every layer, most trusted first.
   * @param name - the variable name.
   * @returns the winning entry, or `undefined` when no layer supplies it.
   */
  get(name: string): LaunchEnvironmentEntry | undefined;
  /**
   * Resolve one name only from `sources`, retaining canonical trust order;
   * omitted layers are unreachable.
   * @param name - the variable name.
   * @param sources - the layers allowed in the canonical trust order.
   * @returns the first matching entry, or `undefined`.
   */
  getFrom(name: string, sources: readonly LaunchEnvironmentSource[]): LaunchEnvironmentEntry | undefined;
}
declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Launcher-owned snapshot of this run's environment; absent in compositions the product CLI did not boot. */
    launchEnvironment?: LaunchEnvironmentSnapshot;
  }
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-package-manifest@0.2.0-rc.2_@deepseek-ai+cordis@4.0.4/node_modules/@deepseek-ai/dsh-package-manifest/lib/types/types.d.ts
/** Literal text or translations indexed by lowercase language id, with a required English fallback. */
type LocalizedText = string | {
  readonly en: string;
  readonly [locale: string]: string;
};
/** Validated plugin display fields and diagnostics from exported locales, manifests, or icon files. */
interface PluginLocalizedMeta {
  /** Display title; omission preserves the consumer's technical-name fallback. */
  readonly title?: LocalizedText;
  /** Display introduction after locale and package-field fallback. */
  readonly description?: LocalizedText;
  /** Base64 image data URL read from the manifest's icon file; render as an image, not inline markup. */
  readonly icon?: string;
  /** Unmodified local metadata diagnostic; the plugin remains manageable. */
  readonly error?: string;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-app-boot@0.2.0-rc.2_@deepseek-ai+cordis-plugin-group@1.0.4_@deepseek-a_29a57175adbd788903e565fb9da60644/node_modules/@deepseek-ai/dsh-app-boot/lib/types/profile.d.ts
/** One package the runtime resolution supplies at the interception layer. */
interface RuntimeResolutionEntry {
  /** Bare package name. */
  readonly name: string;
  /** Package directory selected by the existing dependency traversal. */
  readonly packageDir: string;
  /** Selected package version when its manifest declares one. */
  readonly version: string | undefined;
  /** Manifest whose dependency edge selected this package. */
  readonly declarer: string;
  /** Whether every profile or only the active profile receives this entry. */
  readonly scope: 'installation' | 'profile';
}
/**
 * A profile node_modules entry linked to a directory outside the shared profiles tree and the active profile.
 * Importers below `realPath` use Node's real ancestor chain, with peer mappings read at each node_modules position.
 */
interface LinkedRoot {
  /** Package name of the profile `node_modules` entry, including its scope. */
  readonly name: string;
  /** Real directory outside the shared profiles tree and active profile; a package.json is optional. */
  readonly realPath: string;
}
/** Complete immutable package table for one profile launch. */
interface RuntimeResolution {
  /** Directory containing every profile; its node_modules is the interception layer. */
  readonly profilesDir: string;
  /** Active profile directory, when profile-scope entries were included. */
  readonly profileDir: string | undefined;
  /** Profile-declared packages installed in the profile's own node_modules. */
  readonly localPackageNames: readonly string[];
  /** Installation-scope entries followed by profile-scope entries in precedence order. */
  readonly entries: readonly RuntimeResolutionEntry[];
  /** Active profile links to external directories, sorted by name. */
  readonly linkedRoots: readonly LinkedRoot[];
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-app-boot@0.2.0-rc.2_@deepseek-ai+cordis-plugin-group@1.0.4_@deepseek-a_29a57175adbd788903e565fb9da60644/node_modules/@deepseek-ai/dsh-app-boot/lib/types/profile-context.d.ts
/** Application-owned package manager executable; environment applies only to package operations. */
interface ProfilePnpmInvocation {
  readonly command: string;
  readonly args: readonly string[];
  readonly env: Readonly<Record<string, string>>;
}
/** Current profile facts; scheduling and mutation belong to their callers. */
interface ProfileContext {
  readonly name: string;
  /** Packaged applications supply their bundled runtime instead of a PATH executable. */
  readonly packageManager?: ProfilePnpmInvocation;
  readonly dir: string;
  readonly patchPath: string;
  readonly installAnchor: string;
  readonly cwd: string;
  readonly home: string;
  /** Bundle packages used to start this process, before any persisted edits. */
  readonly startedBundles: readonly string[];
  /** Parsed command-line overlays, applied above profile and home patches. */
  readonly overlays: readonly PatchOptions[];
  /** Launch-time DSH_TELEMETRY_DISABLED value; any non-empty value opts out. */
  readonly telemetryDisabledEnv: string | undefined;
}
declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Present only in a profile launched by dsh. */
    profileContext: ProfileContext;
  }
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-app-boot@0.2.0-rc.2_@deepseek-ai+cordis-plugin-group@1.0.4_@deepseek-a_29a57175adbd788903e565fb9da60644/node_modules/@deepseek-ai/dsh-app-boot/lib/types/profile-resolution/service.d.ts
declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Deterministic package lookup for configured plugin specifiers. */
    pluginPackages: PluginPackages;
  }
}
/** The package that owns a resolved module. */
interface PluginPackage {
  /** Manifest package name. */
  name: string;
  /** Manifest version when declared. */
  version: string | undefined;
  /** Absolute package directory. */
  dir: string;
  /** Absolute package.json path. */
  manifestPath: string;
  /** Parsed manifest shared by metadata readers. */
  manifest: Record<string, unknown>;
}
/** Optional runtime interception installed and owned by {@link PluginPackages}. */
interface PluginPackagesConfig {
  /** Complete package table; omit it to expose native package lookup only. */
  resolution?: RuntimeResolution;
}
/** Package lookup shared by metadata consumers in one profile process. */
declare class PluginPackages extends Service {
  private packages;
  private readonly interception;
  private disposeWorkerResolution;
  constructor(ctx: Context, config?: PluginPackagesConfig);
  /**
   * Publish a complete successor generation for this process and subsequently created Workers.
   * Linked roots may be removed without unloading modules or clearing Node caches.
   * @param successor - fully constructed generation accepted by {@link RuntimeInterception.replace}.
   */
  replace(successor: RuntimeResolution): void;
  /**
   * Locate the package named by a specifier without requiring a package export.
   * @param specifier - module specifier whose package owns the requested module.
   * @param parentURL - URL whose Node lookup order applies.
   * @returns the parsed package, or undefined when no package owns the request.
   */
  packageOf(specifier: string, parentURL: string): PluginPackage | undefined;
  /**
   * Read display metadata without loading or activating the target plugin.
   * @param specifier - configured package module, including package subpaths.
   * @param parentURL - owning Loader tree's resolution base.
   * @returns local display metadata or its diagnostic; undefined for non-package requests or absent metadata.
   */
  metaOf(specifier: string, parentURL: string): PluginLocalizedMeta | undefined;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+dsh-app-boot@0.2.0-rc.2_@deepseek-ai+cordis-plugin-group@1.0.4_@deepseek-a_29a57175adbd788903e565fb9da60644/node_modules/@deepseek-ai/dsh-app-boot/lib/types/index.d.ts
declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Harness-home path resolver available to Loader `!!js` config expressions. */
    dshHomePath?: typeof dshHomePath;
  }
  interface Events {
    /**
     * Profile patches were reconciled into the running Loader tree: every entry update settled and no new
     * inactive entry was introduced. Carries no diff; listeners re-read Loader entries.
     * @mode emit
     */
    'app-boot/config-reload'(): void;
  }
}
/**
 * Load a required overlay patch list: a bundle's `cordis.patch.yml` or a
 * `--patch <path>` overlay. Same file format as {@link loadOptionalPatches},
 * but a missing file throws, because the caller named this file — its absence
 * is a misconfiguration, not "no overlay".
 * @param binName - the diagnostic prefix on the thrown error.
 * @param file - absolute path of the overlay file.
 * @returns the parsed patch list.
 */
declare function loadOverlayPatches(binName: string, file: string): PatchOptions[];
//#endregion
//#region src/dev-boot.d.ts
/** Overlay patch ops as the boot loader consumes them (portable alias). */
type PatchOps = ReturnType<typeof loadOverlayPatches>;
/** The empty entries root the include loader mounts; patches layer on top. */
declare function rootEntriesPath(name: string): string;
/**
 * This package's bundle patch ops, in `dsh.bundle.patch` order. The declaration
 * is a single path or a list (the 0.2.0 preset architecture needs the four
 * preset files to follow cordis.patch.yml), exactly as the dsh profile boot
 * reads it.
 */
declare function ownPatchOps(name: string): PatchOps;
/** dsh-base bundle patch ops — the shared base rows (llm, session, tools…). */
declare function basePatchOps(name: string): PatchOps;
/**
 * Dev-only extra patch layer: `DSH_ACP_DEV_PATCH=<path>` names one more patch
 * file appended after this bundle's layers. dsh 0.2.0's preset registry scans
 * no directories — a new preset is an inserted `@deepseek-ai/dsh-agent-preset`
 * row — so the probes author one here the way a deployment installs one.
 * Unset means no extra layer.
 */
declare function devOverlayOps(name: string): PatchOps;
//#endregion
export { basePatchOps, devOverlayOps, ownPatchOps, rootEntriesPath };