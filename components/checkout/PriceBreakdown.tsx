"use client";

import { motion, useReducedMotion } from "framer-motion";
import AnimatedPrice from "./AnimatedPrice";
import { cn } from "@/lib/utils";
import { formatINR, formatINRSigned } from "@/lib/pricing";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { checkoutItemStagger } from "@/lib/checkout-motion";
import type { OrderSummaryBreakdown } from "@/types";

interface PriceBreakdownProps {
  summary: OrderSummaryBreakdown;
  className?: string;
  animated?: boolean;
}

export default function PriceBreakdown({
  summary,
  className,
  animated = true,
}: PriceBreakdownProps) {
  const reduced = useReducedMotion();

  const lines: {
    label: string;
    value: string;
    tone?: "muted" | "discount" | "strike" | "bold" | "free";
  }[] = [
    {
      label: "MRP (Inclusive of Taxes)",
      value: formatINR(summary.subtotal),
      tone: "strike",
    },
    {
      label: "Discount",
      value: formatINRSigned(-summary.productDiscount),
      tone: "discount",
    },
    {
      label: "Selling Price",
      value: formatINR(summary.cartSellingTotal),
      tone: "bold",
    },
    {
      label: "Platform Fee",
      value: formatINR(summary.platformFee),
    },
    {
      label: "Delivery",
      value:
        summary.deliveryCharge === 0
          ? "FREE"
          : formatINR(summary.deliveryCharge),
      tone: summary.deliveryCharge === 0 ? "free" : undefined,
    },
  ];

  if (summary.couponDiscount > 0) {
    lines.push({
      label: "Coupon",
      value: formatINRSigned(-summary.couponDiscount),
      tone: "discount",
    });
  }

  const Row = animated && !reduced ? motion.div : "div";

  return (
    <div className={cn("space-y-1", className)}>
      <div className="divide-y divide-black/[0.05]">
        {lines.map((line, index) => (
          <Row
            key={line.label}
            {...(animated && !reduced
              ? {
                  custom: index,
                  variants: checkoutItemStagger,
                  initial: "hidden",
                  animate: "show",
                }
              : {})}
            className="flex items-center justify-between gap-4 py-3 text-sm"
          >
            <span className="text-brand-muted">{line.label}</span>
            <span
              className={cn(
                "font-medium tabular-nums",
                line.tone === "strike" && "text-brand-muted line-through",
                line.tone === "discount" && "font-semibold text-emerald-600",
                line.tone === "bold" && "text-base font-bold text-brand-black",
                line.tone === "free" && "font-semibold text-emerald-600"
              )}
            >
              {line.value}
            </span>
          </Row>
        ))}
      </div>

      <div className="mt-2 rounded-[20px] bg-gradient-to-br from-neutral-50 to-white p-4 sm:p-5">
        <div className="flex items-end justify-between gap-4">
          <span className="font-display text-lg font-bold text-brand-black">
            Grand Total
          </span>
          <span className="font-display text-3xl font-bold tabular-nums tracking-tight text-brand-black sm:text-[2rem]">
            <AnimatedPrice value={summary.grandTotal} />
          </span>
        </div>
        {summary.totalSavings > 0 && (
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: reduced ? 0 : 0.2 }}
            className="mt-2 text-right text-sm font-semibold text-emerald-600"
          >
            You Saved {formatINR(summary.totalSavings)}
          </motion.p>
        )}
      </div>
    </div>
  );
}
