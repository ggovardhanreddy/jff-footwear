import { collections, type Collection } from "@/data/collections";
import type { Product } from "@/types";
import { getTrendingProducts } from "@/lib/product-sections";

export function getAllCollections(): Collection[] {
  return collections;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getCollectionProducts(
  collection: Collection,
  allProducts: Product[]
): Product[] {
  switch (collection.filter) {
    case "featured":
      return allProducts.filter((p) => p.featured);
    case "newArrivals":
      return allProducts.filter((p) => p.newArrival);
    case "bestSellers":
      return allProducts.filter((p) => p.featured || p.newArrival);
    case "trending": {
      const trending = new Set(getTrendingProducts(24).map((p) => p.id));
      return allProducts.filter((p) => trending.has(p.id));
    }
    case "category":
      return allProducts.filter((p) => p.category === collection.value);
    case "material":
      return allProducts.filter((p) => p.material === collection.value);
    case "gender":
      return allProducts.filter((p) => p.gender === collection.value);
    default:
      return [];
  }
}

export function getCollectionProductCount(
  collection: Collection,
  allProducts: Product[]
): number {
  return getCollectionProducts(collection, allProducts).length;
}
