"use client";

import { motion, useReducedMotion } from "framer-motion";
import ButtonLink from "@/components/ui/ButtonLink";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel = "Explore Collection",
  actionHref = "/products",
  className,
}: EmptyStateProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("mx-auto max-w-md py-16 text-center", className)}
    >
      <div className="relative mx-auto mb-8 h-36 w-36">
        <motion.div
          animate={reduced ? undefined : { y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-brand-cream to-brand-accent/15"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg">
            <Icon className="h-8 w-8 text-brand-accent" aria-hidden />
          </div>
        </div>
      </div>
      <h2 className="font-display text-2xl font-bold text-brand-black">{title}</h2>
      <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
        {description}
      </p>
      {actionHref && (
        <div className="mt-8">
          <ButtonLink href={actionHref} size="lg">
            {actionLabel}
          </ButtonLink>
        </div>
      )}
    </motion.div>
  );
}
