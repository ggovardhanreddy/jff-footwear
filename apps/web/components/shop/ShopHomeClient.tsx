"use client";

import { useState } from "react";
import ProductCard from "@/components/products/ProductCard";
import { QuickViewModal } from "@/components/features";
import Newsletter from "@/components/Newsletter";
import ImmersiveHero from "@/components/home/ImmersiveHero";
import CategoryStage, { type CategoryCard } from "@/components/home/CategoryStage";
import BrandDepth from "@/components/home/BrandDepth";
import BestSellersCarousel from "@/components/home/BestSellersCarousel";
import ShopByStyle, { type StyleCard } from "@/components/home/ShopByStyle";
import WhyJff from "@/components/home/WhyJff";
import WholesaleBand from "@/components/home/WholesaleBand";
import ReviewsBand from "@/components/home/ReviewsBand";
import SectionIntro from "@/components/home/SectionIntro";
import { getProductMainImage } from "@/lib/utils";
import type { Product } from "@/types";

type ShopHomeClientProps = {
  products: Product[];
};

export default function ShopHomeClient({ products }: ShopHomeClientProps) {
  const [quickView, setQuickView] = useState<Product | null>(null);
  const withImages = products.filter((product) => product.images.length > 0);
  const pool = withImages.length ? withImages : products;

  const hero = uniqueProducts([
    pool.find((product) => product.featured),
    pool.find((product) => product.gender === "Women"),
    pool.find((product) => product.gender === "Men"),
    ...pool,
  ]).slice(0, 3);

  const newArrivals = products.filter((product) => product.newArrival).slice(0, 8);
  const featured = products.filter((product) => product.featured);
  const bestSellers = (featured.length >= 4 ? featured : pool).slice(0, 8);
  const storyProduct = pool[3] ?? pool[0] ?? null;

  const categories: CategoryCard[] = [
    categoryCard("Men", "/products?gender=Men", products, "/images/categories/men.svg"),
    categoryCard("Women", "/products?gender=Women", products, "/images/categories/women.svg"),
    categoryCard("Kids", "/products?gender=Kids", products, "/images/categories/kids.svg"),
  ];

  const styles: StyleCard[] = [
    styleCard(
      "Casual",
      "/products?category=Regular",
      products,
      (p) => p.category === "Regular",
      "/images/categories/regular.svg"
    ),
    styleCard(
      "Daily Wear",
      "/products?material=EVA",
      products,
      (p) => p.material === "EVA",
      "/images/categories/regular.svg"
    ),
    styleCard(
      "Comfort",
      "/products?category=Orthopedic",
      products,
      (p) => p.category === "Orthopedic",
      "/images/categories/orthopedic.svg"
    ),
    styleCard(
      "Trending",
      "/collections/trending",
      products,
      (p) => p.featured || p.newArrival,
      "/images/categories/fashion.svg"
    ),
    styleCard(
      "Kids",
      "/products?gender=Kids",
      products,
      (p) => p.gender === "Kids",
      "/images/categories/kids.svg"
    ),
    styleCard(
      "Orthopedic",
      "/products?category=Orthopedic",
      products,
      (p) => p.category === "Orthopedic",
      "/images/categories/orthopedic.svg"
    ),
    styleCard(
      "Bathroom",
      "/products?category=Bathroom",
      products,
      (p) => p.category === "Bathroom",
      "/images/categories/bathroom.svg"
    ),
    styleCard(
      "Memory Foam",
      "/products?material=Memory Foam",
      products,
      (p) => p.material === "Memory Foam",
      "/images/categories/women.svg"
    ),
  ];

  return (
    <div className="overflow-x-clip pb-24">
      <ImmersiveHero products={hero} imageFor={getProductMainImage} />
      <CategoryStage categories={categories} />

      <section className="container-custom py-8 md:py-12" aria-labelledby="new-collection-heading">
        <div id="new-collection-heading">
          <SectionIntro
            eyebrow="Just in"
            title="New collection"
            description="Latest pairs from the live catalogue. Prices show MRP, the current price, and the discount."
            href="/products?new=1"
            cta="Shop new arrivals"
          />
        </div>
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
          {(newArrivals.length ? newArrivals : pool.slice(0, 8)).map((product, index) => (
            <div key={product.slug} className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-[320px]">
              <ProductCard product={product} index={index} onQuickView={setQuickView} />
            </div>
          ))}
        </div>
      </section>

      {storyProduct ? (
        <BrandDepth product={storyProduct} image={getProductMainImage(storyProduct)} />
      ) : null}
      <BestSellersCarousel products={bestSellers} onQuickView={setQuickView} />
      <ShopByStyle styles={styles} />
      <WhyJff />
      <WholesaleBand />
      <ReviewsBand />
      <Newsletter />
      {quickView ? <QuickViewModal product={quickView} onClose={() => setQuickView(null)} /> : null}
    </div>
  );
}

function uniqueProducts(list: Array<Product | undefined>): Product[] {
  const seen = new Set<string>();
  const result: Product[] = [];
  for (const product of list) {
    if (!product || seen.has(product.slug)) continue;
    seen.add(product.slug);
    result.push(product);
  }
  return result;
}

function categoryCard(
  name: "Men" | "Women" | "Kids",
  href: string,
  products: Product[],
  fallback: string
): CategoryCard {
  const matches = products.filter((product) =>
    name === "Kids"
      ? product.gender === "Kids"
      : product.gender === name || product.gender === "Unisex"
  );
  const visual = matches.find((product) => product.images.length > 0);
  return {
    name,
    href,
    image: visual ? getProductMainImage(visual) : fallback,
    count: matches.length,
    note:
      matches.length > 0 ? `${matches.length} styles` : "No kids styles in the current catalogue",
  };
}

function styleCard(
  name: string,
  href: string,
  products: Product[],
  match: (product: Product) => boolean,
  fallback: string
): StyleCard {
  const visual = products.find((product) => match(product) && product.images.length > 0);
  return {
    name,
    href,
    image: visual ? getProductMainImage(visual) : fallback,
  };
}
