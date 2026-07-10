"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightNavbarProps = {
  children: ReactNode;
  className?: string;
  below?: ReactNode;
  hideOnScroll?: boolean;
};

/**
 * Sticky glass navbar — Framer Motion only (no GSAP).
 * Spotlight + hide-on-scroll disabled for reduced motion / touch.
 * Client-only motion prefs are applied after mount to avoid hydration drift.
 */
export default function SpotlightNavbar({
  children,
  className,
  below,
  hideOnScroll = true,
}: SpotlightNavbarProps) {
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [spotlightOn, setSpotlightOn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const lastY = useRef(0);
  const spotlightX = useMotionValue(-200);
  const spotlightY = useMotionValue(-200);
  const springX = useSpring(spotlightX, { stiffness: 120, damping: 22 });
  const springY = useSpring(spotlightY, { stiffness: 120, damping: 22 });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    setSpotlightOn(!reduced && !coarse);
  }, [reduced, mounted]);

  useEffect(() => {
    if (!mounted) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const allowHide = hideOnScroll && !reduced && !coarse;

    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 16);
      if (!allowHide) {
        setHidden(false);
        lastY.current = y;
        return;
      }
      if (y < 48) {
        setHidden(false);
      } else if (y > lastY.current + 10) {
        setHidden(true);
      } else if (y < lastY.current - 10) {
        setHidden(false);
      }
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnScroll, reduced, mounted]);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-110%" : 0 }}
      transition={{
        duration: !mounted || reduced ? 0 : 0.35,
        ease: [0.22, 1, 0.36, 1],
      }}
      onPointerMove={(e) => {
        if (!spotlightOn || e.pointerType === "touch") return;
        const rect = e.currentTarget.getBoundingClientRect();
        spotlightX.set(e.clientX - rect.left);
        spotlightY.set(e.clientY - rect.top);
      }}
      className={cn(
        "fixed top-0 z-50 w-full border-b border-black/[0.06] bg-white/80 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)] backdrop-blur-2xl backdrop-saturate-150 transition-[box-shadow] duration-500 dark:border-white/10 dark:bg-brand-charcoal/75 dark:shadow-glass",
        scrolled && "md:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.1)]",
        className
      )}
      suppressHydrationWarning
    >
      {spotlightOn ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,169,110,0.22),transparent_70%)]"
            style={{ left: springX, top: springY }}
          />
        </div>
      ) : null}
      <div className="relative z-10">{children}</div>
      {below}
    </motion.header>
  );
}
