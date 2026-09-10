// Canned stub LLM adapter for scripts/wire-probe.mjs (committed, loaded as the
// `wire-stub-llm` plugin row): first call asks for one bash invocation, then
// one read, then a todo write and an ask_user_question form, then answers plain
// text and stops.
import { LlmAdapter } from '@deepseek-ai/dsh-llm'
// Phase 1 writes OUTSIDE the workspace so the approval stack escalates to a
// real session/request_permission round-trip under the workspace-write preset.
const OUTSIDE = (process.env.DSH_HOME ?? '/tmp') + '/perm-probe.txt'
export class StubAdapter extends LlmAdapter {
  providerInfo(provider) { return { id: provider, name: 'Stub' } }
  async listModels() {
    return [{ id: 'stub-model', name: 'stub-model', contextWindow: 128000, inputModalities: ['text'], outputModalities: ['text'] }]
  }
  async resolveModel(_provider, model) {
    return { provider: 'stub', id: model, name: 'stub-model', contextWindow: 128000, inputModalities: ['text'], outputModalities: ['text'] }
  }
  async *stream(options) {
    const saw = (id) => options.messages.some((m) => m.content.some((b) => b.type === 'tool-result' && b.toolCallId === id))
    if (!saw('call-1')) {
      const command = 'touch "' + OUTSIDE + '"'
      yield { type: 'reasoning-delta', index: 0, text: 'The user wants the probe file written.\n' }
      yield { type: 'text-delta', index: 1, text: 'Running bash.\n' }
      yield { type: 'tool-call-delta', index: 2, id: 'call-1', name: 'bash', argumentsDelta: JSON.stringify({ command, description: 'Write outside the workspace' }) }
      yield { type: 'block-end', index: 0, block: { type: 'reasoning', text: 'The user wants the probe file written.\n' } }
      yield { type: 'block-end', index: 1, block: { type: 'text', text: 'Running bash.\n' } }
      yield { type: 'block-end', index: 2, block: { type: 'tool-call', id: 'call-1', name: 'bash', arguments: JSON.stringify({ command, description: 'Write outside the workspace' }) } }
      yield { type: 'finish', reason: { kind: 'tool-calls' } }
      return
    }
    if (!saw('call-2')) {
      yield { type: 'tool-call-delta', index: 0, id: 'call-2', name: 'read', argumentsDelta: JSON.stringify({ file_path: 'hello.txt' }) }
      yield { type: 'block-end', index: 0, block: { type: 'tool-call', id: 'call-2', name: 'read', arguments: JSON.stringify({ file_path: 'hello.txt' }) } }
      yield { type: 'finish', reason: { kind: 'tool-calls' } }
      return
    }
    if (!saw('call-3')) {
      const todos = [{ content: 'probe step', status: 'in_progress' }, { content: 'wrap up', status: 'pending' }]
      yield { type: 'tool-call-delta', index: 0, id: 'call-3', name: 'todo_write', argumentsDelta: JSON.stringify({ todos }) }
      yield { type: 'block-end', index: 0, block: { type: 'tool-call', id: 'call-3', name: 'todo_write', arguments: JSON.stringify({ todos }) } }
      yield { type: 'finish', reason: { kind: 'tool-calls' } }
      return
    }
    if (!saw('call-4')) {
      const questions = [
        { id: 'proceed', question: 'Proceed with the probe?', options: [{ label: 'Yes' }, { label: 'No' }] },
        { id: 'extras', question: 'Pick extras', options: [{ label: 'A' }, { label: 'B' }], multi_select: true },
      ]
      yield { type: 'tool-call-delta', index: 0, id: 'call-4', name: 'ask_user_question', argumentsDelta: JSON.stringify({ questions }) }
      yield { type: 'block-end', index: 0, block: { type: 'tool-call', id: 'call-4', name: 'ask_user_question', arguments: JSON.stringify({ questions }) } }
      yield { type: 'finish', reason: { kind: 'tool-calls' } }
      return
    }
    yield { type: 'text-delta', index: 0, text: 'done' }
    yield { type: 'block-end', index: 0, block: { type: 'text', text: 'done' } }
    yield { type: 'finish', reason: { kind: 'stop' } }
  }
}
export const apply = (ctx) => {
  ctx.effect(() => ctx.get('llm').registerAdapter(['stub'], new StubAdapter()), 'dsh-acp-wire-stub')
}
