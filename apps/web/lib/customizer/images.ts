import { products } from "@/data";
import { getProductMainImage } from "@/lib/utils";
import type { ProductColor, Gender, ProductCategory, Material } from "@/types";
import type { ProductCustomization } from "@/types/customizer";

const CATALOG_MATERIALS = new Set<Material>(["Rubber", "Memory Foam"]);

function scoreProduct(
  product: (typeof products)[0],
  config: Partial<ProductCustomization>
): number {
  let score = 0;
  if (config.color && product.color === config.color) score += 4;
  if (config.category && product.category === config.category) score += 3;
  if (
    config.gender &&
    (product.gender === config.gender || product.gender === "Unisex")
  )
    score += 2;
  if (
    config.material &&
    CATALOG_MATERIALS.has(product.material) &&
    (config.material === product.material ||
      (config.material === "Rubber" && product.material === "Rubber") ||
      (config.material === "Memory Foam" && product.material === "Memory Foam"))
  )
    score += 2;
  if (product.featured) score += 1;
  return score;
}

/** Best-matching catalog image for the current configuration */
export function getPreviewImage(
  config: Partial<ProductCustomization>
): string | null {
  if (!config.color && !config.category) return null;

  const ranked = [...products]
    .map((p) => ({ p, score: scoreProduct(p, config) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  if (ranked.length > 0) {
    return getProductMainImage(ranked[0].p);
  }

  if (config.color) {
    return getPreviewImageForColor(config.color as ProductColor);
  }

  return null;
}

/** Preview image from catalog for a given color */
export function getPreviewImageForColor(color: ProductColor): string | null {
  const match = products.find((p) => p.color === color);
  return match ? getProductMainImage(match) : null;
}

/** Human-readable preview caption */
export function getPreviewCaption(config: Partial<ProductCustomization>): string {
  const parts: string[] = [];
  if (config.category) parts.push(config.category);
  if (config.material) parts.push(config.material);
  if (config.color) parts.push(config.color);
  if (config.gender) parts.push(config.gender);
  return parts.length > 0 ? parts.join(" · ") : "Configure your slipper";
}

export type { ProductCategory, Gender };
