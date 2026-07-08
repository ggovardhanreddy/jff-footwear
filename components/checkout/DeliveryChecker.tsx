"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { SHIPPING_CONFIG } from "@/config/shipping";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";
import type { DeliveryAvailability } from "@/types";

interface DeliveryCheckerProps {
  availability: DeliveryAvailability;
  isLoading?: boolean;
  className?: string;
}

export default function DeliveryChecker({
  availability,
  isLoading = false,
  className,
}: DeliveryCheckerProps) {
  const reduced = useReducedMotion();

  if (isLoading) {
    return (
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "flex items-center gap-3 rounded-[22px] border border-blue-100/80 bg-gradient-to-r from-blue-50/80 to-white p-5",
          CHECKOUT_MOTION_GPU,
          className
        )}
        role="status"
        aria-live="polite"
      >
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" aria-hidden />
        <p className="text-sm font-medium text-blue-900">
          {SHIPPING_CONFIG.messages.deliveryChecking}
        </p>
      </motion.div>
    );
  }

  if (!availability.checked) return null;

  return (
    <motion.div
      {...checkoutPanelReveal(reduced)}
      className={cn(
        "flex items-center gap-4 rounded-[22px] border p-5",
        availability.available
          ? "border-emerald-200/80 bg-gradient-to-br from-emerald-50/90 to-white"
          : "border-red-200/80 bg-gradient-to-br from-red-50/90 to-white",
        CHECKOUT_MOTION_GPU,
        className
      )}
      role="status"
      aria-live="polite"
    >
      {availability.available ? (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden />
        </div>
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/15">
          <XCircle className="h-5 w-5 text-red-600" aria-hidden />
        </div>
      )}
      <div>
        <p
          className={cn(
            "text-sm font-bold tracking-tight",
            availability.available ? "text-emerald-800" : "text-red-800"
          )}
        >
          {availability.available ? "Delivery Available" : "Not Available"}
        </p>
        {!availability.available && (
          <p className="mt-1 text-sm leading-relaxed text-red-700">
            {SHIPPING_CONFIG.messages.deliveryUnavailable}
          </p>
        )}
      </div>
    </motion.div>
  );
}
