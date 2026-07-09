import { products } from "@/data/products";
import type { Product } from "@/types";

export function excludeSlugs(list: Product[], slugs: string[]): Product[] {
  const exclude = new Set(slugs);
  return list.filter((p) => !exclude.has(p.slug));
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getNewArrivals(limit = 8): Product[] {
  return products.filter((p) => p.newArrival).slice(0, limit);
}

export function getBestSellers(limit = 8): Product[] {
  return products
    .filter((p) => p.featured || p.newArrival)
    .slice(0, limit);
}

export function getTrendingProducts(limit = 8): Product[] {
  return [...products]
    .sort((a, b) => {
      const score = (p: Product) =>
        (p.featured ? 2 : 0) + (p.newArrival ? 1 : 0);
      return score(b) - score(a);
    })
    .slice(0, limit);
}

export function getRecentlyPurchasedPlaceholder(limit = 4): Product[] {
  return getBestSellers(limit);
}

export function getFrequentlyBoughtTogether(
  product: Product,
  limit = 3
): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.material === product.material)
    )
    .slice(0, limit);
}
