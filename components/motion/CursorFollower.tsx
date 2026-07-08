"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type CursorMode = "default" | "pointer" | "view" | "drag";

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
        scale.set(1.6);
      } else if (t.closest("[data-cursor='view']")) {
        setMode("view");
        scale.set(2.2);
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
      className="pointer-events-none fixed left-0 top-0 z-[500] mix-blend-difference"
      style={{ x: cursorX, y: cursorY, scale }}
      animate={{ opacity: visible ? 1 : 0 }}
      aria-hidden
    >
      <div
        className={cn(
          "-translate-x-1/2 -translate-y-1/2 rounded-full border border-white transition-all duration-200",
          mode === "default" && "h-3 w-3",
          mode === "pointer" && "h-2 w-2 bg-white",
          mode === "view" && "h-10 w-10 border-2"
        )}
      />
      {mode === "view" && (
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-bold uppercase tracking-widest text-white">
          View
        </span>
      )}
    </motion.div>
  );
}
