"use client";

import { motion, useReducedMotion } from "framer-motion";
import { COMPANY } from "@/lib/constants";

const ITEMS = [
  "MADE IN INDIA",
  "PREMIUM QUALITY",
  "RETAIL & WHOLESALE",
  "RAYACHOTY, ANDHRA PRADESH",
  "SINCE 2021",
  "COMFORT & DURABILITY",
  "BULK ORDERS WELCOME",
];

export default function BrandMarquee() {
  const reduced = useReducedMotion();
  const track = [...ITEMS, ...ITEMS];

  if (reduced) {
    return (
      <div className="border-y border-white/10 bg-brand-black/80 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-500">
        {ITEMS.join(" · ")}
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border-y border-white/10 bg-brand-black/90 py-3.5 backdrop-blur-sm">
      <motion.div
        className="flex w-max gap-12 whitespace-nowrap px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {track.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex items-center gap-12 text-[10px] font-semibold uppercase tracking-[0.35em] text-gray-500"
          >
            {item}
            <span className="h-1 w-1 rounded-full bg-brand-accent/80" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
