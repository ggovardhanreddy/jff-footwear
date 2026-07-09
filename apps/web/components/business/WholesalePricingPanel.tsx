"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BULK_DISCOUNT_TIERS,
  MOQ_BY_ORDER_TYPE,
  WHOLESALE_PRICING,
} from "@jff/config/wholesale-config";
import { formatINR } from "@/lib/pricing";
import { getWholesaleUnitPrice } from "@jff/utils/wholesale";
import { PRICING_CONFIG } from "@/lib/pricing-config";

interface WholesalePricingPanelProps {
  className?: string;
}

export default function WholesalePricingPanel({
  className,
}: WholesalePricingPanelProps) {
  const reduced = useReducedMotion();
  const retail = PRICING_CONFIG.defaultProduct.sellingPrice;
  const wholesale = getWholesaleUnitPrice(retail, "wholesale");
  const distributor = getWholesaleUnitPrice(retail, "distributor");
  const exportPrice = getWholesaleUnitPrice(retail, "export");

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={className}
    >
      <p className="eyebrow text-brand-accent">B2B Pricing</p>
      <h3 className="mt-2 font-display text-xl font-bold">Wholesale Price Guide</h3>
      <p className="mt-2 text-sm text-brand-muted">
        Indicative per-pair pricing on our standard range. Final quotes depend on
        style, MOQ, and delivery location.
      </p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-4 dark:border-white/10 dark:glass-card">
          <dt className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Wholesale
          </dt>
          <dd className="mt-1 font-display text-2xl font-bold tabular-nums">
            {formatINR(wholesale)}
          </dd>
          <p className="mt-1 text-xs text-brand-muted">
            MOQ {MOQ_BY_ORDER_TYPE.Wholesale}+ pairs ·{" "}
            {Math.round((1 - WHOLESALE_PRICING.wholesaleMultiplier) * 100)}% off retail
          </p>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-4 dark:border-white/10 dark:glass-card">
          <dt className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Distributor
          </dt>
          <dd className="mt-1 font-display text-2xl font-bold tabular-nums">
            {formatINR(distributor)}
          </dd>
          <p className="mt-1 text-xs text-brand-muted">
            MOQ {MOQ_BY_ORDER_TYPE.Distributor}+ pairs ·{" "}
            {Math.round((1 - WHOLESALE_PRICING.distributorMultiplier) * 100)}% off retail
          </p>
        </div>
        <div className="rounded-2xl border border-black/[0.06] bg-white/80 p-4 dark:border-white/10 dark:glass-card">
          <dt className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Export
          </dt>
          <dd className="mt-1 font-display text-2xl font-bold tabular-nums">
            {formatINR(exportPrice)}
          </dd>
          <p className="mt-1 text-xs text-brand-muted">
            MOQ {MOQ_BY_ORDER_TYPE.Export}+ pairs · volume terms on request
          </p>
        </div>
      </dl>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-black/[0.06] dark:border-white/10">
        <table className="w-full min-w-[320px] text-left text-sm">
          <thead>
            <tr className="border-b border-black/[0.06] bg-black/[0.02] dark:border-white/10">
              <th className="px-4 py-3 font-semibold">Order type</th>
              <th className="px-4 py-3 font-semibold">MOQ (pairs)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(MOQ_BY_ORDER_TYPE).map(([type, moq]) => (
              <tr
                key={type}
                className="border-b border-black/[0.04] last:border-0 dark:border-white/5"
              >
                <td className="px-4 py-3">{type}</td>
                <td className="px-4 py-3 tabular-nums font-medium">{moq}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Volume discounts (on order total)
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {BULK_DISCOUNT_TIERS.map((tier) => (
            <li
              key={tier.minQty}
              className="rounded-full bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-black dark:text-white"
            >
              {tier.label}: {tier.percent}% off
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-xs text-brand-muted">
        Retail reference price {formatINR(retail)} per pair (MRP{" "}
        {formatINR(PRICING_CONFIG.defaultProduct.mrp)}). Taxes and shipping extra.
      </p>
    </motion.div>
  );
}
