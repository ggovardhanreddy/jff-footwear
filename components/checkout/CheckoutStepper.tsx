"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CHECKOUT_EASE, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import type { CheckoutStep } from "@/types";

const STEPS: { id: CheckoutStep; label: string; short: string }[] = [
  { id: "address", label: "Delivery Address", short: "Address" },
  { id: "delivery", label: "Delivery Details", short: "Delivery" },
  { id: "review", label: "Order Summary", short: "Review" },
];

interface CheckoutStepperProps {
  currentStep: CheckoutStep;
  className?: string;
}

export default function CheckoutStepper({
  currentStep,
  className,
}: CheckoutStepperProps) {
  const reduced = useReducedMotion();
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);
  const progress =
    STEPS.length > 1 ? currentIndex / (STEPS.length - 1) : 0;

  return (
    <nav
      aria-label="Checkout progress"
      className={cn("mb-10 sm:mb-12", CHECKOUT_MOTION_GPU, className)}
    >
      <div className="relative">
        <div
          className="absolute left-0 right-0 top-5 hidden h-0.5 bg-neutral-200/80 sm:block"
          aria-hidden
        />
        <motion.div
          className="absolute left-0 top-5 hidden h-0.5 origin-left bg-gradient-to-r from-brand-accent to-emerald-500 sm:block"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{
            duration: reduced ? 0 : 0.55,
            ease: CHECKOUT_EASE,
          }}
          style={{ width: "100%", transformOrigin: "left center" }}
          aria-hidden
        />

        <ol className="relative grid grid-cols-3 gap-2 sm:gap-4">
          {STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isComplete = index < currentIndex;

            return (
              <li
                key={step.id}
                className="flex flex-col items-center text-center"
                aria-current={isActive ? "step" : undefined}
              >
                <motion.span
                  layout
                  transition={{ duration: reduced ? 0 : 0.35, ease: CHECKOUT_EASE }}
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold shadow-sm transition-colors",
                    isActive &&
                      "border-brand-accent bg-brand-accent text-white shadow-md shadow-brand-accent/25",
                    isComplete &&
                      "border-emerald-500 bg-emerald-500 text-white",
                    !isActive &&
                      !isComplete &&
                      "border-neutral-200 bg-white text-brand-muted"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </motion.span>
                <span
                  className={cn(
                    "mt-3 hidden text-[11px] font-semibold uppercase tracking-[0.18em] sm:block",
                    isActive && "text-brand-black",
                    isComplete && "text-emerald-700",
                    !isActive && !isComplete && "text-brand-muted"
                  )}
                >
                  {step.label}
                </span>
                <span
                  className={cn(
                    "mt-2 text-[10px] font-semibold uppercase tracking-wider sm:hidden",
                    isActive && "text-brand-black",
                    isComplete && "text-emerald-700",
                    !isActive && !isComplete && "text-brand-muted"
                  )}
                >
                  {step.short}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
