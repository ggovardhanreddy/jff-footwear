"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_LUXURY } from "@/lib/motion";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  theme = "light",
  className,
}: SectionHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: EASE_LUXURY }}
      className={cn(
        "mb-10 md:mb-14 lg:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {subtitle && <p className="eyebrow mb-3">{subtitle}</p>}
      <h2
        className={cn(
          "heading-section text-balance",
          isDark ? "text-white" : "text-brand-black"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-body mx-auto mt-4 max-w-2xl",
            isDark && "text-gray-400"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
