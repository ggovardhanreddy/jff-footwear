"use client";

import ProductCard from "@/components/ProductCard";
import { getFrequentlyBoughtTogether } from "@/lib/product-sections";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface FrequentlyBoughtTogetherProps {
  product: Product;
  className?: string;
}

export default function FrequentlyBoughtTogether({
  product,
  className,
}: FrequentlyBoughtTogetherProps) {
  const items = getFrequentlyBoughtTogether(product, 3);
  if (items.length === 0) return null;

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="fbt-heading">
      <div>
        <p className="eyebrow text-brand-accent">Bundle &amp; Save</p>
        <h2 id="fbt-heading" className="heading-section mt-2">
          Frequently Bought Together
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
