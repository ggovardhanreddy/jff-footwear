import { products } from "@/data";
import { getProductMainImage } from "@/lib/utils";
import type { ProductColor } from "@/types";

/** Preview image from catalog for a given color (never generated placeholders). */
export function getPreviewImageForColor(color: ProductColor): string | null {
  const match = products.find((p) => p.color === color);
  return match ? getProductMainImage(match) : null;
}
