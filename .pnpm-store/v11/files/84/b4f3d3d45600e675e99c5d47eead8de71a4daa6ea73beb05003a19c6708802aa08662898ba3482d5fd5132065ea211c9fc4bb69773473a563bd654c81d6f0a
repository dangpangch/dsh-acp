/** Shared lazy candidate execution for normalization and request-image encoders. */
/** One encoded candidate carrying its complete bytes. */
export interface EncodedCandidate {
    data: Uint8Array;
}
/** Result of exhausting candidates at one raster size without a fitting output. */
export interface ExhaustedEncoding<T extends EncodedCandidate> {
    smallest: T;
}
/**
 * Execute encoding candidates in preference order and stop after the first fitting output.
 * @param attempts - lazy encoders ordered from preferred to fallback representation.
 * @param maxBytes - positive encoded-byte cap.
 * @returns the first fitting candidate, otherwise the smallest completed fallback.
 */
export declare function encodeFirstWithinLimit<T extends EncodedCandidate>(attempts: readonly (() => Promise<T>)[], maxBytes: number): Promise<T | ExhaustedEncoding<T>>;
/**
 * Whether a lazy encoding result exhausted every candidate at one size.
 * @param result - first fitting candidate or exhausted result.
 * @returns whether every candidate exceeded the byte cap.
 */
export declare function isExhaustedEncoding<T extends EncodedCandidate>(result: T | ExhaustedEncoding<T>): result is ExhaustedEncoding<T>;
//# sourceMappingURL=encoding.d.ts.map