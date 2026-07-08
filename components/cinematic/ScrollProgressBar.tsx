"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";

export default function ScrollProgressBar() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduced) return null;

  return (
    <motion.div
      className="fixed left-0 top-0 z-[60] h-[2px] w-full origin-left bg-brand-accent shadow-[0_0_12px_rgba(200,169,110,0.6)]"
      style={{ scaleX }}
      aria-hidden
    />
  );
}
