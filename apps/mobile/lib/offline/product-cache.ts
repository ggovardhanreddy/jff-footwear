import { products } from "@jff/shared/products";
import type { Product } from "@jff/types";
import { storageKeys } from "@jff/hooks";
import { getJson, setJson } from "@/lib/storage";

/** Lightweight product snapshot for offline wishlist / search */
export type OfflineProductSnapshot = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "gender"
  | "category"
  | "material"
  | "color"
  | "sizes"
  | "images"
  | "featured"
  | "newArrival"
  | "description"
>;

function toSnapshot(product: Product): OfflineProductSnapshot {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    gender: product.gender,
    category: product.category,
    material: product.material,
    color: product.color,
    sizes: product.sizes,
    images: product.images,
    featured: product.featured,
    newArrival: product.newArrival,
    description: product.description,
  };
}

export function getOfflineCatalog(): OfflineProductSnapshot[] {
  return getJson<OfflineProductSnapshot[]>(storageKeys.offlineProducts, []);
}

export function seedOfflineCatalog(): void {
  const existing = getOfflineCatalog();
  if (existing.length > 0) return;
  setJson(storageKeys.offlineProducts, products.map(toSnapshot));
}

export function getOfflineProductBySlug(slug: string): OfflineProductSnapshot | undefined {
  return getOfflineCatalog().find((p) => p.slug === slug);
}

export function touchOfflineProduct(product: Product): void {
  const catalog = getOfflineCatalog();
  const snapshot = toSnapshot(product);
  const idx = catalog.findIndex((p) => p.slug === product.slug);
  if (idx >= 0) {
    catalog[idx] = snapshot;
  } else {
    catalog.push(snapshot);
  }
  setJson(storageKeys.offlineProducts, catalog);
}
