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
  /** Use h1 for page-level titles (SEO / a11y). */
  titleAs?: "h1" | "h2";
  className?: string;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  theme = "light",
  titleAs = "h2",
  className,
}: SectionHeadingProps) {
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme === "dark";
  const TitleTag = titleAs;

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.55, ease: EASE_LUXURY }}
      className={cn(
        "mb-12 md:mb-16 lg:mb-20",
        align === "center" && "text-center",
        className
      )}
    >
      {subtitle && <p className="eyebrow mb-4">{subtitle}</p>}
      <TitleTag
        className={cn(
          titleAs === "h1" ? "heading-page text-balance" : "heading-section text-balance",
          isDark ? "text-white" : "text-brand-black"
        )}
      >
        {title}
      </TitleTag>
      {description && (
        <p
          className={cn(
            "text-lead mx-auto mt-5 max-w-2xl",
            isDark && "text-gray-400"
          )}
        >
          {description}
        </p>
      )}
    </motion.header>
  );
}
