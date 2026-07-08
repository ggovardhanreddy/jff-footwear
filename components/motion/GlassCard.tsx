"use client";

import { motion, useReducedMotion } from "framer-motion";
import { glassCardHover } from "@/lib/animationVariants";
import { MOTION_GPU } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({
  children,
  className,
  hover = true,
}: GlassCardProps) {
  const reduced = useReducedMotion();

  if (reduced || !hover) {
    return (
      <div
        className={cn(
          "rounded-[28px] border border-white/60 bg-white/70 shadow-soft backdrop-blur-xl",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={cn(
        MOTION_GPU,
        "rounded-[28px] border border-white/60 bg-white/70 backdrop-blur-xl",
        className
      )}
      initial="rest"
      whileHover="hover"
      variants={glassCardHover}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      {children}
    </motion.div>
  );
}
