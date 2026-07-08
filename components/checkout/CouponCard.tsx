"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Tag, X } from "lucide-react";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { CHECKOUT_INPUT } from "@/lib/checkout-styles";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";

interface CouponCardProps {
  value: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onRemove?: () => void;
  applied?: boolean;
  message?: string;
  isSuccess?: boolean;
  isError?: boolean;
  className?: string;
}

export default function CouponCard({
  value,
  onChange,
  onApply,
  onRemove,
  applied = false,
  message,
  isSuccess = false,
  isError = false,
  className,
}: CouponCardProps) {
  const reduced = useReducedMotion();

  if (!PRICING_CONFIG.coupon.enabled) return null;

  return (
    <motion.div
      {...checkoutPanelReveal(reduced)}
      className={cn(
        "rounded-[22px] border border-black/[0.05] bg-neutral-50/50 p-4",
        isSuccess && "border-emerald-200/80 bg-emerald-50/30",
        isError && "border-red-200/80 bg-red-50/20",
        CHECKOUT_MOTION_GPU,
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-brand-accent" aria-hidden />
          <label
            htmlFor="checkout-coupon"
            className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-muted"
          >
            Coupon Code
          </label>
        </div>
        {applied && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-600 hover:underline"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <input
          id="checkout-coupon"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          placeholder="Optional — e.g. JFF20"
          disabled={applied}
          className={cn(CHECKOUT_INPUT, "flex-1 py-3 text-sm", applied && "opacity-70")}
          aria-describedby={message ? "coupon-message" : undefined}
        />
        <motion.button
          type="button"
          onClick={onApply}
          disabled={applied}
          whileTap={reduced ? undefined : { scale: 0.96 }}
          className="shrink-0 rounded-2xl border border-neutral-200 bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent disabled:opacity-50"
        >
          Apply
        </motion.button>
      </div>

      {message && (
        <motion.p
          id="coupon-message"
          initial={reduced ? false : { opacity: 0, y: 4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className={cn(
            "mt-3 text-xs font-semibold",
            isSuccess && "text-emerald-600",
            isError && "text-red-600"
          )}
          role="status"
        >
          {isSuccess && "✓ "}
          {isError && "✕ "}
          {message}
        </motion.p>
      )}
    </motion.div>
  );
}
