"use client";

import {
  Gem,
  Footprints,
  Shield,
  IndianRupee,
  MapPin,
  Factory,
  Package,
  Store,
  type LucideIcon,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { EASE_LUXURY } from "@/lib/motion";
import type { Feature } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Gem,
  Footprints,
  Shield,
  IndianRupee,
  MapPin,
  Factory,
  Package,
  Store,
};

interface FeaturesGridProps {
  features: Feature[];
  showHeading?: boolean;
}

export default function FeaturesGrid({
  features,
  showHeading = true,
}: FeaturesGridProps) {
  const reduced = useReducedMotion();

  return (
    <div>
      {showHeading && (
        <SectionHeading
          subtitle="Why JFF"
          title="Why Choose JFF"
          titleAs="h1"
          description="Premium quality, reliable manufacturing, and footwear trusted across India."
        />
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {features.map((feature, index) => {
          const Icon = iconMap[feature.icon] || Gem;
          return (
            <motion.div
              key={feature.id}
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                delay: reduced ? 0 : index * 0.06,
                duration: reduced ? 0 : 0.5,
                ease: EASE_LUXURY,
              }}
              className="group rounded-[24px] border border-black/[0.06] bg-white/80 p-8 shadow-soft backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-500 hover:-translate-y-1 hover:border-brand-accent/25 hover:shadow-premium"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-black/[0.06] bg-brand-cream/50 transition-colors duration-300 group-hover:border-brand-accent/30 group-hover:bg-brand-accent/10">
                <Icon className="h-6 w-6 text-brand-accent" aria-hidden />
              </div>
              <h3 className="font-display text-xl font-semibold tracking-tight text-brand-black">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted md:text-[15px]">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
