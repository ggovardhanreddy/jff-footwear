"use client";

import { motion } from "framer-motion";

export default function AnimatedLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-16"
      role="status"
      aria-label={label}
    >
      <div className="relative h-12 w-12">
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-brand-accent/20"
          aria-hidden
        />
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-brand-accent"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          aria-hidden
        />
      </div>
      <p className="text-sm font-medium text-brand-muted">{label}…</p>
    </div>
  );
}
