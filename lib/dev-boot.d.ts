import { LoadHookContext } from "node:module";
import { dshHomePath } from "@deepseek-ai/dsh-home-paths";
import { Context, Fiber, Inject, Service } from "@deepseek-ai/cordis";
//#region node_modules/.pnpm/@deepseek-ai+cosmokit@1.8.3/node_modules/@deepseek-ai/cosmokit/lib/types/misc.d.ts
/** String/symbol keyed dictionary type. */
type Dict<T = any, K extends string | symbol = string> = { [key in K]: T; };
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.3_@deepseek-ai+cordis@4.0.2/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/internal.d.ts
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
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.3_@deepseek-ai+cordis@4.0.2/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/config/tree.d.ts
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
  /**
   * Wait until this tree has no active import or lifecycle tasks.
   * @throws a settled fiber failure, or an aggregate when several fibers failed.
   */
  await(): Promise<void>;
  ensureId(options: Partial<EntryOptions>): string;
  /** Resolve an entry by id, including nested ids separated by `EntryTree.sep`. */
  resolve(id: string): Entry;
  resolveGroup(id: string | null): EntryGroup;
  /** Create an entry in the root group or a nested group. */
  create(options: Omit<EntryOptions, 'id'>, parent?: string | null, position?: number): Promise<string>;
  /** Stop and remove an entry from its parent group. */
  remove(id: string): Promise<void>;
  /** Update an entry and optionally move it to another group. */
  update(id: string, options: Omit<EntryOptions, 'id' | 'name'>, parent?: string | null, position?: number): Promise<void>;
  /** Import a plugin module from a specifier or `cordis:` builtin. */
  import(name: string, getOuterStack?: () => string[]): any;
  /** Persist current tree state. In-memory trees may implement this as a no-op. */
  abstract write(): void;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.3_@deepseek-ai+cordis@4.0.2/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/config/group.d.ts
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
  remove(id: string, isDispose?: boolean): Promise<void>;
  update(config: EntryOptions[]): Promise<void>;
  stop(): Promise<void>;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.3_@deepseek-ai+cordis@4.0.2/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/config/entry.d.ts
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
  _disposing: number;
  constructor(loader: Loader);
  get context(): Context;
  get id(): string;
  /** True when this entry or any owning parent entry is disabled. */
  get disabled(): boolean;
  private _disabled;
  /**
   * Effective disabled state: a `!!js` expression evaluates against the loader
   * context. The raw node stays in the options, so write-back keeps the form.
   */
  private disabledOf;
  evaluate(expr: string): any;
  private _patchContext;
  refresh(): Promise<void>;
  _dispose(fiber?: Fiber | undefined): Promise<void>;
  /** Merge new options, restart as needed, and persist through the parent tree. */
  update(options: Partial<EntryOptions>, create?: boolean, force?: boolean): Promise<void>;
  getOuterStack: () => string[];
  /** Import and start the configured plugin if it is not already running. */
  init(): Promise<void>;
  _await(): Promise<void>;
  private _init;
  private _start;
}
//#endregion
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.3_@deepseek-ai+cordis@4.0.2/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/config/isolate.d.ts
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
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-loader@1.0.3_@deepseek-ai+cordis@4.0.2/node_modules/@deepseek-ai/cordis-plugin-loader/lib/types/index.d.ts
declare module '@deepseek-ai/cordis' {
  interface Events {
    'exit'(signal: NodeJS.Signals): Promise<void>;
    'loader/config-update'(): void;
    'loader/entry-init'(entry: Entry): void;
    'loader/partial-dispose'(entry: Entry, legacy: Partial<EntryOptions>, active: boolean): void;
    'loader/patch-context'(entry: Entry, next: () => void | Promise<void>): void | Promise<void>;
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
//#region node_modules/.pnpm/@deepseek-ai+cordis-plugin-include@1.0.7_@deepseek-ai+cordis-plugin-loader@1.0.3_@deepseek-ai+cordis@4.0.2/node_modules/@deepseek-ai/cordis-plugin-include/lib/types/index.d.ts
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
//#region node_modules/.pnpm/@deepseek-ai+dsh-launch-environment@0.1.5-rc.1_@deepseek-ai+cordis@4.0.2/node_modules/@deepseek-ai/dsh-launch-environment/lib/types/index.d.ts
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
//#region node_modules/.pnpm/@deepseek-ai+dsh-app-boot@0.1.5-rc.1_@deepseek-ai+cordis-plugin-group@1.0.2_@deepseek-a_b294d18114c8a65a3132635cfc2c85c0/node_modules/@deepseek-ai/dsh-app-boot/lib/types/index.d.ts
declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Harness-home path resolver available to Loader `!!js` config expressions. */
    dshHomePath?: typeof dshHomePath;
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
/** This package's bundle patch ops. */
declare function ownPatchOps(name: string): PatchOps;
/** dsh-base bundle patch ops — the shared base rows (llm, session, tools…). */
declare function basePatchOps(name: string): PatchOps;
/**
 * Dev-only agent-presets overlay. The dsh CLI profile boot appends the shipped
 * preset root onto the `agent-presets` row itself; a standalone boot must name
 * its own root. Default: the presets shipped inside the installed
 * @deepseek-ai/dsh-agent-presets package, overridable with
 * DSH_ACP_PRESET_ROOT=<path> so a developer can point at the real deployment
 * root (e.g. the dsh install's config/agent-presets).
 */
declare function presetOverlayOps(): {
  id: string;
  config: {
    default: string;
    roots: {
      path: string;
      trust: string;
    }[];
  };
}[];
//#endregion
export { basePatchOps, ownPatchOps, presetOverlayOps, rootEntriesPath };