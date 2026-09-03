// tool-cards: pure tool-card presentation helpers shared by the live and
// replay paths (design.zh.md §6.2, protocol-map.md §3). Zed 1.18 renders every
// execute-kind (bash/pwsh) tool call as a terminal-style card whose header IS
// the `title` text — it deliberately hides rawInput for execute kind — so the
// title must carry the concrete command line; otherwise the card shows only
// the bare tool name ("bash") with no command info. Other kinds keep the plain
// name because Zed shows their arguments via the raw-input disclosure.
import { describe, expect, it } from 'vitest'
import {
  EXECUTE_CARD_TITLE_MAX,
  rawInputOf,
  toolCallTitle,
  toolKindFor,
} from '../src/bridge/tool-cards.js'

describe('toolKindFor', () => {
  it('classifies command runners as execute', () => {
    expect(toolKindFor('bash')).toBe('execute')
    expect(toolKindFor('pwsh')).toBe('execute')
  })

  it('classifies file tools by their coarse family', () => {
    expect(toolKindFor('write')).toBe('edit')
    expect(toolKindFor('edit')).toBe('edit')
    expect(toolKindFor('read')).toBe('read')
    expect(toolKindFor('read_image')).toBe('read')
    expect(toolKindFor('grep')).toBe('search')
    expect(toolKindFor('glob')).toBe('search')
    expect(toolKindFor('fs_search')).toBe('search')
    expect(toolKindFor('rm')).toBe('delete')
  })

  it('falls back to other for unknown names', () => {
    expect(toolKindFor('ask_user_question')).toBe('other')
    expect(toolKindFor('todo_write')).toBe('other')
  })
})

describe('toolCallTitle', () => {
  it('carries the concrete command on execute-kind cards', () => {
    expect(toolCallTitle('execute', 'bash', { command: 'git status --short' })).toBe('git status --short')
    expect(toolCallTitle('execute', 'pwsh', { command: 'Get-ChildItem' })).toBe('Get-ChildItem')
  })

  it('trims insignificant shell whitespace around the command', () => {
    expect(toolCallTitle('execute', 'bash', { command: '  npm test  ' })).toBe('npm test')
    expect(toolCallTitle('execute', 'bash', { command: '\n\ngit log -1\n' })).toBe('git log -1')
  })

  it('keeps real multi-line commands intact', () => {
    const script = 'git add -A\ngit commit -m "wip"'
    expect(toolCallTitle('execute', 'bash', { command: script })).toBe(script)
  })

  it('truncates pathological commands with an ellipsis', () => {
    const long = 'x'.repeat(EXECUTE_CARD_TITLE_MAX + 50)
    const title = toolCallTitle('execute', 'bash', { command: long })
    expect(title.length).toBe(EXECUTE_CARD_TITLE_MAX + 1)
    expect(title.endsWith('…')).toBe(true)
    expect(title.slice(0, EXECUTE_CARD_TITLE_MAX)).toBe(long.slice(0, EXECUTE_CARD_TITLE_MAX))
  })

  it('falls back to the tool name when no command is present', () => {
    expect(toolCallTitle('execute', 'bash', {})).toBe('bash')
    expect(toolCallTitle('execute', 'bash', { cwd: '/tmp' })).toBe('bash')
    expect(toolCallTitle('execute', 'bash', { command: '' })).toBe('bash')
    expect(toolCallTitle('execute', 'bash', { command: 42 })).toBe('bash')
    expect(toolCallTitle('execute', 'bash', 'not-json')).toBe('bash')
    expect(toolCallTitle('execute', 'bash', undefined)).toBe('bash')
  })

  it('keeps the plain tool name on every non-execute kind', () => {
    expect(toolCallTitle('edit', 'write', { path: '/a/b.txt', text: 'hi' })).toBe('write')
    expect(toolCallTitle('read', 'read', { path: '/a/b.txt' })).toBe('read')
    expect(toolCallTitle('search', 'grep', { command: 'git status' })).toBe('grep')
    expect(toolCallTitle('other', 'ask_user_question', { command: 'echo hi' })).toBe('ask_user_question')
  })
})

describe('rawInputOf', () => {
  it('parses argument JSON into the displayed input object', () => {
    expect(rawInputOf('{"command":"git status"}')).toEqual({ command: 'git status' })
  })

  it('keeps unparsable arguments verbatim', () => {
    expect(rawInputOf('nope')).toBe('nope')
  })
})
