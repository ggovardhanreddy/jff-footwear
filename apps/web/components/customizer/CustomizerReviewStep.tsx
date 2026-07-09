"use client";

import { formatINR } from "@/lib/pricing";
import { calculateCustomOrderPricing } from "@/lib/customizer/pricing";
import type { ProductCustomization } from "@/types/customizer";

interface CustomizerReviewStepProps {
  config: ProductCustomization;
}

const SUMMARY_FIELDS: { key: keyof ProductCustomization; label: string }[] = [
  { key: "category", label: "Category" },
  { key: "gender", label: "Gender" },
  { key: "material", label: "Material" },
  { key: "soleType", label: "Sole" },
  { key: "strapType", label: "Strap" },
  { key: "color", label: "Color" },
  { key: "size", label: "Size" },
  { key: "quantity", label: "Quantity" },
  { key: "packaging", label: "Packaging" },
  { key: "orderType", label: "Order Type" },
];

export default function CustomizerReviewStep({ config }: CustomizerReviewStepProps) {
  const pricing = calculateCustomOrderPricing(config);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="card-surface rounded-2xl p-5 dark:glass-card">
          <p className="eyebrow text-brand-accent">Configuration</p>
          <dl className="mt-4 space-y-2 text-sm">
            {SUMMARY_FIELDS.map(({ key, label }) => (
              <div key={key} className="flex justify-between gap-4">
                <dt className="text-brand-muted">{label}</dt>
                <dd className="font-medium text-right">
                  {key === "quantity"
                    ? `${config.quantity} pairs`
                    : String(config[key] || "—")}
                </dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="text-brand-muted">Custom Logo</dt>
              <dd className="font-medium">
                {config.customLogo
                  ? `${config.logoPosition} · ${config.logoFileName}`
                  : "No"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card-surface rounded-2xl p-5 dark:glass-card">
          <p className="eyebrow text-brand-accent">Delivery</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-brand-muted">PIN Code</dt>
              <dd className="font-medium">{config.deliveryPincode}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-brand-muted">State</dt>
              <dd className="font-medium">{config.deliveryState}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-brand-muted">Est. Delivery</dt>
              <dd className="font-medium text-brand-blue dark:text-brand-blue-dark">
                {config.deliveryBy}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="card-surface rounded-2xl p-5 dark:glass-card">
        <p className="eyebrow text-brand-accent">Price Summary</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-brand-muted">Per pair</dt>
            <dd className="font-semibold">{formatINR(pricing.sellingPrice)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-brand-muted">Subtotal</dt>
            <dd>{formatINR(pricing.cartSellingTotal)}</dd>
          </div>
          {pricing.bulkDiscountPercent > 0 && (
            <div className="flex justify-between text-emerald-600">
              <dt>Bulk discount ({pricing.bulkDiscountPercent}%)</dt>
              <dd>-{formatINR(pricing.bulkDiscountAmount)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-black/[0.06] pt-3 text-lg font-bold dark:border-white/10">
            <dt>Grand Total</dt>
            <dd>{formatINR(pricing.grandTotal)}</dd>
          </div>
        </dl>
      </div>

      {config.specialInstructions.trim() && (
        <div className="rounded-2xl border border-black/[0.06] bg-white/60 p-4 text-sm dark:border-white/10 dark:bg-white/5">
          <p className="font-semibold">Special Instructions</p>
          <p className="mt-2 text-brand-muted">{config.specialInstructions}</p>
        </div>
      )}
    </div>
  );
}
