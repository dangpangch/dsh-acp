// content: prompt admission and projection (design.zh.md §3.2 image
// admission; §6.2 offline tests). No harness.
import { describe, expect, it } from 'vitest'
import type { ImageAttachmentRef } from '@deepseek-ai/dsh-attachment'
import {
  AcpContentError,
  CANONICAL_BASE64,
  contentForPrompt,
  isImageMediaType,
  resourceLinkText,
  resourceText,
  scanPrompt,
} from '../src/bridge/content.js'

const PNG_BLOCK = {
  type: 'image' as const,
  mimeType: 'image/png',
  data: Buffer.from('iVBORw0KGgo=', 'base64').toString('base64'),
}

describe('media-type helpers', () => {
  it('accepts the raster vocabulary shared with the attachment store', () => {
    expect(isImageMediaType('image/png')).toBe(true)
    expect(isImageMediaType('image/jpeg')).toBe(true)
    expect(isImageMediaType('image/webp')).toBe(true)
    expect(isImageMediaType('image/gif')).toBe(true)
  })

  it('rejects anything else (svg, avif, octet-stream…)', () => {
    expect(isImageMediaType('image/svg+xml')).toBe(false)
    expect(isImageMediaType('image/avif')).toBe(false)
    expect(isImageMediaType('text/plain')).toBe(false)
  })

  it('accepts only canonical base64 (no whitespace or URL-safe aliases)', () => {
    expect(CANONICAL_BASE64.test('iVBORw0KGgo=')).toBe(true)
    expect(CANONICAL_BASE64.test('iVBORw0KGgo')).toBe(false) // wrong padding
    expect(CANONICAL_BASE64.test('iVBORw0KGgo===')).toBe(false) // extra padding
    expect(CANONICAL_BASE64.test('aGVsbG8=')).toBe(true)
    expect(CANONICAL_BASE64.test('aGVsbG8')).toBe(false) // canonical form requires padding
    expect(CANONICAL_BASE64.test('aGVsbG8=\n')).toBe(false) // whitespace
    expect(CANONICAL_BASE64.test('aGVsbG8-')).toBe(false) // url-safe alias
  })
})

describe('scanPrompt (wire-order validation)', () => {
  it('passes text and resource links through untouched', () => {
    expect(scanPrompt([{ type: 'text', text: 'hi' }], false)).toEqual([])
  })

  it('rejects images when the capability was not advertised', () => {
    expect(() => scanPrompt([PNG_BLOCK], false)).toThrowError(AcpContentError)
  })

  it('decodes an advertised image into a media type + canonical bytes pair', () => {
    const admitted = scanPrompt([PNG_BLOCK], true)
    expect(admitted).toHaveLength(1)
    expect(admitted[0]!.mediaType).toBe('image/png')
  })

  it('rejects non-canonical base64 and unknown media types with invalid-category errors', () => {
    expect(() => scanPrompt([{ ...PNG_BLOCK, data: 'not-base64!!' }], true)).toThrowError(/canonical base64/)
    expect(() => scanPrompt([{ ...PNG_BLOCK, mimeType: 'image/svg+xml' }], true)).toThrowError(/mimeType/)
  })

  it('rejects audio but degrades embedded resources to plain text (no capability needed)', () => {
    expect(() => scanPrompt([{ type: 'audio', mimeType: 'audio/wav', data: 'AA==' }], false)).toThrowError(/audio/)
    // A client that ignored `embeddedContext: false` still gets its context
    // through as text; the prompt never fails on the resource block.
    expect(scanPrompt([
      { type: 'resource', resource: { uri: 'file:///x', text: 'x' } },
    ], false)).toEqual([])
  })
})

describe('contentForPrompt (ordered reconstruction)', () => {
  it('rebuilds text blocks in order, concatenating adjacent text', () => {
    const content = contentForPrompt(
      [{ type: 'text', text: 'a' }, { type: 'text', text: 'b' }],
      [],
    )
    expect(content).toEqual([{ type: 'text', text: 'ab' }])
  })

  it('renders resource links as bracketed text in order', () => {
    const link = { type: 'resource_link' as const, name: 'note', uri: 'file:///n.md' }
    const content = contentForPrompt([{ type: 'text', text: 'see ' }, link], [])
    expect(content[0]).toEqual({ type: 'text', text: `see ${resourceLinkText(link)}` })
  })

  it('places image blocks at their wire position with the matching durable ref', () => {
    const ref = { attachmentId: 'sha256:abc', mediaType: 'image/png', bytes: 8, width: 1, height: 1 } as unknown as ImageAttachmentRef
    const content = contentForPrompt([{ type: 'text', text: 'before' }, PNG_BLOCK, { type: 'text', text: 'after' }], [ref])
    expect(content).toEqual([
      { type: 'text', text: 'before' },
      { type: 'image', attachment: ref },
      { type: 'text', text: 'after' },
    ])
  })

  it('rejects an all-whitespace text prompt as empty', () => {
    expect(() => contentForPrompt([{ type: 'text', text: '   ' }], [])).toThrowError(/empty prompt/)
  })

  it('folds an embedded text resource into the adjacent text segment (pi-acp degradation)', () => {
    const resource = { type: 'resource' as const, resource: { uri: 'file:///notes.md', mimeType: 'text/markdown', text: '# notes' } }
    const content = contentForPrompt([{ type: 'text', text: 'see' }, resource], [])
    expect(content).toEqual([{ type: 'text', text: 'see\n[embedded context file:///notes.md (text/markdown)]\n# notes\n' }])
  })

  it('marks blob and unknown resources instead of dumping decoded bytes', () => {
    const blob = { type: 'resource' as const, resource: { uri: 'file:///bin.dat', mimeType: 'application/octet-stream', blob: Buffer.from('hi').toString('base64') } }
    expect(resourceText(blob)).toBe('\n[embedded context file:///bin.dat (application/octet-stream, 2 bytes, not decoded)]\n')
    // An embedded resource with neither text nor blob keeps its marker (the
    // runtime narrowing tolerates a hand-shaped payload).
    const empty = { type: 'resource', resource: { uri: 'file:///x' } } as unknown as Parameters<typeof resourceText>[0]
    expect(resourceText(empty)).toBe('\n[embedded context file:///x]\n')
  })

  it('keeps a resource-only prompt non-empty (degraded text still counts)', () => {
    const resource = { type: 'resource' as const, resource: { uri: 'file:///x', text: 'body' } }
    expect(contentForPrompt([resource], [])).toEqual([{ type: 'text', text: '\n[embedded context file:///x (text/plain)]\nbody\n' }])
  })
})
