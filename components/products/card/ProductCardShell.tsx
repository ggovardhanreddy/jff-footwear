"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { hoverLift, MOTION_GPU } from "@/lib/motion";
import { useTilt } from "@/hooks/motionHooks";

interface ProductCardShellProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export default function ProductCardShell({
  children,
  index = 0,
  className,
}: ProductCardShellProps) {
  const prefersReducedMotion = useReducedMotion();
  const tilt = useTilt(8);

  return (
    <motion.article
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              duration: 0.6,
              delay: Math.min(index * 0.05, 0.3),
              ease: [0.22, 1, 0.36, 1],
            }
      }
      className={cn("group relative", MOTION_GPU, className)}
    >
      <motion.div
        {...hoverLift(prefersReducedMotion)}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        style={tilt.style}
        className="luxury-card group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-[box-shadow,background-color] duration-500 group-hover:bg-white/85 group-hover:shadow-[0_24px_56px_-20px_rgba(0,0,0,0.16)]"
      >
        {/* Reflection sweep */}
        <span
          className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-none group-hover:animate-[sweep_0.8s_ease-out] group-hover:opacity-100"
          aria-hidden
        />
        {children}
      </motion.div>
    </motion.article>
  );
}
