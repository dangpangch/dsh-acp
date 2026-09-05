// The harness's `model/selection` session event (present in the runtime
// persistence catalog, KNOWN_SESSION_EVENT_TYPES, but not yet typed in
// dsh-session 0.1.2-rc.1 and written by nobody — the ACP bridge is the only
// model-selection mutator within its sessions). Declaring it here types our
// own writes/reads; `applyConfigOption` appends one snapshot per selection
// change and `prepareHistoryResume` restores the last one, so a reloaded
// session advertises — and drives — the route it actually used instead of
// silently reverting to the configured default (the harness deliberately
// leaves the selection to the entry point: ModelSelectionRef is caller-owned
// and resume does not restore it).
import type { ModelSelection } from '@deepseek-ai/dsh-agent'

declare module '@deepseek-ai/dsh-session/types' {
    interface SessionEventMap {
        /**
         * The model selection for the next request: provider, model, and the
         * picked reasoning effort when one is set. Log-only state (latest
         * snapshot wins on replay); never surfaces to the model.
         */
        'model/selection': ModelSelection
    }
}
