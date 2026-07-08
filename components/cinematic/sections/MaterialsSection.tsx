"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import SplitText from "@/components/cinematic/primitives/SplitText";
import { staggerContainer, staggerItem } from "@/lib/motion";

interface MaterialItem {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

interface MaterialsSectionProps {
  materials: MaterialItem[];
}

export default function MaterialsSection({ materials }: MaterialsSectionProps) {
  const reduced = useReducedMotion();

  return (
    <SnapSection id="materials" dark className="justify-center pt-16">
      <CinematicBackground variant="dark" />

      <div className="container-custom relative z-10 flex min-h-0 flex-1 flex-col justify-center py-10">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow">Section 03</p>
          <SplitText
            text="Premium Materials"
            className="heading-section mt-3 text-white"
          />
          <p className="mt-4 text-gray-400">
            Each compound is selected for performance — comfort, durability, or
            water resistance.
          </p>
        </div>

        <motion.div
          {...staggerContainer(reduced, 0.1)}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
        >
          {materials.map((material) => (
            <motion.div key={material.id} {...staggerItem(reduced)}>
              <Link
                href={`/products?material=${encodeURIComponent(material.name)}`}
                className="group block overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-brand-accent/40 hover:shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
              >
                <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl bg-white/5">
                  <AssetImage
                    src={material.image}
                    alt={material.name}
                    fill
                    loading="lazy"
                    className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                    sizes="200px"
                  />
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {material.name}
                </h3>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-400">
                  {material.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SnapSection>
  );
}
