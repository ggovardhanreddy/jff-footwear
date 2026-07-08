"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PiggyBank } from "lucide-react";
import AnimatedPrice from "./AnimatedPrice";
import { formatINR } from "@/lib/pricing";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";

interface SavingsCardProps {
  totalSavings: number;
  className?: string;
}

export default function SavingsCard({
  totalSavings,
  className,
}: SavingsCardProps) {
  const reduced = useReducedMotion();

  if (totalSavings <= 0) return null;

  return (
    <motion.div
      {...checkoutPanelReveal(reduced)}
      className={cn(
        "flex items-center justify-between gap-4 rounded-[20px] border border-emerald-200/70 bg-gradient-to-r from-emerald-50/90 to-white px-4 py-3.5",
        CHECKOUT_MOTION_GPU,
        className
      )}
      role="status"
      aria-label={`You saved ${formatINR(totalSavings)}`}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15">
          <PiggyBank className="h-4 w-4 text-emerald-600" aria-hidden />
        </div>
        <span className="text-sm font-semibold text-emerald-800">Savings</span>
      </div>
      <AnimatedPrice
        value={totalSavings}
        className="font-display text-lg font-bold text-emerald-600"
        prefix="-"
      />
    </motion.div>
  );
}
