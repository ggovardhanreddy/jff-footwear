import type { Metadata } from "next";
import CinematicExperience from "@/components/cinematic/CinematicExperience";
import { products, getFeaturedProducts } from "@/data";
import { features } from "@/data/content";
import { MATERIAL_INFO } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { getProductMainImage } from "@/lib/utils";
import type { ProductColor } from "@/types";

export const metadata: Metadata = createMetadata({
  title: "Premium Slippers Manufacturer",
  description:
    "JFF Footwear — Indian slipper manufacturer based in Rayachoty, Andhra Pradesh. Comfortable, durable footwear for men, women, kids, and unisex. Retail and wholesale.",
  path: "/",
  keywords: [
    "premium slippers",
    "footwear manufacturer India",
    "wholesale slippers",
    "luxury flip flops",
  ],
});

function buildColorShowcase() {
  const seen = new Set<string>();
  const items: {
    color: ProductColor;
    image: string;
    slug: string;
    name: string;
  }[] = [];

  for (const product of products) {
    if (product.color === "Standard" || seen.has(product.color)) continue;
    seen.add(product.color);
    items.push({
      color: product.color,
      image: getProductMainImage(product),
      slug: product.slug,
      name: product.name,
    });
    if (items.length >= 8) break;
  }

  return items;
}

function buildMaterialShowcase() {
  return MATERIAL_INFO.map((material) => {
    const product = products.find((p) => p.material === material.name);
    return {
      id: material.id,
      name: material.name,
      description: material.description,
      image: product ? getProductMainImage(product) : "/images/hero-banner.svg",
      slug: product?.slug ?? "products",
    };
  });
}

export default function HomePage() {
  const featured = getFeaturedProducts();

  if (products.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="heading-display">No products found</h1>
        <p className="text-body mt-4 max-w-md">
          Run{" "}
          <code className="rounded bg-black/5 px-2 py-1 text-sm">
            npm run generate
          </code>{" "}
          then restart the dev server.
        </p>
      </div>
    );
  }

  const heroProduct =
    products.find((p) => p.slug === "jff-001") ||
    products.find((p) => p.images.some((img) => img.includes("jff-001"))) ||
    featured[0] ||
    products[0];

  const comfortProduct =
    products.find((p) => p.category === "Orthopedic" && p.featured) ||
    products.find((p) => p.material === "Memory Foam") ||
    heroProduct;

  const showcaseProduct =
    products.find((p) => p.slug === "jff-001") ||
    products.find((p) => p.images.length >= 4) ||
    heroProduct;

  return (
    <CinematicExperience
      heroProduct={heroProduct}
      comfortProduct={comfortProduct}
      showcaseProduct={showcaseProduct}
      galleryProducts={featured.slice(0, 8)}
      materials={buildMaterialShowcase()}
      colors={buildColorShowcase()}
      features={features}
    />
  );
}
