"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { formatINR } from "@/lib/pricing";
import {
  getBulkDiscountPercent,
  calculateCustomOrderPricing,
} from "@/lib/customizer/pricing";
import { EMPTY_CUSTOMIZATION } from "@/types/customizer";

export default function BulkDiscountCalculator() {
  const reduced = useReducedMotion();
  const [quantity, setQuantity] = useState(50);

  const config = { ...EMPTY_CUSTOMIZATION, quantity };
  const pricing = calculateCustomOrderPricing(config);
  const discountPct = getBulkDiscountPercent(quantity);

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-[24px] border border-black/[0.06] bg-white p-6 shadow-soft dark:border-white/10 dark:glass-card"
    >
      <p className="eyebrow text-brand-accent">Wholesale</p>
      <h3 className="mt-2 font-display text-xl font-bold">Bulk Discount Calculator</h3>
      <p className="mt-2 text-sm text-brand-muted">
        Estimate savings on large orders. Final pricing confirmed on WhatsApp.
      </p>

      <label className="mt-6 block text-xs font-semibold uppercase tracking-widest text-brand-muted">
        Quantity (pairs)
      </label>
      <input
        type="range"
        min={1}
        max={1000}
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="mt-2 w-full accent-brand-blue"
        aria-valuemin={1}
        aria-valuemax={1000}
        aria-valuenow={quantity}
      />
      <p className="mt-2 text-center font-display text-3xl font-bold tabular-nums">
        {quantity}
      </p>

      <dl className="mt-6 space-y-2 border-t border-black/[0.06] pt-4 text-sm dark:border-white/10">
        <div className="flex justify-between">
          <dt className="text-brand-muted">Bulk discount</dt>
          <dd className="font-semibold text-emerald-600">{discountPct}%</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-brand-muted">Estimated savings</dt>
          <dd className="font-semibold text-emerald-600">
            {formatINR(pricing.bulkDiscountAmount)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-black/[0.06] pt-3 font-display text-lg font-bold dark:border-white/10">
          <dt>Est. total</dt>
          <dd>{formatINR(pricing.grandTotal)}</dd>
        </div>
      </dl>
    </motion.div>
  );
}
