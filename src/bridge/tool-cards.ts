// Pure tool-card presentation helpers shared by the live path
// (bridge/index.ts `deliverToolCall`) and the durable-history replay path
// (replay.ts), so both produce byte-identical wire cards and stay
// unit-testable offline without a harness or protocol SDK (design.zh.md §6.2,
// protocol-map.md §3).
//
// ACP kind classification: coarse `ToolKind` choice drives the client's icon
// AND its layout. Zed 1.18 treats every execute-kind call as a terminal tool:
// the card header renders the `title` field as the command and deliberately
// hides `rawInput` (thread_view.rs `should_show_raw_input =
// !is_terminal_tool && !is_edit && …`). An external agent has no real Zed
// terminal, so the ONLY visible text for a `bash` call is the title we send —
// a bare tool name reads as "bash" with no command at all. The title of an
// execute-kind card therefore carries the concrete command line itself, like a
// native Zed terminal card. Every other kind keeps the plain tool name; Zed
// shows those arguments through its raw-input disclosure instead.
/** First tool-result call id + concatenated visible text of one result message. */
export function toolResultCall(message: {
  content: readonly unknown[]
}): { callId: string; text: string } {
  let callId = ''
  let text = ''
  const collect = (blocks: readonly unknown[]) => {
    for (const block of blocks) {
      const typed = block as { type?: string; text?: string; toolCallId?: string; content?: unknown }
      if (typed.type === 'text') text += typed.text ?? ''
      else if (typed.type === 'tool-result') {
        if (callId === '') callId = typed.toolCallId ?? ''
        if (Array.isArray(typed.content)) collect(typed.content as readonly unknown[])
      }
    }
  }
  collect(message.content)
  return { callId, text }
}

/** ACP tool-kind vocabulary used by the wire cards (schema `ToolKind`). */
export type ToolKindName = 'execute' | 'edit' | 'search' | 'read' | 'delete' | 'think' | 'other'

/** Coarse ACP tool-kind classification for the generic card icon. */
export function toolKindFor(name: string): ToolKindName {
  if (name === 'bash' || name === 'pwsh') return 'execute'
  if (name === 'write' || name === 'edit' || name === 'str_replace' || name === 'str_replace_editor') return 'edit'
  if (name === 'read_image' || name === 'read') return 'read'
  if (name.startsWith('search') || name === 'grep' || name === 'glob' || name === 'fs_search') return 'search'
  if (name.includes('delete') || name === 'rm') return 'delete'
  return 'other'
}

/** Raw tool-argument JSON as displayed input (unparsable stays verbatim). */
export function rawInputOf(argumentsJson: string): unknown {
  try {
    return JSON.parse(argumentsJson)
  } catch {
    return argumentsJson
  }
}

/**
 * Max title length for execute-kind cards. Keeps a pathological heredoc or
 * generated script from blowing up the card header; ordinary commands pass
 * through untouched.
 */
export const EXECUTE_CARD_TITLE_MAX = 400

/** The model-written command line of a bash/pwsh call, or undefined. */
function commandOf(rawInput: unknown): string | undefined {
  if (typeof rawInput !== 'object' || rawInput === null) return undefined
  const command = (rawInput as Record<string, unknown>).command
  return typeof command === 'string' ? command : undefined
}

/** Human card title for one tool call (see module header for the rationale). */
export function toolCallTitle(kind: ToolKindName, name: string, rawInput: unknown): string {
  if (kind === 'execute') {
    const command = commandOf(rawInput)?.trim()
    if (command !== undefined && command.length > 0) {
      return command.length <= EXECUTE_CARD_TITLE_MAX
        ? command
        : `${command.slice(0, EXECUTE_CARD_TITLE_MAX)}…`
    }
  }
  return name
}
