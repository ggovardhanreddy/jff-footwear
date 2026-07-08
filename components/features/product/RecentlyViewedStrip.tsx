"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface RecentlyViewedStripProps {
  excludeSlug?: string;
  className?: string;
}

export default function RecentlyViewedStrip({
  excludeSlug,
  className,
}: RecentlyViewedStripProps) {
  const { items } = useRecentlyViewed();
  const slugs = items
    .filter((i) => i.slug !== excludeSlug)
    .map((i) => i.slug);

  const viewed = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 6);

  if (viewed.length === 0) return null;

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="rv-heading">
      <div className="flex items-end justify-between">
        <h2 id="rv-heading" className="heading-section text-xl">
          Recently Viewed
        </h2>
        <Link href={ROUTES.products} className="text-sm font-semibold text-brand-accent">
          View all →
        </Link>
      </div>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 snap-x snap-mandatory">
        {viewed.map((product, i) => (
          <div key={product!.id} className="w-[200px] shrink-0 snap-start">
            <ProductCard product={product!} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
