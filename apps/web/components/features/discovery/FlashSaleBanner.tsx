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

export default function FlashSaleBanner({ className, hoursLeft = 24 }: FlashSaleBannerProps) {
  const reduced = useReducedMotion();
  const [endTime, setEndTime] = useState<number | null>(null);

  useEffect(() => {
    setEndTime(Date.now() + hoursLeft * 3600_000);
  }, [hoursLeft]);

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
      <div
        className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-brand-accent/20 blur-3xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/20">
            <Zap className="h-6 w-6 text-brand-accent" aria-hidden />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-accent">
              Flash Sale
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
              Limited-time JFF deals
            </h2>
          </div>
        </div>
        {endTime != null ? (
          <OfferCountdown endTime={endTime} />
        ) : (
          <div className="h-[4.5rem] w-48 animate-pulse rounded-2xl bg-white/10" aria-hidden />
        )}
      </div>
    </motion.div>
  );
}
