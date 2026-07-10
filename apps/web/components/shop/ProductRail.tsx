"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import { ROUTES } from "@/lib/constants";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  subtitle?: string;
  products: Product[];
  href?: string;
  ctaLabel?: string;
  onQuickView?: (product: Product) => void;
  className?: string;
  large?: boolean;
};

export default function ProductRail({
  title,
  subtitle,
  products,
  href,
  ctaLabel = "View all",
  onQuickView,
  className,
  large,
}: Props) {
  if (!products.length) return null;

  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-black dark:text-white md:text-3xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1.5 max-w-xl text-sm text-brand-muted md:text-base">{subtitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link
            href={href}
            className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-brand-accent transition hover:opacity-80"
          >
            {ctaLabel} →
          </Link>
        ) : null}
      </div>

      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide md:mx-0 md:gap-6 md:px-0">
        {products.map((product, index) => (
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.04, duration: 0.45 }}
            className={cn(
              "w-[78vw] shrink-0 sm:w-[46vw] md:w-[280px] lg:w-[300px]",
              large && "md:w-[320px] lg:w-[340px]"
            )}
          >
            <ProductCard product={product} index={index} onQuickView={onQuickView} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function EmptyContinueHint({ name }: { name?: string }) {
  return (
    <div className="rounded-[1.75rem] border border-black/[0.06] bg-white/60 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
      <p className="font-display text-xl text-brand-black dark:text-white">
        {name ? `Hi ${name},` : "Hi there,"} start exploring JFF.
      </p>
      <p className="mt-2 text-sm text-brand-muted">
        Your recently viewed slippers will appear here so you can continue where you left off.
      </p>
      <Link
        href={ROUTES.products}
        className="mt-5 inline-flex rounded-full bg-brand-black px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white dark:bg-white dark:text-brand-black"
      >
        Shop now
      </Link>
    </div>
  );
}
