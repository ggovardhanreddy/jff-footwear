"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { checkoutItemStagger, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";

interface ShippingBadgeProps {
  label: string;
  variant?: "green" | "blue" | "gold" | "neutral";
  className?: string;
  index?: number;
}

function ShippingBadge({
  label,
  variant = "neutral",
  className,
  index = 0,
}: ShippingBadgeProps) {
  const reduced = useReducedMotion();

  const variants = {
    green:
      "border-emerald-200/80 bg-emerald-50/90 text-emerald-800 shadow-sm shadow-emerald-500/5",
    blue: "border-blue-200/80 bg-blue-50/90 text-blue-800 shadow-sm shadow-blue-500/5",
    gold: "border-amber-200/80 bg-amber-50/90 text-amber-900 shadow-sm shadow-amber-500/5",
    neutral:
      "border-neutral-200/80 bg-white/90 text-brand-muted shadow-sm shadow-black/[0.03]",
  };

  return (
    <motion.span
      custom={index}
      variants={checkoutItemStagger}
      initial={reduced ? false : "hidden"}
      animate="show"
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.18em]",
        variants[variant],
        CHECKOUT_MOTION_GPU,
        className
      )}
    >
      {label}
    </motion.span>
  );
}

interface ShippingBadgesProps {
  isFreeDelivery: boolean;
  isFastDelivery?: boolean;
  isCodAvailable?: boolean;
  className?: string;
}

export default function ShippingBadges({
  isFreeDelivery,
  isFastDelivery = true,
  isCodAvailable = false,
  className,
}: ShippingBadgesProps) {
  const badges: { label: string; variant: ShippingBadgeProps["variant"] }[] =
    [];

  if (isFreeDelivery) badges.push({ label: "Free Delivery", variant: "green" });
  if (isFastDelivery) badges.push({ label: "Fast Delivery", variant: "blue" });
  if (isCodAvailable) badges.push({ label: "COD Available", variant: "gold" });
  badges.push({ label: "Easy Returns", variant: "neutral" });

  return (
    <div className={cn("flex flex-wrap gap-2.5", className)} role="list">
      {badges.map((badge, index) => (
        <ShippingBadge
          key={badge.label}
          label={badge.label}
          variant={badge.variant}
          index={index}
        />
      ))}
    </div>
  );
}
