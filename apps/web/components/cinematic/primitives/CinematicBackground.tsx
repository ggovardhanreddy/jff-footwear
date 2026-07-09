"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CinematicBackgroundProps {
  variant?: "dark" | "light" | "cream";
  className?: string;
  intensity?: "subtle" | "medium";
}

export default function CinematicBackground({
  variant = "dark",
  className,
  intensity = "subtle",
}: CinematicBackgroundProps) {
  const reduced = useReducedMotion();
  const opacity = intensity === "subtle" ? 0.35 : 0.55;

  const base =
    variant === "dark"
      ? "from-brand-black via-[#0f0f0f] to-brand-black"
      : variant === "cream"
        ? "from-brand-cream via-[#f7f3ed] to-brand-cream"
        : "from-white via-brand-cream to-white";

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br", base)} />

      {!reduced && (
        <>
          <motion.div
            className="absolute -left-[20%] top-[10%] h-[55vh] w-[55vh] rounded-full bg-brand-accent/20 blur-[120px]"
            animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity }}
          />
          <motion.div
            className="absolute -right-[15%] bottom-[5%] h-[45vh] w-[45vh] rounded-full bg-white/10 blur-[100px]"
            animate={{ x: [0, -35, 0], y: [0, -25, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity }}
          />
          <motion.div
            className="absolute left-[40%] top-[45%] h-[30vh] w-[30vh] rounded-full bg-brand-accent/10 blur-[80px]"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            style={{ opacity: opacity * 0.8 }}
          />

          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className={cn(
                "absolute h-1 w-1 rounded-full",
                variant === "dark" ? "bg-white/20" : "bg-brand-accent/30"
              )}
              style={{
                left: `${8 + ((i * 17) % 84)}%`,
                top: `${12 + ((i * 23) % 76)}%`,
              }}
              animate={{ y: [0, -12 - (i % 4) * 4, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{
                duration: 6 + (i % 5),
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
