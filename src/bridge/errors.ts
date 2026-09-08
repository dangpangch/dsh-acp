// Named model-facing error codes (optimization plan P3-3). The ask tool
// surfaces these failures to the model, so a stable `[CODE]` prefix keeps
// them readable in tests and decodable by the model. ACP protocol errors
// (RequestError) are NOT routed through here — this is the tool-failure
// taxonomy only.
export const ELICITATION_UNSUPPORTED = 'ELICITATION_UNSUPPORTED'
export const ELICITATION_NO_SESSION = 'ELICITATION_NO_SESSION'
export const ELICITATION_ABORTED = 'ELICITATION_ABORTED'
export const ELICITATION_DECLINED = 'ELICITATION_DECLINED'
export const ELICITATION_CANCELLED = 'ELICITATION_CANCELLED'

/** Prefix a model-facing failure message with its stable code. */
export const codedError = (code: string, detail: string): Error => new Error(`[${code}] ${detail}`)
