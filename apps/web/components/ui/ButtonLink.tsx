"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonMotion } from "@/lib/motion";
import MagneticMotion from "@/components/motion/MagneticMotion";
import type { ComponentProps } from "react";

type ButtonVariant = "primary" | "outline" | "whatsapp";

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  outline: "btn-outline",
  whatsapp: "btn-whatsapp",
};

const sizes = {
  sm: "px-4 py-2 text-xs",
  md: "",
  lg: "px-10 py-4 text-base",
};

export default function ButtonLink({
  variant = "primary",
  size = "md",
  magnetic = false,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  const reduced = useReducedMotion();
  const { whileHover, whileTap, transition } = buttonMotion(reduced);

  const inner = (
    <motion.span
      className="inline-flex motion-gpu"
      whileHover={magnetic ? undefined : whileHover}
      whileTap={magnetic ? undefined : whileTap}
      transition={transition}
    >
      <Link
        className={cn(variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </Link>
    </motion.span>
  );

  if (magnetic && !reduced) {
    return <MagneticMotion>{inner}</MagneticMotion>;
  }

  return inner;
}
