"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type CursorMode = "default" | "pointer" | "view";

/**
 * Dual-layer brand cursor: instant core + soft trailing ring (desktop only).
 */
export default function CursorFollower() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [enabled, setEnabled] = useState(false);

  // Core locks to the pointer with zero lag
  const coreX = useMotionValue(0);
  const coreY = useMotionValue(0);

  // Ring trails lightly for depth (still snappy)
  const ringX = useSpring(coreX, { stiffness: 900, damping: 48, mass: 0.15 });
  const ringY = useSpring(coreY, { stiffness: 900, damping: 48, mass: 0.15 });
  const ringScale = useSpring(1, { stiffness: 700, damping: 32, mass: 0.2 });

  useEffect(() => {
    if (reduced) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const narrow = window.innerWidth < 1024;
    setEnabled(!coarse && !narrow);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("custom-cursor-active");

    const onMove = (e: MouseEvent) => {
      coreX.set(e.clientX);
      coreY.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [role='button'], input, select, textarea")) {
        setMode("pointer");
        ringScale.set(1.35);
      } else if (t.closest("[data-cursor='view']")) {
        setMode("view");
        ringScale.set(1.9);
      } else {
        setMode("default");
        ringScale.set(1);
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, coreX, coreY, ringScale]);

  if (!enabled || reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[500]" aria-hidden>
      {/* Soft trailing ring */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: ringX, y: ringY, scale: ringScale }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.12 }}
      >
        <div
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition-[width,height,border-color,background-color] duration-150",
            mode === "view"
              ? "h-14 w-14 border-brand-accent/70 border-dashed bg-brand-accent/10"
              : mode === "pointer"
                ? "h-9 w-9 border-brand-accent bg-brand-accent/20"
                : "h-8 w-8 border-brand-accent/55 bg-transparent"
          )}
        />
        {mode === "view" && (
          <span className="absolute left-1/2 top-[2.1rem] -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-[0.28em] text-brand-accent">
            View
          </span>
        )}
      </motion.div>

      {/* Instant core — diamond mark */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: coreX, y: coreY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.08 }}
      >
        <div
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 rotate-45 border border-brand-black/80 bg-brand-accent shadow-[0_0_0_1px_rgba(255,255,255,0.35)] transition-[width,height,border-radius,transform] duration-100",
            mode === "pointer"
              ? "h-2 w-2 rotate-0 rounded-full"
              : mode === "view"
                ? "h-1.5 w-1.5 rounded-[1px]"
                : "h-2 w-2 rounded-[1px]"
          )}
        />
      </motion.div>
    </div>
  );
}
