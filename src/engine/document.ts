export type Adjustments = {
  exposure: number;
  brightness: number;
  contrast: number;
  saturation: number;
  warmth: number;
};

export type ImageDocument = {
  id: string;
  name: string;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  adjustments: Adjustments;
  preservation: "locked";
};

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  exposure: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  warmth: 0
};

export function createImageDocument(
  file: File,
  originalUrl: string,
  width: number,
  height: number
): ImageDocument {
  return {
    id: crypto.randomUUID(),
    name: file.name,
    originalUrl,
    originalWidth: width,
    originalHeight: height,
    adjustments: { ...DEFAULT_ADJUSTMENTS },
    preservation: "locked"
  };
}

/** CSS preview adjustments are non-destructive; the original URL is never replaced. */
export function adjustmentFilter(a: Adjustments): string {
  const exposureFactor = Math.pow(2, a.exposure / 100);
  const brightness = Math.max(0, a.brightness * exposureFactor);
  return `brightness(${brightness}%) contrast(${a.contrast}%) saturate(${a.saturation}%) sepia(${Math.max(0, a.warmth) / 300})`;
}

/** The original product source must remain byte-for-byte available for reset/export. */
export function canReplaceOriginalSource(): false {
  return false;
}