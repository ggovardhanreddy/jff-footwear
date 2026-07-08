"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInSection, MOTION_GPU } from "@/lib/motion";

interface MotionSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "section" | "div" | "article";
  id?: string;
}

export default function MotionSection({
  children,
  className,
  delay = 0,
  as = "section",
  id,
}: MotionSectionProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  return (
    <Component
      id={id}
      className={cn(MOTION_GPU, className)}
      {...fadeInSection(reduced, delay)}
    >
      {children}
    </Component>
  );
}
