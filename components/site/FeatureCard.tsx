"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getSiteIcon } from "./icons";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  className?: string;
  index?: number;
}

export default function FeatureCard({
  title,
  description,
  icon,
  className,
  index = 0,
}: FeatureCardProps) {
  const reduced = useReducedMotion();
  const Icon = getSiteIcon(icon);

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={{
        delay: reduced ? 0 : index * 0.06,
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={reduced ? undefined : { y: -4 }}
      className={cn(
        "group rounded-[24px] border border-black/[0.06] bg-white/70 p-6 shadow-soft backdrop-blur-md transition-[border-color,box-shadow] duration-300 hover:border-brand-accent/25 hover:shadow-premium md:p-8",
        className
      )}
    >
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-black/[0.05] bg-brand-cream/60 text-brand-accent transition-colors group-hover:bg-brand-accent/10">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h3 className="font-display text-lg font-semibold tracking-tight text-brand-black">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-brand-muted">{description}</p>
    </motion.article>
  );
}
