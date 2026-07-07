"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/products/ProductGrid";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeading
          subtitle="Curated Selection"
          title="Featured Products"
          description="Handpicked styles that define comfort and elegance."
        />
        <ProductGrid products={products} />
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-black transition-colors hover:text-brand-accent"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
