"use client";

import { AnimatePresence } from "framer-motion";
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
  const { showIntro, completeIntro } = useIntroLoader();

  return (
    <>
      <AnimatePresence mode="wait">
        {showIntro && (
          <CinematicPageLoader key="loader" onComplete={completeIntro} />
        )}
      </AnimatePresence>

      {/* Always render landing content for static export / no-JS fallback */}
      <CinematicLanding {...props} />
    </>
  );
}
