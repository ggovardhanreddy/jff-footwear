export const VIEW_360_ORDER = ["front", "side", "top", "bottom"] as const;

export type View360Id = (typeof VIEW_360_ORDER)[number];

export interface View360 {
  id: View360Id;
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

/**
 * Extract front / side / top / bottom images for fake 360 rotation.
 * Returns null if fewer than 2 angle views are found.
 */
export function get360Views(images: string[]): View360[] | null {
  const views: View360[] = [];

  for (const id of VIEW_360_ORDER) {
    const src = images.find((img) => getImageBasename(img) === id);
    if (src) {
      views.push({ id, label: VIEW_LABELS[id], src });
    }
  }

  return views.length >= 2 ? views : null;
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
