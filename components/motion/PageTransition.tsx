"use client";

import { motion, useReducedMotion } from "framer-motion";
import { pageTransition, pageTransitionReduced } from "@/lib/animationVariants";
import { MOTION_GPU } from "@/lib/motion";

export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={MOTION_GPU}
      initial={reduced ? false : pageTransition.initial}
      animate={reduced ? pageTransitionReduced.animate : pageTransition.animate}
      exit={reduced ? undefined : pageTransition.exit}
    >
      {children}
    </motion.div>
  );
}
