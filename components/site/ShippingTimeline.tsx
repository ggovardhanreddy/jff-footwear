"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SHIPPING_TIMELINE } from "@/data/pages";
import { cn } from "@/lib/utils";

interface ShippingTimelineProps {
  className?: string;
}

export default function ShippingTimeline({ className }: ShippingTimelineProps) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("relative", className)}>
      <div
        className="absolute left-5 top-0 hidden h-full w-px bg-gradient-to-b from-brand-accent/40 via-brand-accent/20 to-transparent md:block"
        aria-hidden
      />
      <ol className="space-y-6">
        {SHIPPING_TIMELINE.map((item, index) => (
          <motion.li
            key={item.step}
            initial={reduced ? false : { opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            className="relative flex gap-5 md:pl-2"
          >
            <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-accent/30 bg-white text-sm font-bold text-brand-accent shadow-sm">
              {item.step}
            </div>
            <div className="flex-1 rounded-[20px] border border-black/[0.06] bg-white/70 p-5 backdrop-blur-sm">
              <h3 className="font-display font-semibold text-brand-black">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
                {item.description}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
