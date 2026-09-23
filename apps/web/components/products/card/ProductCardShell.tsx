"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { hoverLift, MOTION_GPU } from "@/lib/motion";

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
      data-cursor="view"
      className={cn("group relative [perspective:1200px]", MOTION_GPU, className)}
    >
      <motion.div
        {...hoverLift(prefersReducedMotion)}
        className="luxury-card group relative overflow-hidden rounded-[28px] border border-black/[0.06] bg-[#fffcf8] shadow-[0_16px_40px_-20px_rgba(40,28,16,0.18)] transition-[box-shadow,transform] duration-500 group-hover:shadow-[0_28px_60px_-24px_rgba(40,28,16,0.28)] dark:border-white/10 dark:bg-[#1c1916] dark:shadow-[0_18px_44px_-20px_rgba(0,0,0,0.65)]"
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
