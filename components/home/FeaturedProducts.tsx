"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import MotionSection from "@/components/ui/MotionSection";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import ProductGrid from "@/components/products/ProductGrid";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <MotionSection className="relative overflow-hidden section-padding bg-white">
      <AnimatedBackground variant="light" />
      <div className="container-custom relative z-10">
        <SectionHeading
          subtitle="Curated Selection"
          title="Featured Products"
          description="Handpicked styles that define comfort and elegance."
        />
        <div className="rounded-3xl bg-white p-2 md:p-4">
          <ProductGrid products={products} />
        </div>
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
    </MotionSection>
  );
}
