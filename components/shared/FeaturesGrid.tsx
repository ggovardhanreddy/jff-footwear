"use client";

import {
  Gem,
  Footprints,
  Shield,
  Palette,
  Leaf,
  Globe,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import type { Feature } from "@/types";

const iconMap: Record<string, LucideIcon> = {
  Gem,
  Footprints,
  Shield,
  Palette,
  Leaf,
  Globe,
};

interface FeaturesGridProps {
  features: Feature[];
  showHeading?: boolean;
}

export default function FeaturesGrid({
  features,
  showHeading = true,
}: FeaturesGridProps) {
  return (
    <div>
      {showHeading && (
        <SectionHeading
          subtitle="Excellence"
          title="Our Features"
          description="What sets JFF slippers apart from the rest."
        />
      )}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => {
          const Icon = iconMap[feature.icon] || Gem;
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group p-8 transition-colors hover:bg-white"
            >
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center border border-gray-200 transition-colors group-hover:border-brand-accent group-hover:bg-brand-accent/10">
                <Icon className="h-6 w-6 text-brand-accent" />
              </div>
              <h3 className="font-display text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
