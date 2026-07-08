import { cn } from "@/lib/utils";
import { formatINR, formatINRSigned } from "@/lib/pricing";
import type { OrderSummaryBreakdown } from "@/types";

interface PricingBreakdownProps {
  summary: OrderSummaryBreakdown;
  className?: string;
  showSavings?: boolean;
}

interface LineItem {
  label: string;
  value: string;
  tone?: "default" | "discount" | "free" | "total";
}

export default function PricingBreakdown({
  summary,
  className,
  showSavings = true,
}: PricingBreakdownProps) {
  const lines: LineItem[] = [
    { label: "Subtotal", value: formatINR(summary.subtotal) },
  ];

  if (summary.productDiscount > 0) {
    lines.push({
      label: "Discount",
      value: formatINRSigned(-summary.productDiscount),
      tone: "discount",
    });
  }

  if (summary.platformFee > 0) {
    lines.push({
      label: "Platform Fee",
      value: formatINR(summary.platformFee),
    });
  }

  lines.push({
    label: "Delivery Charges",
    value:
      summary.deliveryCharge === 0
        ? "FREE"
        : formatINR(summary.deliveryCharge),
    tone: summary.deliveryCharge === 0 ? "free" : "default",
  });

  if (summary.couponDiscount > 0) {
    lines.push({
      label: "Coupon Discount",
      value: formatINRSigned(-summary.couponDiscount),
      tone: "discount",
    });
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="divide-y divide-black/[0.06]">
        {lines.map((line) => (
          <div
            key={line.label}
            className="flex items-center justify-between gap-4 py-3 text-sm"
          >
            <span className="text-brand-muted">{line.label}</span>
            <span
              className={cn(
                "font-medium tabular-nums",
                line.tone === "discount" && "text-emerald-600",
                line.tone === "free" && "font-semibold text-emerald-600",
                line.tone === "total" && "font-bold text-brand-black"
              )}
            >
              {line.value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-black/10 pt-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-display text-lg font-bold text-brand-black">
            Grand Total
          </span>
          <span className="font-display text-2xl font-bold tabular-nums text-brand-black md:text-3xl">
            {formatINR(summary.grandTotal)}
          </span>
        </div>

        {showSavings && summary.totalSavings > 0 && (
          <p className="mt-2 text-right text-sm font-semibold text-emerald-600">
            You Saved {formatINR(summary.totalSavings)}
          </p>
        )}
      </div>
    </div>
  );
}
