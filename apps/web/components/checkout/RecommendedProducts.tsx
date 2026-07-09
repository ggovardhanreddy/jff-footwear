"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { getRelatedProducts } from "@/lib/utils";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { CHECKOUT_EYEBROW, CHECKOUT_SECTION_TITLE } from "@/lib/checkout-styles";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

interface RecommendedProductsProps {
  cartItems?: CartItem[];
  limit?: number;
  className?: string;
}

export default function RecommendedProducts({
  cartItems = [],
  limit = 8,
  className,
}: RecommendedProductsProps) {
  const reduced = useReducedMotion();

  const recommendations = useMemo(() => {
    const cartSlugs = new Set(cartItems.map((i) => i.slug));
    const anchor = cartItems[0]
      ? products.find((p) => p.slug === cartItems[0].slug)
      : undefined;

    let list = anchor
      ? getRelatedProducts(products, anchor, limit + cartSlugs.size)
      : products.filter((p) => p.featured).slice(0, limit + cartSlugs.size);

    list = list.filter((p) => !cartSlugs.has(p.slug)).slice(0, limit);
    return list;
  }, [cartItems, limit]);

  if (recommendations.length === 0) return null;

  return (
    <motion.section
      {...checkoutPanelReveal(reduced, 0.12)}
      className={cn("space-y-5", CHECKOUT_MOTION_GPU, className)}
      aria-labelledby="recommended-heading"
    >
      <header>
        <p className={CHECKOUT_EYEBROW}>Complete Your Look</p>
        <h2
          id="recommended-heading"
          className={cn(CHECKOUT_SECTION_TITLE, "text-xl sm:text-2xl")}
        >
          People Also Bought
        </h2>
      </header>

      <div
        className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scroll-smooth sm:-mx-0 sm:px-0"
        role="list"
        aria-label="Recommended products"
      >
        {recommendations.map((product, index) => (
          <div
            key={product.id}
            role="listitem"
            className="w-[min(72vw,260px)] shrink-0 snap-start sm:w-[240px]"
          >
            <ProductCard product={product} index={index} />
          </div>
        ))}
      </div>

      <p className="text-center text-xs text-brand-muted sm:text-left">
        <Link
          href="/products"
          className="font-semibold text-brand-accent hover:underline"
        >
          View all products →
        </Link>
      </p>
    </motion.section>
  );
}
