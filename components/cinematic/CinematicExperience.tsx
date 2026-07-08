"use client";

import { motion, AnimatePresence } from "framer-motion";
import CinematicPageLoader from "./CinematicPageLoader";
import CinematicLanding from "./CinematicLanding";
import { useIntroLoader } from "@/hooks/motionHooks";
import type { Feature, Product, ProductColor } from "@/types";

interface MaterialItem {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

interface ColorItem {
  color: ProductColor;
  image: string;
  slug: string;
  name: string;
}

interface CinematicExperienceProps {
  heroProduct: Product;
  comfortProduct: Product;
  showcaseProduct: Product;
  galleryProducts: Product[];
  materials: MaterialItem[];
  colors: ColorItem[];
  features: Feature[];
}

export default function CinematicExperience(props: CinematicExperienceProps) {
  const { showIntro, ready, completeIntro } = useIntroLoader();

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <CinematicPageLoader key="loader" onComplete={completeIntro} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: showIntro ? 0.1 : 0 }}
        aria-hidden={!ready}
      >
        {ready && <CinematicLanding {...props} />}
      </motion.div>
    </>
  );
}
