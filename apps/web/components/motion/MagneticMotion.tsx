"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/motionHooks";
import { cn } from "@/lib/utils";

interface MagneticMotionProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}

/** Spring-based magnetic pull for buttons and CTAs. */
export default function MagneticMotion({
  children,
  className,
  strength = 0.15,
}: MagneticMotionProps) {
  const { x, y, onMouseMove, onMouseLeave, disabled } = useMagnetic(strength);

  if (disabled) {
    return <span className={cn("inline-flex motion-gpu", className)}>{children}</span>;
  }

  return (
    <motion.span
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("inline-flex motion-gpu", className)}
    >
      {children}
    </motion.span>
  );
}
