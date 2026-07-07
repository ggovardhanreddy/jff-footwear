import type { Product } from "@/types";
import { products } from "./products";

export { products };

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getLatestProducts(limit = 8): Product[] {
  return products.filter((p) => p.newArrival).slice(0, limit);
}

export function getProductCountByCategory(categoryName: string): number {
  return products.filter(
    (p) => p.category === categoryName || p.gender === categoryName
  ).length;
}

export function getProductCountByMaterial(material: string): number {
  return products.filter((p) => p.material === material).length;
}

export function getGalleryImages(limit = 24): string[] {
  const images: string[] = [];
  for (const product of products) {
    const main =
      product.images.find((img) => /main\./i.test(img)) || product.images[0];
    if (main) images.push(main);
    if (images.length >= limit) break;
  }
  return images;
}

export function getUniqueFilterValues() {
  const categories = new Set<string>();
  const materials = new Set<string>();
  const genders = new Set<string>();
  const colors = new Set<string>();
  const sizes = new Set<number>();

  for (const product of products) {
    categories.add(product.category);
    materials.add(product.material);
    genders.add(product.gender);
    if (product.color !== "Standard") colors.add(product.color);
    product.sizes.forEach((s) => sizes.add(s));
  }

  return {
    categories: Array.from(categories).sort(),
    materials: Array.from(materials).sort(),
    genders: Array.from(genders).sort(),
    colors: Array.from(colors).sort(),
    sizes: Array.from(sizes).sort((a, b) => a - b),
  };
}
