"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { CHECKOUT_EASE, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CheckoutStep } from "@/types";

const STEPS = [
  { id: "cart", label: "Cart", short: "Cart", icon: "🛒", href: ROUTES.cart },
  { id: "address", label: "Address", short: "Address", icon: "📍" },
  { id: "delivery", label: "Delivery", short: "Delivery", icon: "🚚" },
  { id: "review", label: "Review", short: "Review", icon: "📦" },
  { id: "confirm", label: "Confirm", short: "Confirm", icon: "✅" },
] as const;

function resolveActiveIndex(step: CheckoutStep): number {
  if (step === "address") return 1;
  if (step === "delivery") return 2;
  return 3;
}

interface CheckoutProgressProps {
  currentStep: CheckoutStep;
  className?: string;
}

export default function CheckoutProgress({
  currentStep,
  className,
}: CheckoutProgressProps) {
  const reduced = useReducedMotion();
  const activeIndex = resolveActiveIndex(currentStep);
  const progress = activeIndex / (STEPS.length - 1);

  return (
    <nav
      aria-label="Checkout progress"
      className={cn(
        "sticky top-0 z-30 -mx-4 border-b border-black/[0.06] bg-white/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6",
        CHECKOUT_MOTION_GPU,
        className
      )}
    >
      <div className="relative hidden lg:block">
        <div
          className="absolute left-0 right-0 top-6 h-0.5 bg-neutral-200/80"
          aria-hidden
        />
        <motion.div
          className="absolute left-0 top-6 h-0.5 origin-left bg-gradient-to-r from-brand-accent via-emerald-500 to-emerald-600"
          initial={false}
          animate={{ scaleX: progress }}
          transition={{ duration: reduced ? 0 : 0.55, ease: CHECKOUT_EASE }}
          style={{ width: "100%", transformOrigin: "left center" }}
          aria-hidden
        />
        <ol className="relative grid grid-cols-5 gap-2">
          {STEPS.map((step, index) => {
            const isComplete = index < activeIndex;
            const isActive = index === activeIndex;
            const isConfirm = step.id === "confirm";
            const isCurrent =
              isActive || (isConfirm && currentStep === "review");

            return (
              <li key={step.id} className="flex flex-col items-center text-center">
                <StepNode
                  step={step}
                  isComplete={isComplete}
                  isCurrent={isCurrent}
                  reduced={reduced}
                />
                <span
                  className={cn(
                    "mt-3 text-[10px] font-bold uppercase tracking-[0.16em]",
                    isCurrent && "text-brand-black",
                    isComplete && "text-emerald-700",
                    !isCurrent && !isComplete && "text-brand-muted"
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="lg:hidden">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-brand-muted">
          <span>Step {activeIndex + 1} of {STEPS.length}</span>
          <span className="text-brand-black">{STEPS[activeIndex]?.label}</span>
        </div>
        <div className="relative h-2 overflow-hidden rounded-full bg-neutral-200/80">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-brand-accent to-emerald-500"
            initial={false}
            animate={{ width: `${((activeIndex + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: reduced ? 0 : 0.45, ease: CHECKOUT_EASE }}
          />
        </div>
        <div className="mt-3 flex justify-between gap-1 overflow-x-auto pb-1 snap-x">
          {STEPS.map((step, index) => {
            const isComplete = index < activeIndex;
            const isActive = index === activeIndex;
            const isConfirm = step.id === "confirm";
            const isCurrent =
              isActive || (isConfirm && currentStep === "review");

            return (
              <div
                key={step.id}
                className={cn(
                  "flex min-w-[4rem] snap-center flex-col items-center gap-1 rounded-xl px-2 py-1.5",
                  isCurrent && "bg-brand-accent/10",
                  isComplete && !isCurrent && "opacity-80"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                    isComplete && "bg-emerald-500 text-white",
                    isCurrent && !isComplete && "bg-brand-accent/20",
                    !isCurrent && !isComplete && "bg-neutral-100"
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" strokeWidth={3} aria-hidden />
                  ) : (
                    <span aria-hidden>{step.icon}</span>
                  )}
                </span>
                <span
                  className={cn(
                    "text-[9px] font-bold uppercase tracking-wider",
                    isCurrent ? "text-brand-black" : "text-brand-muted"
                  )}
                >
                  {step.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

function StepNode({
  step,
  isComplete,
  isCurrent,
  reduced,
}: {
  step: (typeof STEPS)[number];
  isComplete: boolean;
  isCurrent: boolean;
  reduced: boolean | null;
}) {
  const content = (
    <motion.span
      layout
      transition={{ duration: reduced ? 0 : 0.35, ease: CHECKOUT_EASE }}
      className={cn(
        "relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border-2 text-xl shadow-sm",
        isComplete && "border-emerald-500 bg-emerald-500 text-white",
        isCurrent &&
          !isComplete &&
          "border-brand-accent bg-brand-accent/10 shadow-md shadow-brand-accent/20",
        !isCurrent && !isComplete && "border-neutral-200 bg-white"
      )}
    >
      {isComplete ? (
        <Check className="h-5 w-5" strokeWidth={3} aria-hidden />
      ) : (
        <span aria-hidden>{step.icon}</span>
      )}
    </motion.span>
  );

  if (step.id === "cart" && "href" in step && step.href) {
    return (
      <Link
        href={step.href}
        className="rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
      >
        {content}
      </Link>
    );
  }

  return content;
}
