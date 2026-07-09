"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { brandDark, brandLight } from "@jff/ui/brand";

/** Ambient gradient orbs — adapts to light/dark theme; respects reduced motion. */
export default function BrandAtmosphere() {
  const { resolved } = useTheme();
  const reduced = useReducedMotion();
  const tokens = resolved === "dark" ? brandDark : brandLight;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{ background: tokens.gradient }}
      />
      {!reduced ? (
        <>
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-32 top-20 h-96 w-96 rounded-full opacity-40 blur-3xl dark:opacity-25"
            style={{ background: resolved === "dark" ? "#3b82f6" : "#93c5fd" }}
          />
          <motion.div
            animate={{ x: [0, -24, 0], y: [0, 16, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-24 bottom-32 h-80 w-80 rounded-full opacity-30 blur-3xl dark:opacity-20"
            style={{ background: resolved === "dark" ? "#6366f1" : "#bfdbfe" }}
          />
        </>
      ) : null}
    </div>
  );
}
