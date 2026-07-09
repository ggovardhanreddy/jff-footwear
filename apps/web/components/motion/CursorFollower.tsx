"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type CursorMode = "default" | "pointer" | "view";

/**
 * Premium spotlight cursor — radial glow + precision dot (desktop only).
 */
export default function CursorFollower() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [enabled, setEnabled] = useState(false);

  const cursorX = useSpring(0, { stiffness: 500, damping: 40 });
  const cursorY = useSpring(0, { stiffness: 500, damping: 40 });
  const scale = useSpring(1, { stiffness: 400, damping: 28 });

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
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setVisible(true);
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [role='button'], input, select, textarea")) {
        setMode("pointer");
        scale.set(1.5);
      } else if (t.closest("[data-cursor='view']")) {
        setMode("view");
        scale.set(2.4);
      } else {
        setMode("default");
        scale.set(1);
      }
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.body.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, cursorX, cursorY, scale]);

  if (!enabled || reduced) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[500]"
      style={{ x: cursorX, y: cursorY, scale }}
      animate={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      {/* Spotlight glow */}
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300",
          mode === "view"
            ? "h-40 w-40 bg-brand-accent/20 blur-2xl"
            : mode === "pointer"
              ? "h-16 w-16 bg-brand-accent/25 blur-xl"
              : "h-28 w-28 bg-brand-accent/10 blur-2xl"
        )}
      />
      {/* Precision dot */}
      <div
        className={cn(
          "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-accent/80 bg-white/90 mix-blend-difference transition-all duration-200",
          mode === "view" ? "h-3 w-3" : mode === "pointer" ? "h-2 w-2 bg-brand-accent" : "h-2.5 w-2.5"
        )}
      />
      {mode === "view" && (
        <span className="absolute left-1/2 top-6 -translate-x-1/2 text-[9px] font-bold uppercase tracking-[0.2em] text-brand-accent">
          View
        </span>
      )}
    </motion.div>
  );
}
