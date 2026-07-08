"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Ruler } from "lucide-react";
import { SIZE_GUIDE_DATA } from "@/data/pages";
import { cn } from "@/lib/utils";

interface SizeGuideProps {
  className?: string;
  compact?: boolean;
}

function SizeTable({
  label,
  sizes,
}: {
  label: string;
  sizes: readonly { size: string; footCm: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-black/[0.06] bg-white/80 shadow-soft backdrop-blur-sm">
      <div className="bg-brand-black px-5 py-3.5">
        <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-white">
          {label}
        </h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-black/5 bg-brand-cream/50">
            <th className="px-4 py-3 text-left font-semibold text-brand-black">
              Size (IN)
            </th>
            <th className="px-4 py-3 text-left font-semibold text-brand-black">
              Foot Length (cm)
            </th>
          </tr>
        </thead>
        <tbody>
          {sizes.map((row) => (
            <tr
              key={row.size}
              className="border-b border-black/5 last:border-0 transition-colors hover:bg-brand-cream/30"
            >
              <td className="px-4 py-2.5 font-medium">{row.size}</td>
              <td className="px-4 py-2.5 text-brand-muted">{row.footCm} cm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SizeGuide({ className, compact = false }: SizeGuideProps) {
  const reduced = useReducedMotion();
  const { men, women, kids, measureSteps, tips } = SIZE_GUIDE_DATA;

  return (
    <div className={cn("space-y-10", className)}>
      {!compact ? (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[28px] border border-black/[0.06] bg-white/70 p-6 backdrop-blur-md md:p-8"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
              <Ruler className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">How to Measure Your Foot</h2>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
                {measureSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </motion.div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <SizeTable label={men.label} sizes={men.sizes} />
        <SizeTable label={women.label} sizes={women.sizes} />
        <SizeTable label={kids.label} sizes={kids.sizes} />
      </div>

      {!compact ? (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[28px] border border-brand-accent/15 bg-brand-cream/40 p-6 md:p-8"
        >
          <h2 className="font-display text-lg font-bold">Tips for Choosing the Right Size</h2>
          <ul className="mt-4 space-y-2 text-sm text-brand-muted">
            {tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-brand-accent">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </div>
  );
}
