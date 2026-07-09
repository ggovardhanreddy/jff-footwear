"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Truck } from "lucide-react";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";
import type { DeliveryEstimate } from "@/types";

interface DeliveryEstimatorProps {
  estimate: DeliveryEstimate;
  className?: string;
}

export default function DeliveryEstimator({
  estimate,
  className,
}: DeliveryEstimatorProps) {
  const reduced = useReducedMotion();

  if (!estimate.deliveryBy) return null;

  return (
    <motion.div
      {...checkoutPanelReveal(reduced, 0.05)}
      className={cn(
        "flex items-start gap-4 rounded-[22px] border border-blue-200/60 bg-gradient-to-br from-blue-50/70 via-white to-white p-5",
        CHECKOUT_MOTION_GPU,
        className
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
        <Truck className="h-5 w-5 text-blue-600" aria-hidden />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-muted">
          Estimated Delivery
        </p>
        <p className="mt-1 font-display text-lg font-bold text-brand-black">
          🚚 Delivery by {estimate.deliveryBy}
        </p>
        <p className="mt-1 text-sm text-brand-muted">
          Typically {estimate.label}
        </p>
      </div>
    </motion.div>
  );
}
