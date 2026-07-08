import { getImageBasename } from "@/lib/productViews";
import { getProduct360Frames } from "./product360Frames";

export { getProduct360Frames, has360Rotation } from "./product360Frames";

/** Images used by Product360Viewer — prefers ordered 360 frames, falls back to full list. */
export function getViewerFrames(images: string[]): {
  frames: string[];
  defaultIndex: number;
  isSpinSequence: boolean;
} {
  if (images.length === 0) {
    return { frames: [], defaultIndex: 0, isSpinSequence: false };
  }

  const frameSet = getProduct360Frames(images);
  if (frameSet.rotationFrames.length >= 2) {
    return {
      frames: frameSet.rotationFrames,
      defaultIndex: frameSet.defaultIndex,
      isSpinSequence: true,
    };
  }

  if (images.length >= 2) {
    return { frames: images, defaultIndex: 0, isSpinSequence: false };
  }

  return { frames: [images[0]], defaultIndex: 0, isSpinSequence: false };
}

export function getFrameLabel(src: string, index: number): string {
  const base = getImageBasename(src);
  if (/^r\d{2}$/.test(base)) return `${index * 10}°`;
  if (/^f\d+$/.test(base)) return `Angle ${index + 1}`;
  if (base === "front") return "Front";
  if (base === "back") return "Back";
  if (base === "left" || base === "side") return "Side";
  if (base === "right") return "Right";
  if (base === "top") return "Top";
  if (base === "bottom") return "Bottom";
  return `Image ${index + 1}`;
}
