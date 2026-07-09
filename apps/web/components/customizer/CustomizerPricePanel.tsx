"use client";

import { formatINR } from "@/lib/pricing";
import {
  calculateCustomOrderPricing,
  type CustomOrderPricing,
} from "@/lib/customizer/pricing";
import { BULK_DISCOUNT_TIERS } from "@jff/config/wholesale-config";
import type { ProductCustomization } from "@/types/customizer";
import { cn } from "@/lib/utils";

interface CustomizerPricePanelProps {
  config: ProductCustomization;
  showBulkTiers?: boolean;
  className?: string;
}

export default function CustomizerPricePanel({
  config,
  showBulkTiers = false,
  className,
}: CustomizerPricePanelProps) {
  const pricing = calculateCustomOrderPricing(config);

  return (
    <div className={cn("space-y-4", className)}>
      <dl className="space-y-2 text-sm">
        <PriceRow label="MRP (per pair)" value={formatINR(pricing.mrp)} />
        <PriceRow
          label="Selling (per pair)"
          value={formatINR(pricing.sellingPrice)}
          highlight
        />
        {config.quantity > 1 && (
          <PriceRow
            label={`Subtotal (${pricing.quantity} pairs)`}
            value={formatINR(pricing.cartSellingTotal)}
          />
        )}
        {pricing.bulkDiscountPercent > 0 && (
          <PriceRow
            label={`Bulk discount (${pricing.bulkDiscountPercent}%)`}
            value={`-${formatINR(pricing.bulkDiscountAmount)}`}
            accent
          />
        )}
        <PriceRow label="Platform fee" value={formatINR(pricing.platformFee)} />
        <PriceRow
          label="Delivery"
          value={
            pricing.deliveryCharge === 0
              ? "FREE"
              : formatINR(pricing.deliveryCharge)
          }
          accent={pricing.deliveryCharge === 0}
        />
        <div className="flex justify-between border-t border-black/[0.06] pt-4 font-display text-xl font-bold dark:border-white/10">
          <dt>Grand Total</dt>
          <dd className="tabular-nums">{formatINR(pricing.grandTotal)}</dd>
        </div>
        {pricing.totalSavings > 0 && (
          <p className="text-center text-xs font-semibold text-emerald-600">
            You save {formatINR(pricing.totalSavings)}
          </p>
        )}
      </dl>

      {showBulkTiers && (
        <div className="rounded-2xl border border-black/[0.06] bg-brand-light/50 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
            Bulk Discount Tiers
          </p>
          <ul className="mt-2 space-y-1.5">
            {BULK_DISCOUNT_TIERS.map((tier) => (
              <li
                key={tier.minQty}
                className={cn(
                  "flex justify-between text-xs",
                  config.quantity >= tier.minQty
                    ? "font-semibold text-emerald-600"
                    : "text-brand-muted"
                )}
              >
                <span>{tier.label}</span>
                <span>{tier.percent}% off</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {config.deliveryBy && (
        <p className="rounded-xl bg-blue-50 px-3 py-2 text-center text-xs font-medium text-blue-800 dark:bg-blue-950/40 dark:text-blue-200">
          Est. delivery by {config.deliveryBy}
        </p>
      )}
    </div>
  );
}

function PriceRow({
  label,
  value,
  accent,
  highlight,
}: {
  label: string;
  value: string;
  accent?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-brand-muted">{label}</dt>
      <dd
        className={cn(
          "font-medium tabular-nums",
          accent && "text-emerald-600",
          highlight && "text-brand-black dark:text-white"
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export { type CustomOrderPricing };
