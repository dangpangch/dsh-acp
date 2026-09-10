// Local declarations for the harness session events the bridge reads/writes but
// that this bundle's program cannot import from their owning packages.
//
// `model/selection` is present in the runtime persistence catalog
// (KNOWN_SESSION_EVENT_TYPES in 0.1.5-rc.1) but untyped across that whole
// cohort and written by nobody — the ACP bridge is the only model-selection
// mutator within its sessions. Declaring it here types our own writes/reads:
// `applyConfigOption` appends one snapshot per selection change and
// `prepareHistoryResume` restores the last one, so a reloaded session
// advertises — and drives — the route it actually used instead of silently
// reverting to the configured default (the harness deliberately leaves the
// selection to the entry point: ModelSelectionRef is caller-owned and resume
// does not restore it).
//
// `session/title` is typed by the dsh-session-title package since 0.1.5-rc.1,
// but this bundle does not import it (the row belongs to dsh-base), so the
// bridge's program still needs a local declaration to narrow `event.data` and
// stream a title written by the title service as a `session_info_update`.
//
// `agent-preset/selected` is typed by @deepseek-ai/dsh-agent-presets (a
// devDependency of this bundle: only the standalone dev/test boot names the
// row), so the bridge's program needs the same local declaration to fold the
// last pre-turn preset pick when a session is reloaded. The payload mirrors
// that package's `session` module exactly.
//
// The (unused) type import makes this file a module: a global-script
// `declare module` would become an ambient declaration that shadows the real
// `@deepseek-ai/dsh-session/types` resolution and drops the other packages'
// augmentations (todo/write et al) from the program.
import type { ModelSelection } from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-session/types'

declare module '@deepseek-ai/dsh-session/types' {
    interface SessionEventMap {
        /**
         * The model selection for the next request: provider, model, and the
         * picked reasoning effort when one is set. Log-only state (latest
         * snapshot wins on replay); never surfaces to the model.
         */
        'model/selection': ModelSelection
        /**
         * One session-title snapshot (latest write wins when folding). Written
         * by the dsh-session-title service; `source.kind` distinguishes a user
         * rename from provider generation.
         */
        'session/title': {
            title: string
            messageSeqs: readonly number[]
            source: { kind: string } & Record<string, unknown>
        }
        /**
         * A preset chosen after creation, while the session was still blank.
         * Log-only: the creation header keeps naming the ORIGINAL preset, so a
         * resumed session rebuilds the composition later turns actually ran
         * under only by folding this event (dsh reads its `agentPreset`
         * projection, never the header alone).
         */
        'agent-preset/selected': {
            agentPreset: string
        }
    }
}
