"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  className,
}: PageHeroProps) {
  const reduced = useReducedMotion();

  return (
    <motion.header
      initial={reduced ? false : { opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-black/[0.06] bg-gradient-to-br from-brand-black via-brand-black to-neutral-900 px-8 py-14 text-white shadow-premium md:px-12 md:py-16",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-white/5 blur-2xl"
        aria-hidden
      />
      <div className="relative z-10 max-w-3xl">
        <p className="eyebrow text-brand-accent">{eyebrow}</p>
        <h1 className="heading-display mt-4 text-white">{title}</h1>
        {description ? (
          <p className="text-lead mt-5 max-w-2xl text-gray-400">{description}</p>
        ) : null}
      </div>
    </motion.header>
  );
}
