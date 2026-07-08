import {
  getFrameLabel,
  getProduct360Frames,
} from "@/lib/product360Frames";

export const VIEW_360_ORDER = ["front", "side", "top", "bottom"] as const;

export type View360Id = (typeof VIEW_360_ORDER)[number] | `f${number}`;

export interface View360 {
  id: string;
  label: string;
  src: string;
}

export function getImageBasename(src: string): string {
  const filename = src.split("/").pop() ?? "";
  return filename.replace(/\.[^.]+$/i, "").toLowerCase();
}

/**
 * Extract rotation frames for legacy consumers (View360 shape).
 * Returns null if fewer than 2 frames are available.
 */
export function get360Views(images: string[]): View360[] | null {
  const { rotationFrames } = getProduct360Frames(images);
  if (rotationFrames.length < 2) return null;

  return rotationFrames.map((src, index) => ({
    id: getImageBasename(src),
    label: getFrameLabel(src, index),
    src,
  }));
}

/** Images that are not part of the 360 rotation set (main, lifestyle, etc.). */
export function getSupplementaryImages(
  images: string[],
  views360: View360[] | null
): string[] {
  if (!views360) return images;
  return getProduct360Frames(images).supplementaryImages;
}

export function find360ViewIndex(views: View360[], src: string): number {
  return views.findIndex((v) => v.src === src);
}

export { getProduct360Frames, has360Rotation } from "@/lib/product360Frames";
export { getViewerFrames, getFrameLabel } from "@/lib/viewerFrames";
