// content: prompt admission and projection (acceptance.md §4 `image-offload`
// baseline: media-type/base64 validation; design.zh.md §6.5). No harness.
import { describe, expect, it } from 'vitest'
import type { ImageAttachmentRef } from '@deepseek-ai/dsh-attachment'
import {
  AcpContentError,
  CANONICAL_BASE64,
  contentForPrompt,
  isImageMediaType,
  resourceLinkText,
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

  it('rejects audio and embedded resources', () => {
    expect(() => scanPrompt([{ type: 'audio', mimeType: 'audio/wav', data: 'AA==' }], false)).toThrowError(/audio/)
    expect(() => scanPrompt([{ type: 'resource', resource: { uri: 'file:///x', text: 'x' } }], false)).toThrowError(/embedded resource/)
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
})
