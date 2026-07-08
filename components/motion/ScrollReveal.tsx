"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { blurReveal } from "@/lib/animationVariants";
import { cn } from "@/lib/utils";
import { MOTION_GPU } from "@/lib/motion";

type RevealVariant = "fadeUp" | "blur" | "scale" | "slideLeft" | "slideRight";

const variants: Record<RevealVariant, Variants> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
    },
  },
  blur: blurReveal,
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
    },
  },
  slideLeft: {
    hidden: { opacity: 0, x: -48 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  },
  slideRight: {
    hidden: { opacity: 0, x: 48 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  },
};

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article";
}

const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
};

export default function ScrollReveal({
  children,
  variant = "fadeUp",
  className,
  delay = 0,
  as = "div",
}: ScrollRevealProps) {
  const reduced = useReducedMotion();
  const Tag = motionTags[as];

  return (
    <Tag
      className={cn(MOTION_GPU, className)}
      initial={reduced ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-64px", amount: 0.2 }}
      variants={variants[variant]}
      transition={{ delay: reduced ? 0 : delay }}
    >
      {children}
    </Tag>
  );
}
