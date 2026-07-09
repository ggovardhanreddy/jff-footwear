"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { BUSINESS_PAGES } from "@jff/config/business-pages";
import SectionHeading from "@/components/ui/SectionHeading";
import { getSiteIcon } from "./icons";
import { cn } from "@/lib/utils";

interface BusinessPagesGridProps {
  className?: string;
  excludeHref?: string;
  title?: string;
  description?: string;
  compact?: boolean;
}

export default function BusinessPagesGrid({
  className,
  excludeHref,
  title = "Explore JFF",
  description = "Company information, wholesale programmes, and customer support — all in one place.",
  compact = false,
}: BusinessPagesGridProps) {
  const reduced = useReducedMotion();
  const pages = excludeHref
    ? BUSINESS_PAGES.filter((page) => page.href !== excludeHref)
    : BUSINESS_PAGES;

  return (
    <section className={cn("space-y-10", className)} aria-labelledby="business-pages-grid">
      <SectionHeading
        subtitle="Business Pages"
        title={title}
        description={description}
      />
      <div
        className={cn(
          "grid gap-4",
          compact ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        )}
      >
        {pages.map((page, index) => {
          const Icon = getSiteIcon(page.icon);
          return (
            <motion.div
              key={page.href}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: reduced ? 0 : index * 0.04,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <Link
                href={page.href}
                className="focus-ring group flex h-full flex-col rounded-[24px] border border-black/[0.06] bg-white/70 p-5 shadow-soft backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-brand-accent/25 hover:shadow-premium"
              >
                <div className="mb-4 flex items-start justify-between gap-3">
                  <span className="inline-flex rounded-2xl bg-brand-cream/80 p-3 text-brand-accent">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-brand-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-accent"
                    aria-hidden
                  />
                </div>
                <h3 className="font-display text-base font-semibold text-brand-black">
                  {page.label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-brand-muted">
                  {page.description}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
