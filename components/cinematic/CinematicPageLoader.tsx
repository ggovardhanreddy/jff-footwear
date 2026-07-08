"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import {
  DURATION,
  expandBackground,
  lightSweep,
  loaderLogo,
} from "@/lib/animationVariants";
import { COMPANY } from "@/lib/constants";

interface CinematicPageLoaderProps {
  onComplete: () => void;
}

export default function CinematicPageLoader({
  onComplete,
}: CinematicPageLoaderProps) {
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"logo" | "glow" | "sweep" | "exit">("logo");

  useEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }
    const t1 = setTimeout(() => setPhase("glow"), 700);
    const t2 = setTimeout(() => setPhase("sweep"), 1100);
    const t3 = setTimeout(() => setPhase("exit"), 1800);
    const t4 = setTimeout(onComplete, DURATION.loader * 1000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete, reduced]);

  useEffect(() => {
    const skip = (e: KeyboardEvent) => {
      if (["Enter", " ", "Escape"].includes(e.key)) {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [onComplete]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-black"
        exit={{ opacity: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        role="dialog"
        aria-label="Loading JFF Footwear"
        aria-busy="true"
      >
        {/* Radial expand */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-accent/30 blur-3xl"
          variants={expandBackground}
          initial="initial"
          animate={phase === "sweep" || phase === "exit" ? "animate" : "initial"}
        />

        {/* Light sweep */}
        <motion.div
          className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
          variants={lightSweep}
          initial="initial"
          animate={phase === "sweep" || phase === "exit" ? "animate" : "initial"}
        />

        {/* Film grain */}
        <div className="cinematic-grain pointer-events-none absolute inset-0 opacity-[0.04]" aria-hidden />

        <button
          type="button"
          className="absolute inset-0 z-10 cursor-pointer"
          onClick={onComplete}
          aria-label="Skip intro"
        />

        <motion.div
          className="relative z-20 flex flex-col items-center"
          variants={loaderLogo}
          initial="hidden"
          animate={phase === "glow" || phase === "sweep" || phase === "exit" ? "glow" : "visible"}
        >
          <AssetImage
            src="/images/logo.svg"
            alt={COMPANY.fullName}
            width={140}
            height={56}
            priority
            className="h-16 w-auto brightness-0 invert md:h-[4.5rem]"
          />
          <motion.p
            className="mt-8 text-[10px] font-semibold uppercase tracking-[0.5em] text-brand-accent"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Crafted Comfort
          </motion.p>
        </motion.div>

        <motion.div
          className="pointer-events-none absolute bottom-12 h-px w-32 bg-gradient-to-r from-transparent via-brand-accent to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
        />
      </motion.div>
    </AnimatePresence>
  );
}
