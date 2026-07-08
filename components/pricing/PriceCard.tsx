import { cn } from "@/lib/utils";
import { formatINR, formatINRSigned } from "@/lib/pricing";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import type { ProductPricing } from "@/types";

interface PriceCardProps {
  pricing: ProductPricing;
  variant?: "full" | "compact";
  className?: string;
}

export default function PriceCard({
  pricing,
  variant = "full",
  className,
}: PriceCardProps) {
  const { mrp, discount, sellingPrice } = pricing;

  if (variant === "compact") {
    return (
      <div className={cn("space-y-1", className)}>
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-lg font-bold text-brand-black">
            {formatINR(sellingPrice)}
          </span>
          <span className="text-sm text-brand-muted line-through">
            {formatINR(mrp)}
          </span>
          {discount > 0 && (
            <span className="text-xs font-semibold text-emerald-600">
              {formatINRSigned(-discount)}
            </span>
          )}
        </div>
        <p className="text-[10px] text-brand-muted">{PRICING_CONFIG.taxNote}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border border-black/[0.06] bg-gradient-to-br from-white to-neutral-50/80 p-5 md:p-6",
        className
      )}
    >
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
          MRP ({PRICING_CONFIG.taxNote})
        </p>
        <p className="font-display text-xl text-brand-muted line-through md:text-2xl">
          {formatINR(mrp)}
        </p>
      </div>

      {discount > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Discount
          </p>
          <p className="text-lg font-semibold text-emerald-600">
            {formatINRSigned(-discount)}
          </p>
        </div>
      )}

      <div className="space-y-1 border-t border-black/[0.06] pt-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Selling Price
        </p>
        <p className="font-display text-3xl font-bold tracking-tight text-brand-black md:text-4xl">
          {formatINR(sellingPrice)}
        </p>
        <p className="text-xs text-brand-muted">{PRICING_CONFIG.taxNote}</p>
      </div>
    </div>
  );
}
