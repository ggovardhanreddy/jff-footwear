"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PartyPopper, Sparkles } from "lucide-react";
import { SHIPPING_CONFIG } from "@/config/shipping";
import { formatINR } from "@/lib/pricing";
import { CHECKOUT_EASE, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";

interface FreeDeliveryProgressProps {
  cartSellingTotal: number;
  isFreeDelivery: boolean;
  className?: string;
}

export default function FreeDeliveryProgress({
  cartSellingTotal,
  isFreeDelivery,
  className,
}: FreeDeliveryProgressProps) {
  const reduced = useReducedMotion();
  const threshold = SHIPPING_CONFIG.FREE_DELIVERY_THRESHOLD;
  const remaining = Math.max(0, threshold - cartSellingTotal);
  const progress = Math.min(cartSellingTotal / threshold, 1);

  if (isFreeDelivery) {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "rounded-[22px] border border-emerald-200/80 bg-gradient-to-r from-emerald-50 via-white to-emerald-50/50 p-4",
          CHECKOUT_MOTION_GPU,
          className
        )}
        role="status"
      >
        <div className="flex items-center gap-3">
          <motion.span
            animate={reduced ? undefined : { rotate: [0, 8, -8, 0] }}
            transition={{ duration: 0.6, repeat: 2 }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-xl"
            aria-hidden
          >
            🎉
          </motion.span>
          <div>
            <p className="font-display text-base font-bold text-emerald-800">
              Congratulations!
            </p>
            <p className="text-sm text-emerald-700">
              You unlocked FREE Delivery!
            </p>
          </div>
          <Sparkles className="ml-auto h-5 w-5 text-emerald-500" aria-hidden />
        </div>
      </motion.div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[22px] border border-amber-200/70 bg-gradient-to-r from-amber-50/80 to-white p-4",
        CHECKOUT_MOTION_GPU,
        className
      )}
      role="status"
    >
      <div className="flex items-start gap-3">
        <PartyPopper className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brand-black">
            You&apos;re {formatINR(remaining)} away from FREE Delivery
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/80">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500"
              initial={false}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: reduced ? 0 : 0.5, ease: CHECKOUT_EASE }}
            />
          </div>
          <p className="mt-2 text-xs text-brand-muted">
            {formatINR(cartSellingTotal)} of {formatINR(threshold)} toward free
            delivery
          </p>
        </div>
      </div>
    </div>
  );
}
