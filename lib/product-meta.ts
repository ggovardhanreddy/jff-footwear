import { products } from "@/data/products";
import type { Material, ProductCategory } from "@/types";

const bySlug = new Map(products.map((p) => [p.slug, p]));

export interface ProductMeta {
  material: Material;
  category: ProductCategory;
}

export function getProductMetaBySlug(slug: string): ProductMeta | null {
  const product = bySlug.get(slug);
  if (!product) return null;
  return {
    material: product.material,
    category: product.category,
  };
}
