"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScrollStoryProps {
  children: ReactNode;
  className?: string;
  /** Vertical parallax intensity in px */
  parallax?: number;
}

/** Scroll-driven storytelling — content fades and drifts as it enters the viewport. */
export default function ScrollStory({
  children,
  className,
  parallax = 48,
}: ScrollStoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [parallax, -parallax]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.35, 1, 1, 0.35]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.97, 1, 0.98]);

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : { y, opacity, scale }}
      className={cn("motion-gpu will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
