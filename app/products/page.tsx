import { Suspense } from "react";
import { createMetadata } from "@/lib/seo";
import { products, getUniqueFilterValues } from "@/data";
import ProductsPageClient from "@/components/products/ProductsPageClient";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import PageShell from "@/components/ui/PageShell";

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
    <PageShell fullWidth ambient="light" className="relative">
      <AnimatedBackground variant="cream" className="opacity-80" />
      <Suspense
        fallback={
          <div className="container-custom section-padding relative z-10">
            <div className="mb-10 h-12 w-64 animate-pulse rounded-2xl bg-neutral-100" />
            <ProductGridSkeleton count={8} />
          </div>
        }
      >
        <ProductsPageClient products={products} filterOptions={filterOptions} />
      </Suspense>
    </PageShell>
  );
}
