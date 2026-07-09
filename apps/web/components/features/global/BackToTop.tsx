"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, useTransform } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { usePageScrollProgress } from "@/hooks/motionHooks";
import { cn } from "@/lib/utils";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();
  const progress = usePageScrollProgress();
  const ringProgress = useTransform(progress, [0, 1], [0, 1]);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={reduced ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={reduced ? undefined : { opacity: 0, scale: 0.8 }}
          whileHover={reduced ? undefined : { scale: 1.08 }}
          whileTap={reduced ? undefined : { scale: 0.95 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={cn(
            "fixed bottom-[5.75rem] left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full",
            "border border-black/10 bg-white/90 text-brand-black shadow-lg backdrop-blur-md",
            "transition-colors hover:bg-brand-black hover:text-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
            "lg:bottom-6"
          )}
          aria-label="Back to top"
        >
          {!reduced && (
            <svg
              className="absolute inset-0 h-full w-full -rotate-90"
              viewBox="0 0 48 48"
              aria-hidden
            >
              <circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-black/10"
              />
              <motion.circle
                cx="24"
                cy="24"
                r="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-brand-accent"
                style={{
                  pathLength: ringProgress,
                  strokeDasharray: "1 1",
                }}
              />
            </svg>
          )}
          <ArrowUp className="relative h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
