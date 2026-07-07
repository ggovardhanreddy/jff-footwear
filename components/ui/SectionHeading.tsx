"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  subtitle,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className={cn(
        "mb-12 md:mb-16",
        align === "center" && "text-center",
        className
      )}
    >
      {subtitle && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
          {subtitle}
        </p>
      )}
      <h2 className="heading-section text-balance text-brand-black">{title}</h2>
      {description && (
        <p className="text-body mx-auto mt-4 max-w-2xl">{description}</p>
      )}
    </motion.div>
  );
}
