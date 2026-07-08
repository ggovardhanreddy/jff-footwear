"use client";

import { motion, useReducedMotion } from "framer-motion";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import SplitText from "@/components/cinematic/primitives/SplitText";
import ProductCard from "@/components/products/ProductCard";
import MagneticButton from "@/components/cinematic/primitives/MagneticButton";
import { staggerContainer, staggerItem } from "@/lib/motion";
import type { Product } from "@/types";

interface GallerySectionProps {
  products: Product[];
}

export default function GallerySection({ products }: GallerySectionProps) {
  const reduced = useReducedMotion();

  return (
    <SnapSection id="gallery" className="justify-center pt-16">
      <CinematicBackground variant="cream" />

      <div className="container-custom relative z-10 flex min-h-0 flex-1 flex-col justify-center py-10">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Section 06</p>
            <SplitText
              text="Curated Collection"
              className="heading-section mt-3"
            />
          </div>
          <MagneticButton href="/products" variant="ghost">
            View All Products
          </MagneticButton>
        </div>

        <motion.div
          {...staggerContainer(reduced, 0.07)}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {products.map((product, i) => (
            <motion.div key={product.id} {...staggerItem(reduced)}>
              <ProductCard product={product} index={i} priority={i < 4} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </SnapSection>
  );
}
