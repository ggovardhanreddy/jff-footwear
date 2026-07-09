"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { checkoutSuccessSpring } from "@/lib/checkout-motion";

interface SuccessBurstProps {
  show: boolean;
  label?: string;
}

/** Full-screen success pulse — cart add, form submit, etc. */
export default function SuccessBurst({
  show,
  label = "Added!",
}: SuccessBurstProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[350] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-live="polite"
          role="status"
        >
          <motion.div
            initial={reduced ? false : checkoutSuccessSpring.initial}
            animate={checkoutSuccessSpring.animate}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={checkoutSuccessSpring.transition}
            className="flex flex-col items-center gap-3"
          >
            <motion.span
              className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-3xl text-white shadow-[0_20px_60px_-12px_rgba(16,185,129,0.55)]"
              animate={
                reduced
                  ? undefined
                  : {
                      boxShadow: [
                        "0 20px 60px -12px rgba(16,185,129,0.55)",
                        "0 24px 80px -8px rgba(16,185,129,0.7)",
                        "0 20px 60px -12px rgba(16,185,129,0.55)",
                      ],
                    }
              }
              transition={{ duration: 1.2, repeat: 1 }}
            >
              ✓
            </motion.span>
            <span className="rounded-full bg-brand-black/80 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md">
              {label}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
