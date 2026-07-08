"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
} from "framer-motion";

interface ScrollProgressProps {
  enabled: boolean;
}

export default function ScrollProgress({ enabled }: ScrollProgressProps) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => setMounted(true), []);

  if (!enabled || !mounted || reduced) return null;

  return (
    <motion.div
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-gradient-to-r from-brand-accent via-white to-brand-accent"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
