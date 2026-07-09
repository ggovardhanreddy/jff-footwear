"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import FloatingProduct from "@/components/cinematic/primitives/FloatingProduct";
import SplitText from "@/components/cinematic/primitives/SplitText";
import { revealFromLeft, revealFromRight } from "@/lib/motion";
import type { Product } from "@/types";
import { getProductMainImage } from "@/lib/utils";

interface ComfortSectionProps {
  product: Product;
}

export default function ComfortSection({ product }: ComfortSectionProps) {
  const reduced = useReducedMotion();
  const mainImage = getProductMainImage(product);
  const lifestyle =
    product.images.find((img) => /lifestyle/i.test(img)) ||
    product.images[1] ||
    mainImage;

  return (
    <SnapSection id="comfort" className="items-center justify-center pt-16">
      <CinematicBackground variant="cream" />

      <div className="container-custom relative z-10 grid min-h-0 flex-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-20">
        <motion.div {...revealFromLeft(reduced)}>
          <p className="eyebrow">Section 02</p>
          <SplitText
            text="Engineered Comfort"
            className="heading-section mt-3 text-brand-black"
          />
          <motion.p
            {...revealFromLeft(reduced)}
            transition={{ delay: 0.15 }}
            className="text-body mt-6 max-w-lg"
          >
            Every JFF slipper is sculpted for ergonomic support — cushioned
            footbeds, balanced weight distribution, and cloud-soft materials
            that feel premium from the first step.
          </motion.p>

          <ul className="mt-8 space-y-4">
            {[
              "Anatomical arch support",
              "Pressure-relieving footbed",
              "Featherlight daily wear",
            ].map((item, i) => (
              <motion.li
                key={item}
                initial={reduced ? false : { opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="flex items-center gap-3 text-sm text-brand-muted"
              >
                <span className="h-px w-8 bg-brand-accent" />
                {item}
              </motion.li>
            ))}
          </ul>

          <Link
            href={`/products/${product.slug}`}
            className="link-underline group mt-10 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest"
          >
            Discover {product.name}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.div {...revealFromRight(reduced)} className="relative">
          <div className="sticky top-24">
            <FloatingProduct
              src={mainImage}
              alt={product.name}
              gallery={[mainImage, lifestyle].filter(
                (v, i, a) => a.indexOf(v) === i
              )}
              glow
            />
          </div>
        </motion.div>
      </div>
    </SnapSection>
  );
}
