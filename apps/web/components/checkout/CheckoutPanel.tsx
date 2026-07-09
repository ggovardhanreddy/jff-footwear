"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { GLASS_CARD, GLASS_CARD_INNER } from "@/lib/checkout-styles";

interface CheckoutPanelProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function CheckoutPanel({
  children,
  className,
  delay = 0,
}: CheckoutPanelProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      {...checkoutPanelReveal(reduced, delay)}
      className={cn(CHECKOUT_MOTION_GPU, GLASS_CARD, "overflow-hidden", className)}
    >
      <div className={GLASS_CARD_INNER}>{children}</div>
    </motion.div>
  );
}
