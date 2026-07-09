"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Zap } from "lucide-react";
import OfferCountdown from "./OfferCountdown";
import { cn } from "@/lib/utils";

interface FlashSaleBannerProps {
  className?: string;
  /** Hours until flash sale ends */
  hoursLeft?: number;
}

export default function FlashSaleBanner({
  className,
  hoursLeft = 24,
}: FlashSaleBannerProps) {
  const reduced = useReducedMotion();
  const endTime = useState(() => Date.now() + hoursLeft * 3600_000)[0];

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative overflow-hidden rounded-[28px] bg-gradient-to-r from-brand-black via-brand-dark to-brand-black p-6 text-white sm:p-8",
        className
      )}
      role="banner"
    >
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-accent/20 blur-3xl" aria-hidden />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/20">
            <Zap className="h-6 w-6 text-brand-accent" aria-hidden />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-accent">
              Flash Sale
            </p>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Up to 60% Off Premium Footwear
            </h2>
            <p className="mt-2 text-sm text-white/70">
              Limited-time factory-direct pricing. While stocks last.
            </p>
          </div>
        </div>
        <OfferCountdown endTime={endTime} />
      </div>
    </motion.div>
  );
}
