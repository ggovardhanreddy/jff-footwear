"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("group relative", className)}
    >
      <motion.div
        whileHover={prefersReducedMotion ? undefined : { y: -12 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="luxury-card relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-[box-shadow,background-color] duration-500 group-hover:bg-white/85 group-hover:shadow-[0_24px_56px_-20px_rgba(0,0,0,0.16)]"
      >
        {children}
      </motion.div>
    </motion.article>
  );
}
