"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Shield, Factory, BadgeCheck, Lock } from "lucide-react";
import { checkoutItemStagger, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";

const EXPERIENCE_ITEMS = [
  { icon: Lock, label: "Secure Checkout" },
  { icon: Shield, label: "100% Secure Order" },
  { icon: Factory, label: "Direct From Manufacturer" },
  { icon: BadgeCheck, label: "Genuine Products" },
] as const;

interface ShoppingExperienceProps {
  className?: string;
}

export default function ShoppingExperience({ className }: ShoppingExperienceProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-4",
        CHECKOUT_MOTION_GPU,
        className
      )}
      role="list"
      aria-label="Shopping guarantees"
    >
      {EXPERIENCE_ITEMS.map((item, index) => (
        <motion.div
          key={item.label}
          custom={index}
          variants={checkoutItemStagger}
          initial={reduced ? false : "hidden"}
          animate="show"
          role="listitem"
          className="flex items-center gap-2.5 rounded-2xl border border-emerald-200/50 bg-emerald-50/40 px-3 py-2.5"
        >
          <item.icon className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
          <span className="text-[11px] font-semibold leading-tight text-emerald-900 sm:text-xs">
            ✔ {item.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
