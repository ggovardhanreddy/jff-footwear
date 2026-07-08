export const VIEW_360_ORDER = ["front", "side", "top", "bottom"] as const;

export type View360Id = (typeof VIEW_360_ORDER)[number] | `f${number}`;

export interface View360 {
  id: string;
  label: string;
  src: string;
}

const VIEW_LABELS: Record<View360Id, string> = {
  front: "Front",
  side: "Side",
  top: "Top",
  bottom: "Bottom",
};

export function getImageBasename(src: string): string {
  const filename = src.split("/").pop() ?? "";
  return filename.replace(/\.[^.]+$/i, "").toLowerCase();
}

function getNamedAngleViews(images: string[]): View360[] {
  const views: View360[] = [];

  for (const id of VIEW_360_ORDER) {
    const src = images.find((img) => getImageBasename(img) === id);
    if (src) {
      views.push({ id, label: VIEW_LABELS[id], src });
    }
  }

  return views;
}

/** F1.png, F2.png, … sequences used by real product photography folders. */
function getNumberedFrameViews(images: string[]): View360[] {
  const frames = images
    .map((src) => {
      const match = getImageBasename(src).match(/^f(\d+)$/);
      if (!match) return null;
      return { num: Number(match[1]), src };
    })
    .filter((frame): frame is { num: number; src: string } => frame !== null)
    .sort((a, b) => a.num - b.num);

  return frames.map((frame, index) => ({
    id: `f${frame.num}`,
    label: frames.length <= 4 ? `Angle ${index + 1}` : `Frame ${index + 1}`,
    src: frame.src,
  }));
}

/**
 * Extract front / side / top / bottom or numbered F-frame images for fake 360 rotation.
 * Returns null if fewer than 2 angle views are found.
 */
export function get360Views(images: string[]): View360[] | null {
  const namedViews = getNamedAngleViews(images);
  if (namedViews.length >= 2) return namedViews;

  const numberedViews = getNumberedFrameViews(images);
  if (numberedViews.length >= 3) return numberedViews;

  return null;
}

/** Images that are not part of the 360 rotation set (main, lifestyle, etc.). */
export function getSupplementaryImages(
  images: string[],
  views360: View360[] | null
): string[] {
  if (!views360) return images;

  const rotateSrcs = new Set(views360.map((v) => v.src));
  return images.filter((img) => !rotateSrcs.has(img));
}

export function find360ViewIndex(views: View360[], src: string): number {
  return views.findIndex((v) => v.src === src);
}
