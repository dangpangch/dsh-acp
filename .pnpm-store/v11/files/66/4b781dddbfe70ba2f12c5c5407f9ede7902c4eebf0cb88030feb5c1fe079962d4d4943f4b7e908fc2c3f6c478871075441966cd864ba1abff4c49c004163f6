/** Deterministic provider-independent image normalization. */
import { type Sharp } from 'sharp';
import type { ImageMediaType } from '@deepseek-ai/dsh-attachment';
import type { DetectedImage } from './image.ts';
/** Deployment-resolved policy for the persisted normalized attachment. */
export interface NormalizationPolicy {
    /** Long-edge cap in pixels; larger sources are downscaled proportionally. */
    maxDimension: number;
    /** Independent safety cap for encoded normalized image bytes. */
    maxBytes: number;
}
/** Normalized bytes beside the facts recorded by a durable reference. */
export interface NormalizedImage {
    data: Uint8Array;
    mediaType: ImageMediaType;
    width: number;
    height: number;
}
/**
 * Whether bytes already satisfy the normalization requirements.
 * @param detected - fully decoded source facts.
 * @param bytes - encoded source length.
 * @param policy - resolved normalization limits.
 * @returns whether the source can pass through byte-identically.
 */
export declare function canPassThroughNormalization(detected: DetectedImage, bytes: number, policy: NormalizationPolicy): boolean;
/**
 * Classify a bounded pixel sample without assuming that a PNG source is a screenshot.
 * @param pipeline - oriented sRGB source pipeline before output resizing.
 * @returns whether the nearest-neighbour sample stays within the low-color threshold.
 */
export declare function hasLowColourCount(pipeline: Sharp): Promise<boolean>;
/**
 * Produce the persisted provider-independent normalized version of one fully decoded source.
 * The source is passed through only when it is already clean, single-frame, 8-bit sRGB/sRGBA,
 * and inside both normalization limits. Re-encoding never removes transparency. After the fixed
 * quality floor is reached, dimensions continue shrinking until the independent byte cap holds.
 * @param data - complete admitted source bytes.
 * @param detected - fully decoded source facts.
 * @param policy - resolved independent normalization limits.
 * @returns verified provider-independent normalized bytes and metadata.
 */
export declare function normalizeImage(data: Uint8Array, detected: DetectedImage, policy: NormalizationPolicy): Promise<NormalizedImage>;
//# sourceMappingURL=normalization.d.ts.map