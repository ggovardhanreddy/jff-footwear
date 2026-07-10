import type { Metadata } from "next";
import { products, getFeaturedProducts, getLatestProducts } from "@/data";
import { createMetadata } from "@/lib/seo";
import { buildHeroSlides } from "@/lib/shop-home";
import { assetPath } from "@/lib/paths";
import ShopHomeClient from "@/components/shop/ShopHomeClient";

export const metadata: Metadata = createMetadata({
  title: "Premium Slippers | Shop JFF",
  description:
    "Shop premium JFF slippers — men, women, kids. Earn JFF Coins, exclusive offers, and crafted comfort from Rayachoty, Andhra Pradesh.",
  path: "/",
  keywords: ["JFF slippers", "premium footwear India", "buy slippers online", "JFF coins"],
});

export default function HomePage() {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="heading-display">No products found</h1>
        <p className="text-body mt-4 max-w-md">
          Run <code className="rounded bg-black/5 px-2 py-1 text-sm">npm run generate</code> then
          restart the dev server.
        </p>
      </div>
    );
  }

  const featured = getFeaturedProducts();
  const latest = getLatestProducts(10);
  const withImages = products.filter((p) => p.images.length > 0);
  const pool = withImages.length ? withImages : products;

  const heroSlides = buildHeroSlides(pool).map((slide) => ({
    ...slide,
    image: assetPath(slide.image),
  }));

  const suggested = (featured.length ? featured : pool).slice(0, 10);
  const youMayLike = [...pool].reverse().slice(0, 10);
  const mustHave = (featured.length ? featured : pool).slice(0, 8);
  const newAdditions = (latest.length ? latest : pool).slice(0, 10);
  const topSelection = pool.slice(0, 10);

  return (
    <ShopHomeClient
      heroSlides={heroSlides}
      suggested={suggested}
      youMayLike={youMayLike}
      mustHave={mustHave}
      newAdditions={newAdditions}
      topSelection={topSelection}
      allProducts={products}
    />
  );
}
