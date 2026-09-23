import type { Metadata } from "next";
import { products } from "@/data";
import { createMetadata } from "@/lib/seo";
import ShopHomeClient from "@/components/shop/ShopHomeClient";

export const metadata: Metadata = createMetadata({
  title: "Step Into Your Style",
  description:
    "Comfort, style and everyday footwear designed for every step. Shop JFF slippers for men, women, and kids. Made in Rayachoty, Andhra Pradesh since 2021. Wholesale and retail.",
  path: "/",
  keywords: [
    "JFF slippers",
    "JFF footwear",
    "buy slippers online India",
    "wholesale slippers Rayachoty",
  ],
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

  return <ShopHomeClient products={products} />;
}
