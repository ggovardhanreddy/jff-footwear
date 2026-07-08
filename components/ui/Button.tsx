"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { buttonMotion } from "@/lib/motion";
import { forwardRef, type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "whatsapp" | "ghost";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const reduced = useReducedMotion();
    const { whileHover, whileTap, transition } = buttonMotion(reduced);

    const variants = {
      primary: "btn-primary",
      outline: "btn-outline",
      whatsapp: "btn-whatsapp",
      ghost:
        "inline-flex items-center justify-center gap-2 text-sm font-medium text-brand-black transition-colors hover:text-brand-accent",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs",
      md: "",
      lg: "px-10 py-4 text-base",
    };

    return (
      <motion.span
        className="inline-flex motion-gpu"
        whileHover={whileHover}
        whileTap={whileTap}
        transition={transition}
      >
        <button
          ref={ref}
          className={cn(variants[variant], sizes[size], className)}
          {...props}
        >
          {children}
        </button>
      </motion.span>
    );
  }
);

Button.displayName = "Button";

export default Button;
