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
import { motion, useReducedMotion } from "framer-motion";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import SplitText from "@/components/cinematic/primitives/SplitText";
import { staggerContainer, staggerItem } from "@/lib/motion";
import type { Feature } from "@/types";

const ICONS: Record<string, LucideIcon> = {
  Gem,
  Footprints,
  Shield,
  Palette,
  Leaf,
  Globe,
};

interface FeaturesSectionProps {
  features: Feature[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  const reduced = useReducedMotion();

  return (
    <SnapSection id="features" dark className="justify-center pt-16">
      <CinematicBackground variant="dark" intensity="medium" />

      <div className="container-custom relative z-10 flex min-h-0 flex-1 flex-col justify-center py-10">
        <div className="mb-10 text-center">
          <p className="eyebrow">Section 05</p>
          <SplitText
            text="The JFF Difference"
            className="heading-section mx-auto mt-3 max-w-3xl text-white"
          />
        </div>

        <motion.div
          {...staggerContainer(reduced, 0.08)}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = ICONS[feature.icon] ?? Gem;
            return (
              <motion.article
                key={feature.id}
                {...staggerItem(reduced)}
                className="group rounded-[28px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-brand-accent/30 hover:bg-white/[0.07]"
              >
                <div className="mb-5 inline-flex rounded-2xl bg-brand-accent/15 p-3 text-brand-accent transition-transform duration-500 group-hover:scale-110">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="font-display text-xl font-bold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                  {feature.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </SnapSection>
  );
}
