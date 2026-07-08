"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import { COMPANY } from "@/lib/constants";

interface IntroSplashProps {
  onComplete: () => void;
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const duration = reduced ? 600 : 2400;
    const timer = setTimeout(onComplete, duration);
    return () => clearTimeout(timer);
  }, [onComplete, reduced, mounted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onComplete]);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-black">
        <AssetImage
          src="/images/logo.svg"
          alt={COMPANY.fullName}
          width={120}
          height={48}
          priority
          className="h-14 w-auto brightness-0 invert"
        />
      </div>
    );
  }

  return (
    <motion.div
      key="intro-splash"
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-brand-black"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.25 : 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <CinematicBackground variant="dark" intensity="medium" />

      <motion.button
        type="button"
        onClick={onComplete}
        className="absolute inset-0 z-10 cursor-pointer"
        aria-label="Enter JFF Footwear website"
      />

      <motion.div
        initial={reduced ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none relative z-20 flex flex-col items-center"
      >
        <motion.div
          animate={reduced ? undefined : { scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <AssetImage
            src="/images/logo.svg"
            alt={COMPANY.fullName}
            width={120}
            height={48}
            priority
            className="h-14 w-auto brightness-0 invert md:h-16"
          />
        </motion.div>

        <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.5em] text-brand-accent">
          Crafted Comfort
        </p>

        <p className="mt-10 text-[10px] uppercase tracking-[0.3em] text-gray-500">
          Tap or press Enter to continue
        </p>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute bottom-12 h-px w-24 bg-brand-accent/40"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 1.2, ease: "easeOut" }}
      />
    </motion.div>
  );
}
