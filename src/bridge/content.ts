// Prompt content admission and projection: text / resource_link / raster
// images -> durable dsh messages (docs/design.zh.md §3.2). Validation is pure
// and unit-testable; durable image persistence delegates to the shared
// attachment store (dsh-attachment) so the batch limits, media-type checks,
// normalization, and ordering run in one place. A rejected batch never
// persists any object.
import type { ContentBlock as AcpContentBlock } from '@agentclientprotocol/sdk'
import type { AttachmentStore, ImageAttachmentRef, SaveImageAttachment } from '@deepseek-ai/dsh-attachment'
import { isImageAdmissionError } from '@deepseek-ai/dsh-attachment'

/**
 * The attachment service the bridge uses: its advertised image limits gate
 * prompt capability and its store persists the decoded batch. Both faces
 * (limit probe in index.ts, save in persistImages) share this one seam.
 */
export type AttachmentStoreSeam = Pick<AttachmentStore, 'saveImages'> & {
  readonly imageLimits: { readonly mediaTypes: readonly string[] }
}

/** Raster formats shared by ACP image blocks and dsh's attachment store. */
export const IMAGE_MEDIA_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'] as const

export type MediaType = (typeof IMAGE_MEDIA_TYPES)[number]

export function isImageMediaType(mimeType: string): mimeType is MediaType {
  return (IMAGE_MEDIA_TYPES as readonly string[]).includes(mimeType)
}

/**
 * Canonical RFC 4648 base64: whitespace and URL-safe aliases rejected before
 * the durable admission call, so wire bytes never reach the store uncleaned.
 */
export const CANONICAL_BASE64 =
  /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/

/** Error with a stable request-failure category (wire error mapping). */
export class AcpContentError extends Error {
  /** 'invalid' -> invalidParams on the wire; 'internal' -> internalError. */
  readonly kind: 'invalid' | 'internal'
  constructor(message: string, kind: 'invalid' | 'internal', options?: ErrorOptions) {
    super(message, options)
    this.name = 'AcpContentError'
    this.kind = kind
  }
}

/** One admitted raster image, decoded and canonicalized for the store. */
export interface AdmittedImage {
  mediaType: MediaType
  data: Uint8Array
}

function decodeImage(block: Extract<AcpContentBlock, { type: 'image' }>): AdmittedImage {
  if (!isImageMediaType(block.mimeType)) {
    throw new AcpContentError('image mimeType must be image/png, image/jpeg, image/webp, or image/gif', 'invalid')
  }
  const mediaType = block.mimeType
  if (!CANONICAL_BASE64.test(block.data)) throw new AcpContentError('image data must be canonical base64', 'invalid')
  const data = Buffer.from(block.data, 'base64')
  return { mediaType, data }
}

/** Render one baseline resource link into the core's current text vocabulary. */
export function resourceLinkText(block: Extract<AcpContentBlock, { type: 'resource_link' }>): string {
  return `\n[resource_link name=${JSON.stringify(block.name)} uri=${JSON.stringify(block.uri)}]\n`
}

/**
 * Graceful degradation of one embedded resource into plain prompt text (the
 * pi-acp approach): a text resource contributes its body inline; a blob or an
 * unknown payload contributes only a marker, so a client that ignored the
 * `embeddedContext: false` advertisement still gets its context through
 * instead of the whole prompt failing.
 */
export function resourceText(block: Extract<AcpContentBlock, { type: 'resource' }>): string {
  const resource = block.resource as { uri?: unknown; text?: unknown; blob?: unknown; mimeType?: unknown }
  const uri = typeof resource.uri === 'string' ? resource.uri : '(unknown)'
  if (typeof resource.text === 'string') {
    const mime = typeof resource.mimeType === 'string' ? resource.mimeType : 'text/plain'
    return `\n[embedded context ${uri} (${mime})]\n${resource.text}\n`
  }
  if (typeof resource.blob === 'string') {
    const mime = typeof resource.mimeType === 'string' ? resource.mimeType : 'application/octet-stream'
    const bytes = Buffer.byteLength(resource.blob, 'base64')
    return `\n[embedded context ${uri} (${mime}, ${bytes} bytes, not decoded)]\n`
  }
  return `\n[embedded context ${uri}]\n`
}

/**
 * Validate one ACP prompt in wire order and return its decoded images in
 * wire order. text/resource_link pass through; embedded resources degrade to
 * plain text (see resourceText) even though the capability is not advertised,
 * so a client that sends one anyway does not lose its prompt; audio stays the
 * only hard rejection. Every block is validated before any image write
 * starts, so a rejected batch persists nothing.
 */
export function scanPrompt(prompt: readonly AcpContentBlock[], imageEnabled: boolean): AdmittedImage[] {
  const images: AdmittedImage[] = []
  for (const block of prompt) {
    switch (block.type) {
      case 'text':
      case 'resource_link':
      case 'resource':
        break
      case 'image':
        if (!imageEnabled) throw new AcpContentError('inline image prompts were not advertised by this connection', 'invalid')
        images.push(decodeImage(block))
        break
      case 'audio':
        throw new AcpContentError('audio prompt content is not supported', 'invalid')
      default:
        throw new AcpContentError('unsupported ACP prompt content', 'invalid')
    }
  }
  return images
}

/**
 * Persist one decoded image batch through the shared attachment store.
 * Admission rejects map to invalid params, storage faults stay internal, and
 * cancellation never queues a late message.
 */
export async function persistImages(
  attachments: AttachmentStoreSeam,
  images: readonly AdmittedImage[],
  signal: AbortSignal,
): Promise<readonly ImageAttachmentRef[]> {
  signal.throwIfAborted()
  const inputs: SaveImageAttachment[] = images.map((image) => ({ mediaType: image.mediaType, data: image.data }))
  try {
    const refs = await attachments.saveImages(inputs)
    signal.throwIfAborted()
    return refs
  } catch (error: unknown) {
    if (isImageAdmissionError(error)) {
      throw new AcpContentError((error as Error).message, 'invalid', { cause: error })
    }
    throw new AcpContentError('unable to persist the prompt image batch', 'internal', { cause: error })
  }
}

/** Projected dsh user-content block (text segments + durable image refs). */
export type PromptContent = { type: 'text'; text: string } | { type: 'image'; attachment: ImageAttachmentRef }

/**
 * Rebuild the ordered content for one user message: text and resource links
 * stay text (concatenated in order); each image becomes an ImageBlock backed
 * by its durable reference (the harness's request projection resolves images
 * for the exact model route). Empty prompts are rejected here.
 */
export function contentForPrompt(
  prompt: readonly AcpContentBlock[],
  imageRefs: readonly ImageAttachmentRef[],
): PromptContent[] {
  const content: PromptContent[] = []
  let pendingText = ''
  const flushText = () => {
    if (pendingText.length === 0) return
    content.push({ type: 'text', text: pendingText })
    pendingText = ''
  }
  let imageIndex = 0
  for (const block of prompt) {
    switch (block.type) {
      case 'text':
        pendingText += block.text
        break
      case 'resource_link':
        pendingText += resourceLinkText(block)
        break
      case 'resource':
        pendingText += resourceText(block)
        break
      case 'image': {
        flushText()
        content.push({ type: 'image', attachment: imageRefs[imageIndex++]! })
        break
      }
      default:
        break // scanPrompt rejected everything else before reconstruction
    }
  }
  flushText()
  if (!content.some((block) => block.type === 'image' || (block.type === 'text' && block.text.trim().length > 0))) {
    throw new AcpContentError('empty prompt', 'invalid')
  }
  return content
}
