import { Suspense } from "react";
import JsonLd from "@/components/seo/JsonLd";
import {
  createMetadata,
  createBreadcrumbJsonLd,
  createItemListJsonLd,
} from "@/lib/seo";
import { products, getUniqueFilterValues } from "@/data";
import ProductsPageClient from "@/components/products/ProductsPageClient";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import PageShell from "@/components/ui/PageShell";
import { getProductMainImage } from "@/lib/utils";

export const metadata = createMetadata({
  title: "Products",
  description:
    "Shop JFF Footwear slippers for men, women, kids, and unisex — orthopedic, regular, bathroom, fashion, and casual styles. Retail and wholesale across India.",
  path: "/products",
  keywords: ["slippers catalog", "wholesale slippers", "premium footwear"],
});

export default function ProductsPage() {
  const filterOptions = getUniqueFilterValues();
  const breadcrumbLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
  ]);
  const itemListLd = createItemListJsonLd(
    products.map((product) => ({
      name: product.name,
      url: `/products/${product.slug}`,
      image: getProductMainImage(product),
    })),
    "JFF Footwear Product Catalog"
  );

  return (
    <PageShell fullWidth ambient="light" className="relative">
      <JsonLd data={[breadcrumbLd, itemListLd]} />
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
