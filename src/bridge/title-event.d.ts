// The harness's `session/title` session event (present in the runtime
// persistence catalog, KNOWN_SESSION_EVENT_TYPES, and appended by the
// dsh-session-title service on user rename and provider generation) is not
// typed in dsh-session 0.1.2-rc.1. Declaring it here lets the bridge's
// `session/event` firehose narrow `event.data` so a title written by the
// title service streams to the client as a `session_info_update`. The
// (unused) type import makes this file a module: a global-script
// `declare module` would become an ambient declaration that shadows the
// real `@deepseek-ai/dsh-session/types` resolution and drops the other
// packages' augmentations (todo/write et al) from the program.
import type {} from '@deepseek-ai/dsh-session/types'

declare module '@deepseek-ai/dsh-session/types' {
    interface SessionEventMap {
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
    }
}

