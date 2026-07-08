import { Suspense } from "react";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { products, getUniqueFilterValues } from "@/data";
import ProductsPageClient from "@/components/products/ProductsPageClient";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import PageShell from "@/components/ui/PageShell";

export const metadata = createMetadata({
  title: "Products",
  description:
    "Browse JFF Footwear's international collection of premium slippers — orthopedic, EVA, rubber, PU, and fashion styles for men, women, and kids.",
  path: "/products",
  keywords: ["slippers catalog", "wholesale slippers", "premium footwear"],
});

export default function ProductsPage() {
  const filterOptions = getUniqueFilterValues();
  const breadcrumbLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ]);

  return (
    <PageShell fullWidth ambient="light" className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
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
