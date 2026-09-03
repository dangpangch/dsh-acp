// Adapted from the zed-dsh project (https://github.com/dangpangch/zed-dsh, MIT) —
// same-author port into the dsh-acp-interactive bundle. See package LICENSE.
// Prompt content admission and projection: text / resource_link / raster
// images -> durable dsh messages (design.zh.md §6.1 session/prompt, §6.5 识图,
// protocol-map.md §4). Validation is pure and unit-testable; durable image
// persistence delegates to the shared attachment store (dsh-attachment) so the
// batch limits, media-type checks, normalization, and ordering run in one
// place. A rejected batch never persists any object.
import type { ContentBlock as AcpContentBlock } from '@agentclientprotocol/sdk'
import type { AttachmentStore, ImageAttachmentRef, SaveImageAttachment } from '@deepseek-ai/dsh-attachment'
import { isImageAdmissionError } from '@deepseek-ai/dsh-attachment'

/** The one attachment-store operation the bridge uses. */
export type AttachmentStoreSeam = Pick<AttachmentStore, 'saveImages'>

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
  if (data.toString('base64') !== block.data) throw new AcpContentError('image data must be canonical base64', 'invalid')
  return { mediaType, data }
}

/** Render one baseline resource link into the core's current text vocabulary. */
export function resourceLinkText(block: Extract<AcpContentBlock, { type: 'resource_link' }>): string {
  return `\n[resource_link name=${JSON.stringify(block.name)} uri=${JSON.stringify(block.uri)}]\n`
}

/**
 * Validate one ACP prompt in wire order and return its decoded images in
 * wire order. text/resource_link pass through; audio and embedded resources
 * are rejected (never advertised). Every block is validated before any image
 * write starts, so a rejected batch persists nothing.
 */
export function scanPrompt(prompt: readonly AcpContentBlock[], imageEnabled: boolean): AdmittedImage[] {
  const images: AdmittedImage[] = []
  for (const block of prompt) {
    switch (block.type) {
      case 'text':
      case 'resource_link':
        break
      case 'image':
        if (!imageEnabled) throw new AcpContentError('inline image prompts were not advertised by this connection', 'invalid')
        images.push(decodeImage(block))
        break
      case 'audio':
        throw new AcpContentError('audio prompt content is not supported', 'invalid')
      case 'resource':
        throw new AcpContentError('embedded resource prompt content is not supported', 'invalid')
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
