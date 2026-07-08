"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { checkoutStepTransition, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import type { CheckoutStep } from "@/types";

interface CheckoutStepContentProps {
  stepKey: CheckoutStep;
  children: React.ReactNode;
  className?: string;
}

export default function CheckoutStepContent({
  stepKey,
  children,
  className,
}: CheckoutStepContentProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        {...checkoutStepTransition(reduced)}
        className={className}
        style={{ willChange: "transform, opacity" }}
      >
        <div className={CHECKOUT_MOTION_GPU}>{children}</div>
      </motion.div>
    </AnimatePresence>
  );
}
