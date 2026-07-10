import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HomePageSkeleton } from "@/components/cinematic/HomePageSkeleton";
import { products, getFeaturedProducts } from "@/data";
import { features } from "@/data/content";
import { MATERIAL_INFO } from "@/lib/constants";
import { createMetadata } from "@/lib/seo";
import { getProductMainImage } from "@/lib/utils";
import type { ProductColor } from "@/types";

const CinematicExperience = dynamic(() => import("@/components/cinematic/CinematicExperience"), {
  loading: () => <HomePageSkeleton />,
});

export const metadata: Metadata = createMetadata({
  title: "Brand Experience",
  description:
    "Immersive JFF brand story — materials, comfort, and craftsmanship behind every slipper.",
  path: "/brand",
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

export default function BrandPage() {
  const featured = getFeaturedProducts();
  const heroProduct =
    products.find((p) => p.slug === "jff-001") ||
    products.find((p) => p.images.some((img) => img.includes("jff-001"))) ||
    featured[0] ||
    products[0];

  if (!heroProduct) {
    return null;
  }

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
