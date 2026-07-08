"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { GENDERS } from "@/lib/constants";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const GENDER_EMOJI: Record<string, string> = {
  Men: "👞",
  Women: "👡",
  Kids: "🧒",
  Unisex: "✨",
};

export default function ShopByGender() {
  const reduced = useReducedMotion();

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          subtitle="For Everyone"
          title="Shop by Gender"
          description="Premium slippers crafted for men, women, kids, and unisex styles."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GENDERS.map((gender, index) => (
            <motion.div
              key={gender}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                href={`${ROUTES.products}?gender=${encodeURIComponent(gender)}`}
                className={cn(
                  "focus-ring group flex flex-col items-center rounded-[24px] border border-black/[0.06]",
                  "bg-white p-8 text-center shadow-soft transition-all duration-500",
                  "hover:-translate-y-1 hover:border-brand-accent/30 hover:shadow-premium"
                )}
              >
                <span className="text-4xl" aria-hidden>
                  {GENDER_EMOJI[gender]}
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-brand-black">
                  {gender}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-brand-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Shop
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
