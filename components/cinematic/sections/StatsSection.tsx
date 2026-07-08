"use client";

import { motion, useReducedMotion } from "framer-motion";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import AnimatedCounter from "@/components/cinematic/primitives/AnimatedCounter";
import SplitText from "@/components/cinematic/primitives/SplitText";
import { STATS } from "@/lib/constants";
import { staggerContainer, staggerItem } from "@/lib/motion";

export default function StatsSection() {
  const reduced = useReducedMotion();

  return (
    <SnapSection
      id="stats"
      dark
      className="min-h-[70dvh] justify-center pt-16 lg:min-h-[85dvh]"
    >
      <CinematicBackground variant="dark" intensity="medium" />

      <div className="container-custom relative z-10 flex min-h-0 flex-1 flex-col justify-center py-12">
        <div className="mb-12 text-center">
          <p className="eyebrow">By The Numbers</p>
          <SplitText
            text="Built at Scale. Crafted with Care."
            className="heading-section mx-auto mt-3 max-w-3xl text-white"
          />
        </div>

        <motion.div
          {...staggerContainer(reduced, 0.12)}
          className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-8"
        >
          {STATS.map((stat) => (
            <motion.div key={stat.label} {...staggerItem(reduced)}>
              <AnimatedCounter value={stat.value} label={stat.label} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SnapSection>
  );
}
