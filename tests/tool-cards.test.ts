// tool-cards: pure tool-card presentation helpers shared by the live and
// replay paths (design.zh.md §3.4/§6.2). Zed 1.18 renders every
// execute-kind (bash/pwsh) tool call as a terminal-style card whose header IS
// the `title` text — it deliberately hides rawInput for execute kind — so the
// title must carry the concrete command line; otherwise the card shows only
// the bare tool name ("bash") with no command info. Other kinds keep the plain
// name because Zed shows their arguments via the raw-input disclosure.
import { describe, expect, it } from 'vitest'
import {
  EXECUTE_CARD_TITLE_MAX,
  diffForToolCall,
  fileDiffsFromMeta,
  rawInputOf,
  toolCallLocation,
  toolCallTitle,
  toolKindFor,
  uniqueLineOfText,
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

describe('toolCallLocation (follow-along)', () => {
  it('absolutizes the tool path argument against the session cwd', () => {
    expect(toolCallLocation({ file_path: 'src/a.ts' }, '/ws')).toEqual({ path: '/ws/src/a.ts' })
    expect(toolCallLocation({ path: '/abs/b.ts' }, '/ws')).toEqual({ path: '/abs/b.ts' })
  })

  it('carries the read window offset as the 1-based focus line', () => {
    expect(toolCallLocation({ file_path: 'a.ts', offset: 7, limit: 5 }, '/ws')).toEqual({ path: '/ws/a.ts', line: 7 })
    // An offset past the file is the caller's claim; the card stays faithful.
    expect(toolCallLocation({ path: 'a.ts', offset: 1 }, '/ws')).toEqual({ path: '/ws/a.ts', line: 1 })
  })

  it('uses the str_replace_editor view_range first line and insert line + 1', () => {
    expect(toolCallLocation({ path: 'a.ts', view_range: [11, 12] }, '/ws')).toEqual({ path: '/ws/a.ts', line: 11 })
    expect(toolCallLocation({ command: 'insert', path: 'a.ts', insert_line: 4, new_str: 'x' }, '/ws')).toEqual({ path: '/ws/a.ts', line: 5 })
    expect(toolCallLocation({ command: 'insert', path: 'a.ts', insert_line: 0, new_str: 'x' }, '/ws')).toEqual({ path: '/ws/a.ts', line: 1 })
  })

  it('infers an edit line from a unique old-string match in the current file', () => {
    const readText = () => 'one\ntwo\nneedle\nthree\n'
    expect(toolCallLocation({ file_path: 'a.ts', old_string: 'needle' }, '/ws', readText)).toEqual({ path: '/ws/a.ts', line: 3 })
    // No match, repeated match, or no readable file: the location survives, the line drops.
    expect(toolCallLocation({ file_path: 'a.ts', old_string: 'zzz' }, '/ws', readText)).toEqual({ path: '/ws/a.ts' })
    expect(toolCallLocation({ file_path: 'a.ts', old_string: 'two' }, '/ws', () => 'two\ntwo\n')).toEqual({ path: '/ws/a.ts' })
    expect(toolCallLocation({ file_path: 'a.ts', old_string: 'x' }, '/ws', () => undefined)).toEqual({ path: '/ws/a.ts' })
  })

  it('returns nothing for tools that name no file (bash, grep, todo)', () => {
    expect(toolCallLocation({ command: 'git status' }, '/ws')).toBeUndefined()
    expect(toolCallLocation({ pattern: 'foo' }, '/ws')).toBeUndefined()
    expect(toolCallLocation('not-json', '/ws')).toBeUndefined()
    expect(toolCallLocation({ file_path: '' }, '/ws')).toBeUndefined()
  })
})

describe('uniqueLineOfText', () => {
  it('finds the 1-based line of the first occurrence', () => {
    expect(uniqueLineOfText('a\nb\nc\n', 'b')).toBe(2)
    expect(uniqueLineOfText('a\nb\nc\n', 'a\nb')).toBe(1)
  })

  it('returns undefined for absent or ambiguous needles and empty input', () => {
    expect(uniqueLineOfText('a\nb\n', 'z')).toBeUndefined()
    expect(uniqueLineOfText('b\nb\n', 'b')).toBeUndefined()
    expect(uniqueLineOfText('a\n', '')).toBeUndefined()
  })
})

describe('fileDiffsFromMeta', () => {
  it('narrows validated diff arrays from opaque result meta', () => {
    const diffs = [{ path: 'a.ts', oldText: 'old', newText: 'new' }]
    expect(fileDiffsFromMeta({ diffs })).toEqual(diffs)
    expect(fileDiffsFromMeta({ diffs: [] })).toEqual([]) // a fresh create
    expect(fileDiffsFromMeta(undefined)).toBeUndefined()
    expect(fileDiffsFromMeta({})).toBeUndefined()
    expect(fileDiffsFromMeta({ diffs: [{ path: 'a.ts', oldText: 1, newText: 'n' }] })).toBeUndefined()
  })
})

describe('diffForToolCall', () => {
  it('prefers the harness-computed meta hunks (edit contextual diffs)', () => {
    const meta = { diffs: [{ path: 'src/a.ts', oldText: 'ctx\nold\n', newText: 'ctx\nnew\n' }] }
    expect(diffForToolCall('edit', { file_path: 'src/a.ts', old_string: 'old', new_string: 'new' }, meta, false))
      .toEqual(meta.diffs)
  })

  it('describes a create from its whole-file arguments when meta is empty (write create)', () => {
    expect(diffForToolCall('write', { file_path: 'new.ts', content: 'hello' }, { diffs: [] }, false))
      .toEqual([{ path: 'new.ts', oldText: null, newText: 'hello' }])
  })

  it('describes the str_replace_editor edit from old_str/new_str with no meta at all', () => {
    expect(diffForToolCall('str_replace_editor', { command: 'str_replace', path: 'a.ts', old_str: 'o', new_str: 'n' }, undefined, false))
      .toEqual([{ path: 'a.ts', oldText: 'o', newText: 'n' }])
    expect(diffForToolCall('str_replace_editor', { command: 'create', path: 'b.ts', file_text: 'body' }, undefined, false))
      .toEqual([{ path: 'b.ts', oldText: null, newText: 'body' }])
  })

  it('never diffs failed calls, non-file tools, or argument shapes it cannot name', () => {
    expect(diffForToolCall('edit', { file_path: 'a.ts', old_string: 'o', new_string: 'n' }, undefined, true)).toBeUndefined()
    expect(diffForToolCall('bash', { command: 'ls' }, undefined, false)).toBeUndefined()
    expect(diffForToolCall('edit', { file_path: 'a.ts' }, undefined, false)).toBeUndefined()
    expect(diffForToolCall('edit', 'garbage', undefined, false)).toBeUndefined()
  })
})
