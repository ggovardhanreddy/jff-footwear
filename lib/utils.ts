import type {
  Product,
  ProductFilters,
  SortOption,
  ColorVariant,
  ProductSpecification,
} from "@/types";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { getProductPricing } from "@/lib/pricing";
import { getGalleryImages } from "@/lib/productViews";
import { DEFAULT_OG_IMAGE, SOLD_OUT_IMAGE } from "@/lib/paths";

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function filterProducts(
  products: Product[],
  filters: ProductFilters
): Product[] {
  let result = [...products];

  if (filters.search) {
    const query = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.material.toLowerCase().includes(query) ||
        p.gender.toLowerCase().includes(query) ||
        p.color.toLowerCase().includes(query)
    );
  }

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }

  if (filters.material) {
    result = result.filter((p) => p.material === filters.material);
  }

  if (filters.gender) {
    result = result.filter((p) => p.gender === filters.gender);
  }

  if (filters.color) {
    result = result.filter((p) => p.color === filters.color);
  }

  if (filters.size !== "") {
    result = result.filter((p) => p.sizes.includes(filters.size as number));
  }

  if (filters.featured) {
    result = result.filter((p) => p.featured);
  }

  if (filters.newArrival) {
    result = result.filter((p) => p.newArrival);
  }

  if (filters.trending) {
    result = result.filter(
      (p) => p.featured || p.newArrival
    );
  }

  if (filters.minPrice !== "") {
    const min = Number(filters.minPrice);
    result = result.filter(
      (p) => getProductPricing(p).sellingPrice >= min
    );
  }

  if (filters.maxPrice !== "") {
    const max = Number(filters.maxPrice);
    result = result.filter(
      (p) => getProductPricing(p).sellingPrice <= max
    );
  }

  return sortProducts(result, filters.sort);
}

export function sortProducts(
  products: Product[],
  sort: SortOption
): Product[] {
  const sorted = [...products];

  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
    case "featured":
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    case "trending":
      return sorted.sort((a, b) => {
        const score = (p: Product) =>
          (p.featured ? 2 : 0) + (p.newArrival ? 1 : 0);
        return score(b) - score(a);
      });
    case "price-low":
      return sorted.sort(
        (a, b) =>
          getProductPricing(a).sellingPrice - getProductPricing(b).sellingPrice
      );
    case "price-high":
      return sorted.sort(
        (a, b) =>
          getProductPricing(b).sellingPrice - getProductPricing(a).sellingPrice
      );
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return sorted;
  }
}

export function getProductBySlug(
  products: Product[],
  slug: string
): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(
  products: Product[],
  product: Product,
  limit = 4
): Product[] {
  return products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category ||
          p.gender === product.gender ||
          p.material === product.material)
    )
    .slice(0, limit);
}

export function getColorVariants(
  products: Product[],
  product: Product
): ColorVariant[] {
  const variants = products.filter(
    (p) =>
      p.gender === product.gender &&
      p.category === product.category &&
      p.material === product.material &&
      p.color !== "Standard"
  );

  const seen = new Set<string>();
  return variants
    .filter((p) => {
      if (seen.has(p.color)) return false;
      seen.add(p.color);
      return true;
    })
    .map((p) => ({
      color: p.color,
      slug: p.slug,
      image: p.images[0],
    }));
}

export function getProductFeatures(product: Product): string[] {
  return [
    `Premium ${product.material} construction`,
    "Ergonomic footbed for all-day comfort",
    "Anti-slip sole with superior grip",
    "Lightweight and durable design",
    product.category === "Orthopedic"
      ? "Arch support for therapeutic comfort"
      : "Breathable design for daily wear",
    "Available in multiple sizes",
    "Suitable for wholesale and retail orders",
  ];
}

export function getProductSpecifications(
  product: Product
): ProductSpecification[] {
  return [
    { label: "Brand", value: "JFF Footwear" },
    { label: "Gender", value: product.gender },
    { label: "Category", value: product.category },
    { label: "Material", value: product.material },
    {
      label: "Color",
      value: product.color !== "Standard" ? product.color : "Multi",
    },
    { label: "Available Sizes", value: product.sizes.join(", ") },
    { label: "Sole Type", value: "Anti-slip textured" },
    { label: "Care", value: "Wipe clean with damp cloth" },
    { label: "Origin", value: "Made in India" },
  ];
}

export function buildWhatsAppUrl(params: {
  productName: string;
  gender: string;
  category: string;
  material: string;
  color: string;
  size: number;
  quantity: number;
}): string {
  const message = [
    "Hello JFF,",
    "",
    "I am interested in",
    "",
    `Product: ${params.productName}`,
    `Category: ${params.category}`,
    `Material: ${params.material}`,
    `Color: ${params.color}`,
    `Size: ${params.size}`,
    `Quantity: ${params.quantity}`,
    "",
    "Please share pricing.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function cn(
  ...classes: (string | boolean | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function getProductMainImage(product: Product): string {
  const gallery = getGalleryImages(product.images);
  if (gallery.length === 0) return SOLD_OUT_IMAGE;

  const main =
    gallery.find((img) => /main\./i.test(img)) ||
    gallery.find((img) => /front\./i.test(img)) ||
    gallery[0];
  return main || SOLD_OUT_IMAGE;
}

export function productHasDisplayImages(images: string[]): boolean {
  return getGalleryImages(images).length > 0;
}

export async function shareProduct(
  product: Product,
  url: string
): Promise<void> {
  const shareData = {
    title: product.name,
    text: product.description,
    url,
  };

  if (typeof navigator !== "undefined" && navigator.share) {
    await navigator.share(shareData);
    return;
  }

  if (typeof navigator !== "undefined" && navigator.clipboard) {
    await navigator.clipboard.writeText(url);
  }
}
