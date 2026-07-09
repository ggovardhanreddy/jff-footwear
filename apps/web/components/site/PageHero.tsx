"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { heroReveal, staggerChildren, fadeUpItem } from "@/lib/animationVariants";
import { MOTION_GPU } from "@/lib/motion";

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
      initial={reduced ? false : "hidden"}
      animate="visible"
      variants={staggerChildren(0.1, 0.05)}
      className={cn(
        "relative overflow-hidden rounded-[32px] border border-black/[0.06] bg-gradient-to-br from-brand-black via-brand-black to-neutral-900 px-8 py-14 text-white shadow-premium md:px-12 md:py-16",
        MOTION_GPU,
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand-accent/10 blur-3xl"
        animate={
          reduced
            ? undefined
            : {
                x: [0, 12, 0],
                y: [0, -8, 0],
                scale: [1, 1.05, 1],
              }
        }
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-brand-blue/20 blur-2xl"
        animate={
          reduced
            ? undefined
            : {
                x: [0, -10, 0],
                y: [0, 6, 0],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <div className="relative z-10 max-w-3xl">
        <motion.p variants={fadeUpItem} className="eyebrow text-brand-accent">
          {eyebrow}
        </motion.p>
        <motion.h1
          variants={heroReveal}
          className="heading-display mt-4 text-white"
        >
          {title}
        </motion.h1>
        {description ? (
          <motion.p variants={fadeUpItem} className="text-lead mt-5 max-w-2xl text-gray-400">
            {description}
          </motion.p>
        ) : null}
      </div>
    </motion.header>
  );
}
