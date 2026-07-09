import { products } from "@jff/shared/products";
import type { Product } from "@jff/types";
import { getOfflineProductBySlug } from "@/lib/offline/product-cache";

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  const bundled = products.find((p) => p.slug === slug);
  if (bundled) return bundled;
  const cached = getOfflineProductBySlug(slug);
  return cached as Product | undefined;
}

export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.gender.toLowerCase().includes(q) ||
      p.material.toLowerCase().includes(q) ||
      p.color.toLowerCase().includes(q)
  );
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
}

export function getFeaturedProducts(limit = 8): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}
