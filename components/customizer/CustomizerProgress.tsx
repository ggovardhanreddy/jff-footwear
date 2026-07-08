"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomizerProgressProps {
  currentStep: number;
  totalSteps: number;
}

export default function CustomizerProgress({
  currentStep,
  totalSteps,
}: CustomizerProgressProps) {
  const reduced = useReducedMotion();
  const pct = (currentStep / totalSteps) * 100;

  return (
    <div className="sticky top-16 z-30 border-b border-black/[0.06] bg-white/90 py-4 backdrop-blur-xl">
      <div className="container-custom">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-brand-muted">
          <span>
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-brand-accent">{Math.round(pct)}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
          <motion.div
            className="h-full rounded-full bg-brand-accent"
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={reduced ? { duration: 0 } : { duration: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
}
