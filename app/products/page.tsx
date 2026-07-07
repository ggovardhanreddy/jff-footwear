import { Suspense } from "react";
import { createMetadata } from "@/lib/seo";
import { products, getUniqueFilterValues } from "@/data";
import ProductsPageClient from "@/components/products/ProductsPageClient";

export const metadata = createMetadata({
  title: "Products",
  description:
    "Browse JFF's complete collection of premium slippers. Filter by gender, category, material, color, and size.",
  path: "/products",
  keywords: ["slippers catalog", "wholesale slippers", "buy slippers"],
});

export default function ProductsPage() {
  const filterOptions = getUniqueFilterValues();

  return (
    <div className="pt-20">
      <Suspense
        fallback={
          <div className="container-custom section-padding">
            <div className="animate-pulse space-y-8">
              <div className="h-12 w-64 bg-gray-200" />
              <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-gray-200" />
                ))}
              </div>
            </div>
          </div>
        }
      >
        <ProductsPageClient products={products} filterOptions={filterOptions} />
      </Suspense>
    </div>
  );
}
