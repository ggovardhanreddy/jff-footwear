"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import FloatingProduct from "@/components/cinematic/primitives/FloatingProduct";
import SplitText from "@/components/cinematic/primitives/SplitText";
import MagneticButton from "@/components/cinematic/primitives/MagneticButton";
import BrandMarquee from "@/components/cinematic/BrandMarquee";
import { COMPANY } from "@/lib/constants";

interface HeroSectionProps {
  productName: string;
  heroImage: string;
  galleryImages: string[];
  productSlug: string;
}

export default function HeroSection({
  productName,
  heroImage,
  galleryImages,
  productSlug,
}: HeroSectionProps) {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 80]);
  const productY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 60]);

  return (
    <SnapSection
      id="hero"
      ref={sectionRef}
      dark
      className="items-center justify-center pt-16"
    >
      <CinematicBackground variant="dark" />

      <div className="container-custom relative z-10 grid h-full min-h-0 flex-1 items-center gap-8 py-8 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <motion.div
          style={{ y: textY }}
          initial={reduced ? false : { opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="order-2 flex flex-col justify-center lg:order-1"
        >
          <p className="eyebrow tracking-[0.4em] text-brand-accent">
            Premium Footwear Since {COMPANY.founded}
          </p>

          <h1 className="heading-display mt-5 text-white md:text-6xl lg:text-7xl">
            <SplitText
              as="span"
              text="Crafted Comfort."
              className="block"
              delay={0.1}
              immediate
            />
            <SplitText
              as="span"
              text="Every Step."
              className="mt-1 block text-brand-accent"
              delay={0.25}
              immediate
            />
          </h1>

          <p className="text-lead mt-7 max-w-md text-gray-400">
            A cinematic introduction to {COMPANY.fullName} — precision-made
            slippers engineered for global luxury markets.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <MagneticButton href="/products" variant="primary">
              Explore Collection
              <ArrowRight className="inline h-4 w-4" />
            </MagneticButton>
            <MagneticButton href={`/products/${productSlug}`} variant="outline">
              View {productName.split(" ").slice(-2).join(" ")}
            </MagneticButton>
          </div>
        </motion.div>

        <motion.div style={{ y: productY }} className="order-1 lg:order-2">
          <FloatingProduct
            src={heroImage}
            alt={productName}
            gallery={galleryImages}
            priority
            glow
          />
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20">
        <BrandMarquee />
      </div>

      <div className="absolute bottom-20 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-24">
        <span className="text-micro text-gray-500">
          Scroll
        </span>
        <motion.div
          animate={reduced ? undefined : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="h-8 w-px bg-brand-accent/60"
        />
      </div>
    </SnapSection>
  );
}
