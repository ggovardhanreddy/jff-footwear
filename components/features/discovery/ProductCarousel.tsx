"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { checkoutPanelReveal } from "@/lib/checkout-motion";
import { ROUTES } from "@/lib/constants";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllHref?: string;
  horizontal?: boolean;
  className?: string;
}

export default function ProductCarousel({
  title,
  subtitle,
  products,
  viewAllHref = ROUTES.products,
  horizontal = true,
  className,
}: ProductCarouselProps) {
  const reduced = useReducedMotion();

  if (products.length === 0) return null;

  return (
    <motion.section
      {...checkoutPanelReveal(reduced)}
      className={cn("space-y-8", className)}
      aria-labelledby={`carousel-${title.replace(/\s/g, "-")}`}
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading subtitle={subtitle} title={title} />
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-brand-accent hover:underline"
        >
          View all →
        </Link>
      </div>

      {horizontal ? (
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scroll-smooth sm:-mx-0 sm:px-0">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[min(72vw,260px)] shrink-0 snap-start sm:w-[240px]"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </motion.section>
  );
}
