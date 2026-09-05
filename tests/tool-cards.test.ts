// tool-cards: pure tool-card presentation helpers shared by the live and
// replay paths (design.zh.md §3.4/§6.2). Zed 1.18 hides the textual content
// of execute-kind cards behind a hover-only chevron, so command runners
// (bash/pwsh) present like every other tool: kind `other`, a title carrying
// the model-written description ("bash show working tree"; the raw command
// line is the fallback), and the captured output as a collapsed
// click-to-expand text block. The title is the primary card text on every
// kind, so path-shaped tools title as "read src/bridge/index.ts" and search
// tools as "glob src/**/*.ts"; only argument-less tools fall back to the
// bare name.
import { describe, expect, it } from 'vitest'
import {
  TOOL_CARD_TITLE_MAX,
  diffForToolCall,
  displayRawInput,
  fileDiffsFromMeta,
  rawInputOf,
  resultCardText,
  toolCallLocation,
  toolCallTitle,
  toolKindFor,
  uniqueLineOfText,
} from '../src/bridge/tool-cards.js'

describe('toolKindFor', () => {
  it('classifies command runners as other (read-style fold-out cards)', () => {
    expect(toolKindFor('bash')).toBe('other')
    expect(toolKindFor('pwsh')).toBe('other')
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
  it('titles command cards from the model-written description, falling back to the command', () => {
    expect(toolCallTitle('other', 'bash', { command: 'git status --short', description: 'show working tree' }))
      .toBe('bash show working tree')
    expect(toolCallTitle('other', 'pwsh', { command: 'Get-ChildItem', description: 'list files' }))
      .toBe('pwsh list files')
    expect(toolCallTitle('other', 'bash', { command: 'git status --short' })).toBe('bash git status --short')
  })

  it('trims insignificant shell whitespace around the command', () => {
    expect(toolCallTitle('other', 'bash', { command: '  npm test  ' })).toBe('bash npm test')
    expect(toolCallTitle('other', 'bash', { command: '\n\ngit log -1\n' })).toBe('bash git log -1')
  })

  it('keeps real multi-line commands intact', () => {
    const script = 'git add -A\ngit commit -m "wip"'
    expect(toolCallTitle('other', 'bash', { command: script })).toBe(`bash ${script}`)
  })

  it('truncates pathological commands with an ellipsis', () => {
    const long = 'x'.repeat(TOOL_CARD_TITLE_MAX + 50)
    const title = toolCallTitle('other', 'bash', { command: long })
    expect(title.length).toBe(TOOL_CARD_TITLE_MAX + 1)
    expect(title.endsWith('…')).toBe(true)
    expect(title.slice(0, TOOL_CARD_TITLE_MAX)).toBe(`bash ${long.slice(0, TOOL_CARD_TITLE_MAX - 5)}`)
  })

  it('falls back to the tool name when no command is present', () => {
    expect(toolCallTitle('other', 'bash', {})).toBe('bash')
    expect(toolCallTitle('other', 'bash', { cwd: '/tmp' })).toBe('bash')
    expect(toolCallTitle('other', 'bash', { description: '   ' })).toBe('bash')
    expect(toolCallTitle('other', 'bash', { command: '' })).toBe('bash')
    expect(toolCallTitle('other', 'bash', { command: 42 })).toBe('bash')
    expect(toolCallTitle('other', 'bash', 'not-json')).toBe('bash')
    expect(toolCallTitle('other', 'bash', undefined)).toBe('bash')
  })

  it('names the model-facing path on path-shaped cards, relative under the cwd', () => {
    expect(toolCallTitle('read', 'read', { file_path: '/ws/src/bridge/index.ts' }, '/ws'))
      .toBe('read src/bridge/index.ts')
    expect(toolCallTitle('read', 'read', { file_path: 'src/bridge/index.ts' }, '/ws'))
      .toBe('read src/bridge/index.ts')
    expect(toolCallTitle('edit', 'str_replace_editor', { path: 'src/a.ts', command: 'str_replace', old_str: 'o', new_str: 'n' }, '/ws'))
      .toBe('str_replace_editor src/a.ts')
    expect(toolCallTitle('edit', 'write', { path: '/outside/b.txt', text: 'hi' }, '/ws'))
      .toBe('write /outside/b.txt')
    expect(toolCallTitle('delete', 'rm', { path: 'src/old.ts' }, '/ws'))
      .toBe('rm src/old.ts')
  })

  it('never keeps an absolute path under a same-prefixed but different cwd', () => {
    expect(toolCallTitle('read', 'read', { file_path: '/ws2/a.ts' }, '/ws')).toBe('read /ws2/a.ts')
  })

  it('titles search cards with the pattern and optional scope', () => {
    expect(toolCallTitle('search', 'glob', { pattern: 'src/**/*.ts' }, '/ws')).toBe('glob src/**/*.ts')
    expect(toolCallTitle('search', 'grep', { pattern: 'TODO', path: 'src' }, '/ws')).toBe('grep TODO in src')
    // A scoped search without a pattern still names its scope; a command-only
    // search names its command; no nameable argument at all falls back to the
    // bare tool name.
    expect(toolCallTitle('search', 'glob', { path: 'src' }, '/ws')).toBe('glob src')
    expect(toolCallTitle('search', 'grep', { command: 'git status' }, '/ws')).toBe('grep git status')
  })

  it('keeps the bare tool name when the arguments name nothing', () => {
    expect(toolCallTitle('read', 'read', {}, '/ws')).toBe('read')
    expect(toolCallTitle('read', 'read', 'not-json', '/ws')).toBe('read')
    expect(toolCallTitle('read', 'read', undefined)).toBe('read')
    expect(toolCallTitle('other', 'ask_user_question', { command: 'echo hi' }, '/ws')).toBe('ask_user_question echo hi')
    expect(toolCallTitle('other', 'todo_write', { todos: [{ content: 'x' }] }, '/ws')).toBe('todo_write')
  })

  it('truncates pathological argument titles with an ellipsis', () => {
    const longPath = 'd'.repeat(TOOL_CARD_TITLE_MAX + 50)
    const title = toolCallTitle('read', 'read', { file_path: longPath }, '/ws')
    expect(title.length).toBe(TOOL_CARD_TITLE_MAX + 1)
    expect(title.endsWith('…')).toBe(true)
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

describe('displayRawInput', () => {
  it('renders command runners as a shell-prompt code fence (execute-card look)', () => {
    expect(displayRawInput('bash', { command: 'cat hello.txt', description: 'Show file contents' }, '/ws'))
      .toBe('```sh\n/ws $ cat hello.txt\n```')
  })

  it('renders nameable non-command arguments as a pseudo-command fence with window extras', () => {
    expect(displayRawInput('read', { file_path: 'src/a.ts', offset: 4, limit: 10 }, '/ws'))
      .toBe('```\nread src/a.ts offset=4 limit=10\n```')
    expect(displayRawInput('glob', { pattern: 'src/**/*.ts', path: 'src' }, '/ws'))
      .toBe('```\nglob src/**/*.ts in src\n```')
    expect(displayRawInput('str_replace_editor', { command: 'insert', path: 'a.ts', insert_line: 4, new_str: 'x' }, '/ws'))
      .toBe('```\nstr_replace_editor a.ts insert_line=4\n```')
  })

  it('passes unnameable or unparsable arguments through verbatim', () => {
    expect(displayRawInput('todo_write', { todos: [{ content: 'x' }] }, '/ws'))
      .toEqual({ todos: [{ content: 'x' }] })
    expect(displayRawInput('bash', { cwd: '/tmp' }, '/ws')).toEqual({ cwd: '/tmp' })
  })

  it('names a description-only command call from its description (like the title)', () => {
    expect(displayRawInput('bash', { command: '', description: 'x' }, '/ws')).toBe('```\nbash x\n```')
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

describe('resultCardText', () => {
  it('keeps only the <content> body of a read result envelope', () => {
    const envelope = '<path>/ws/a.ts</path>\n<type>file</type>\n<content>\n1: hello\n2: world\n\n(Showing lines 1-2 of 2.)\n</content>'
    expect(resultCardText('read', envelope)).toBe('1: hello\n2: world\n\n(Showing lines 1-2 of 2.)')
  })

  it('passes through non-read results and read shapes without a content envelope', () => {
    expect(resultCardText('bash', 'hello')).toBe('hello')
    expect(resultCardText('read', 'no envelope here')).toBe('no envelope here')
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
