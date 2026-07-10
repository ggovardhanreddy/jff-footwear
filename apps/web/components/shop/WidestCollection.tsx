"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/constants";

const CATEGORIES = [
  { name: "Men", href: `${ROUTES.products}?gender=Men`, hint: "Everyday slides" },
  { name: "Women", href: `${ROUTES.products}?gender=Women`, hint: "Soft comfort" },
  { name: "Kids", href: `${ROUTES.products}?gender=Kids`, hint: "Play-ready" },
  { name: "Slides", href: `${ROUTES.products}?category=Casual`, hint: "Easy on/off" },
  { name: "Daily Wear", href: `${ROUTES.products}?category=Regular`, hint: "All-day ease" },
  { name: "Comfort", href: `${ROUTES.products}?category=Orthopedic`, hint: "Memory foam" },
  { name: "Outdoor", href: `${ROUTES.products}?category=Outdoor`, hint: "Grip & durability" },
  { name: "Premium", href: ROUTES.collections, hint: "Signature JFF" },
] as const;

export default function WidestCollection() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-black dark:text-white md:text-3xl">
          Widest Collection
        </h2>
        <p className="mt-1.5 text-sm text-brand-muted">
          Browse JFF by style — every pair designed in-house.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {CATEGORIES.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
          >
            <Link
              href={cat.href}
              className="group flex min-h-[120px] flex-col justify-between rounded-[1.5rem] border border-black/[0.06] bg-gradient-to-br from-white to-zinc-50 p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-accent/40 hover:shadow-[0_20px_40px_-24px_rgba(200,169,110,0.55)] dark:border-white/10 dark:from-white/5 dark:to-white/[0.02]"
            >
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-muted">
                Shop
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold text-brand-black dark:text-white">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs text-brand-muted">{cat.hint}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
