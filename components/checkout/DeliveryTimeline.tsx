"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Package,
  Box,
  ShieldCheck,
  Truck,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { CHECKOUT_EASE, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";

const TIMELINE = [
  { id: "placed", label: "Order Placed", icon: Package },
  { id: "packed", label: "Packed", icon: Box },
  { id: "quality", label: "Quality Checked", icon: ShieldCheck },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "out", label: "Out For Delivery", icon: MapPin },
  { id: "delivered", label: "Delivered", icon: CheckCircle2 },
] as const;

interface DeliveryTimelineProps {
  activeIndex?: number;
  className?: string;
}

export default function DeliveryTimeline({
  activeIndex = 0,
  className,
}: DeliveryTimelineProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "rounded-[22px] border border-black/[0.05] bg-white/60 p-5",
        CHECKOUT_MOTION_GPU,
        className
      )}
      aria-label="Delivery timeline preview"
    >
      <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-muted">
        Delivery Timeline
      </p>
      <ol className="relative space-y-0">
        {TIMELINE.map((step, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;
          const Icon = step.icon;

          return (
            <li key={step.id} className="relative flex gap-4 pb-6 last:pb-0">
              {index < TIMELINE.length - 1 && (
                <div
                  className="absolute left-5 top-10 h-[calc(100%-1.25rem)] w-px bg-neutral-200"
                  aria-hidden
                />
              )}
              <motion.div
                initial={reduced ? false : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: reduced ? 0 : index * 0.06,
                  duration: 0.35,
                  ease: CHECKOUT_EASE,
                }}
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border-2",
                  isComplete && "border-emerald-500 bg-emerald-500 text-white",
                  isActive && "border-brand-accent bg-brand-accent/10 text-brand-accent",
                  !isComplete && !isActive && "border-neutral-200 bg-white text-brand-muted"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
              </motion.div>
              <div className="pt-2">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isActive && "text-brand-black",
                    isComplete && "text-emerald-700",
                    !isActive && !isComplete && "text-brand-muted"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
