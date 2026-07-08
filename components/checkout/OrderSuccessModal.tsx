"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { checkoutSuccessSpring } from "@/lib/checkout-motion";

interface OrderSuccessModalProps {
  show: boolean;
}

export default function OrderSuccessModal({ show }: OrderSuccessModalProps) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-black/45 backdrop-blur-md"
          role="alertdialog"
          aria-live="assertive"
          aria-labelledby="success-title"
          aria-describedby="success-desc"
        >
          <motion.div
            {...checkoutSuccessSpring}
            className="mx-4 flex max-w-md flex-col items-center rounded-[36px] border border-white/25 bg-white/95 px-10 py-14 text-center shadow-2xl"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 16,
                delay: reduced ? 0 : 0.08,
              }}
              className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-xl shadow-emerald-500/35"
            >
              <Check className="h-12 w-12" strokeWidth={2.5} />
            </motion.div>

            <h2
              id="success-title"
              className="font-display text-3xl font-bold text-brand-black"
            >
              Thank You!
            </h2>
            <p className="mt-2 text-lg font-semibold text-emerald-600">
              Order Submitted
            </p>
            <p id="success-desc" className="mt-4 text-sm leading-relaxed text-brand-muted">
              Opening WhatsApp to confirm your order with our team…
            </p>

            <motion.div
              className="mt-6 flex gap-1"
              aria-hidden
              animate={reduced ? undefined : { opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-brand-accent"
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
