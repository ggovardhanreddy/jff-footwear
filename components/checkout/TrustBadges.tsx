"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  Factory,
  ShieldCheck,
  Banknote,
  RotateCcw,
  Truck,
  FileText,
  Package,
} from "lucide-react";
import { checkoutItemStagger, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";

const BADGES = [
  { icon: Factory, label: "Factory Direct", variant: "neutral" as const },
  { icon: Award, label: "Premium Quality", variant: "gold" as const },
  { icon: ShieldCheck, label: "Secure Checkout", variant: "green" as const },
  { icon: Banknote, label: "COD Available", variant: "gold" as const },
  { icon: RotateCcw, label: "Easy Returns", variant: "blue" as const },
  { icon: FileText, label: "GST Invoice", variant: "neutral" as const },
  { icon: Package, label: "Bulk Orders", variant: "neutral" as const },
  { icon: Truck, label: "Wholesale Available", variant: "blue" as const },
];

const VARIANTS = {
  green: "border-emerald-200/80 bg-emerald-50/80 text-emerald-800",
  blue: "border-blue-200/80 bg-blue-50/80 text-blue-800",
  gold: "border-amber-200/80 bg-amber-50/80 text-amber-900",
  neutral: "border-neutral-200/80 bg-white/90 text-brand-muted",
};

interface TrustBadgesProps {
  className?: string;
  /** Hide badges that depend on runtime state */
  showCod?: boolean;
  showFastDelivery?: boolean;
}

export default function TrustBadges({
  className,
  showCod = true,
  showFastDelivery = true,
}: TrustBadgesProps) {
  const reduced = useReducedMotion();

  const visible = BADGES.filter((badge) => {
    if (badge.label === "COD Available" && !showCod) return false;
    return true;
  });

  return (
    <div
      className={cn("flex flex-wrap gap-2", CHECKOUT_MOTION_GPU, className)}
      role="list"
      aria-label="Trust badges"
    >
      {visible.map((badge, index) => (
        <motion.span
          key={badge.label}
          custom={index}
          variants={checkoutItemStagger}
          initial={reduced ? false : "hidden"}
          animate="show"
          role="listitem"
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em]",
            VARIANTS[badge.variant]
          )}
        >
          <badge.icon className="h-3.5 w-3.5" aria-hidden />
          {badge.label}
        </motion.span>
      ))}
    </div>
  );
}
