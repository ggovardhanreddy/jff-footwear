"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import { formatINR } from "@/lib/pricing";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { ROUTES } from "@/lib/constants";
import type { Product } from "@/types";

export default function ShoppingHero({
  product,
  image,
}: {
  product: Product | null;
  image: string;
}) {
  const reduced = useReducedMotion();
  const { mrp, sellingPrice } = PRICING_CONFIG.defaultProduct;
  const off = mrp > 0 ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;

  return (
    <section className="container-custom pb-6 pt-4" aria-label="Current offer">
      <div className="grid items-center gap-8 overflow-hidden rounded-[1.6rem] border border-black/[0.06] bg-[#fffcf8] p-5 shadow-[0_16px_40px_-28px_rgba(40,28,16,0.35)] dark:border-white/10 dark:bg-[#161412] md:grid-cols-2 md:p-8 lg:p-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            Slippers for men, women and kids
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-brand-black dark:text-[#f4f0ea] sm:text-5xl lg:text-6xl">
            Step into your style
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-brand-muted">
            Comfortable footwear for every step. Shop the live JFF catalogue from Rayachoty.
          </p>
          <p className="mt-4 text-sm text-brand-black dark:text-[#f4f0ea]">
            <span className="font-display text-2xl font-semibold">{formatINR(sellingPrice)}</span>
            <span className="ml-2 text-brand-muted line-through">{formatINR(mrp)}</span>
            {off > 0 ? (
              <span className="ml-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                {off}% off
              </span>
            ) : null}
            <span className="mt-1 block text-xs text-brand-muted">
              Current catalogue price · {PRICING_CONFIG.taxNote}. Free delivery over{" "}
              {formatINR(PRICING_CONFIG.fees.freeDeliveryThreshold)}.
            </span>
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={ROUTES.products}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-brand-black px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white dark:bg-[#f4f0ea] dark:text-[#161311]"
            >
              Shop now
            </Link>
            <Link
              href="/products?new=1"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/15 px-6 text-xs font-semibold uppercase tracking-[0.16em] dark:border-white/20"
            >
              Explore collection
            </Link>
          </div>
        </div>

        {product ? (
          <motion.div
            className="relative mx-auto h-[280px] w-full max-w-md sm:h-[360px]"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.45 }}
          >
            <Link
              href={`/products/${product.slug}`}
              className="focus-ring relative block h-full overflow-hidden rounded-[1.4rem] bg-[#efeae3] shadow-[0_20px_40px_-24px_rgba(40,28,16,0.45)]"
            >
              <AssetImage
                src={image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 90vw, 480px"
                className="object-cover"
              />
              <span className="absolute bottom-3 left-3 right-3 rounded-xl bg-white/90 px-3 py-2 text-sm font-medium text-brand-black">
                {product.name}
              </span>
            </Link>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
