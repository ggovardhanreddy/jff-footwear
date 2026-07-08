import { getImageBasename } from "@/lib/productViews";

/** Horizontal rotation sequence for premium product photography. */
export const HORIZONTAL_ROTATION_ORDER = [
  "front",
  "front-left",
  "left",
  "back-left",
  "back",
  "back-right",
  "right",
  "front-right",
] as const;

const SUPPLEMENTARY_BASENAMES = new Set([
  "main",
  "lifestyle",
  "lifestyle-1",
  "lifestyle-2",
  "lifestyle-3",
  "detail",
  "hero",
]);

export interface Product360FrameSet {
  /** Ordered frames used for drag / auto rotation. */
  rotationFrames: string[];
  /** Index of the default frame (front when available). */
  defaultIndex: number;
  /** Images excluded from the rotation loop (lifestyle, main, top, bottom, etc.). */
  supplementaryImages: string[];
}

function extractByBasenames(
  images: string[],
  order: readonly string[]
): string[] {
  const frames: string[] = [];
  for (const name of order) {
    const src = images.find((img) => getImageBasename(img) === name);
    if (src) frames.push(src);
  }
  return frames;
}

/** r01–r36 spin sequences (10° per frame). Highest priority for smooth 360°. */
function extractSpinFrames(images: string[]): string[] {
  const frames = images
    .map((src) => {
      const match = getImageBasename(src).match(/^r(\d{2})$/);
      if (!match) return null;
      return { num: Number(match[1]), src };
    })
    .filter((frame): frame is { num: number; src: string } => frame !== null)
    .sort((a, b) => a.num - b.num)
    .map((frame) => frame.src);

  return frames.length >= 12 ? frames : [];
}

function extractNumberedFrames(images: string[]): string[] {
  return images
    .map((src) => {
      const match = getImageBasename(src).match(/^f(\d+)$/);
      if (!match) return null;
      return { num: Number(match[1]), src };
    })
    .filter((frame): frame is { num: number; src: string } => frame !== null)
    .sort((a, b) => a.num - b.num)
    .map((frame) => frame.src);
}

function extractSimpleRotation(images: string[]): string[] {
  const order = ["front", "side"];
  return extractByBasenames(images, order);
}

function isSupplementaryBasename(name: string): boolean {
  if (SUPPLEMENTARY_BASENAMES.has(name)) return true;
  if (name === "top" || name === "bottom") return true;
  return name.startsWith("lifestyle");
}

/**
 * Build an ordered 360 frame set from a product image list.
 * Supports full 8-angle sets, F1–Fn sequences, and legacy front/side pairs.
 */
export function getProduct360Frames(images: string[]): Product360FrameSet {
  if (images.length === 0) {
    return { rotationFrames: [], defaultIndex: 0, supplementaryImages: [] };
  }

  const spin = extractSpinFrames(images);
  const horizontal = extractByBasenames(images, HORIZONTAL_ROTATION_ORDER);
  const numbered = extractNumberedFrames(images);
  const simple = extractSimpleRotation(images);

  let rotationFrames: string[] = [];

  if (spin.length >= 12) {
    rotationFrames = spin;
  } else if (horizontal.length >= 3) {
    rotationFrames = horizontal;
  } else if (numbered.length >= 3) {
    rotationFrames = numbered;
  } else if (simple.length >= 2) {
    rotationFrames = simple;
  } else if (numbered.length >= 2) {
    rotationFrames = numbered;
  } else if (horizontal.length >= 2) {
    rotationFrames = horizontal;
  } else {
    const candidates = images.filter(
      (src) => !isSupplementaryBasename(getImageBasename(src))
    );
    rotationFrames = candidates.length >= 2 ? candidates : images;
  }

  const rotateSet = new Set(rotationFrames);
  const supplementaryImages = images.filter((src) => !rotateSet.has(src));

  const frontIndex = rotationFrames.findIndex(
    (src) => getImageBasename(src) === "front"
  );
  const defaultIndex = frontIndex >= 0 ? frontIndex : 0;

  return { rotationFrames, defaultIndex, supplementaryImages };
}

export function has360Rotation(images: string[]): boolean {
  return getProduct360Frames(images).rotationFrames.length >= 2;
}

export function getFrameLabel(src: string, index: number): string {
  const base = getImageBasename(src);
  const horizontalLabel = HORIZONTAL_ROTATION_ORDER.find((name) => name === base);
  if (horizontalLabel) {
    return horizontalLabel
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  }
  if (base === "side") return "Side";
  if (base === "top") return "Top";
  if (base === "bottom") return "Bottom";
  if (/^f\d+$/.test(base)) return `Angle ${index + 1}`;
  if (/^r\d{2}$/.test(base)) return `${index * 10}°`;
  return `Frame ${index + 1}`;
}
