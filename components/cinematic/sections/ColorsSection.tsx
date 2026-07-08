"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import SplitText from "@/components/cinematic/primitives/SplitText";
import { COLOR_MAP } from "@/lib/constants";
import { revealFromLeft, revealFromRight } from "@/lib/motion";
import type { ProductColor } from "@/types";

interface ColorItem {
  color: ProductColor;
  image: string;
  slug: string;
  name: string;
}

interface ColorsSectionProps {
  colors: ColorItem[];
}

export default function ColorsSection({ colors }: ColorsSectionProps) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const current = colors[active] ?? colors[0];

  if (!current) return null;

  return (
    <SnapSection id="colors" className="justify-center pt-16">
      <CinematicBackground variant="light" />

      <div className="container-custom relative z-10 grid min-h-0 flex-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16">
        <motion.div {...revealFromLeft(reduced)}>
          <p className="eyebrow">Section 04</p>
          <SplitText
            text="A Spectrum of Color"
            className="heading-section mt-3"
          />
          <p className="text-body mt-4 max-w-md">
            From timeless neutrals to bold statements — curated palettes across
            our entire collection.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {colors.map((item, index) => (
              <button
                key={item.color}
                type="button"
                onClick={() => setActive(index)}
                aria-pressed={active === index}
                aria-label={`Show ${item.color} colorway`}
                className="focus-ring group flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-all hover:border-brand-accent"
                style={{
                  boxShadow:
                    active === index
                      ? `0 0 0 2px ${COLOR_MAP[item.color] ?? "#c8a96e"}`
                      : undefined,
                }}
              >
                <span
                  className="h-3 w-3 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: COLOR_MAP[item.color] }}
                />
                {item.color}
              </button>
            ))}
          </div>

          <Link
            href={`/products/${current.slug}`}
            className="link-underline mt-8 inline-block text-sm font-semibold uppercase tracking-widest"
          >
            View {current.name}
          </Link>
        </motion.div>

        <motion.div {...revealFromRight(reduced)} className="relative">
          <div className="relative mx-auto aspect-square max-w-md">
            <div
              className="absolute inset-[10%] rounded-full blur-[60px] transition-colors duration-700"
              style={{
                backgroundColor: `${COLOR_MAP[current.color] ?? "#c8a96e"}33`,
              }}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.image}
                initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 1.04, rotate: 3 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full w-full"
              >
                <AssetImage
                  src={current.image}
                  alt={`${current.name} in ${current.color}`}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 85vw, 400px"
                  priority={active === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </SnapSection>
  );
}
