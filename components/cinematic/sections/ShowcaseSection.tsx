"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import SplitText from "@/components/cinematic/primitives/SplitText";
import MagneticButton from "@/components/cinematic/primitives/MagneticButton";
import { COLOR_MAP, WHATSAPP_NUMBER } from "@/lib/constants";
import { getProductSpecifications } from "@/lib/utils";
import { revealFromLeft, revealFromRight } from "@/lib/motion";
import type { Product } from "@/types";

const ImmersiveProductViewer = dynamic(
  () => import("@/components/products/ImmersiveProductViewer"),
  {
    loading: () => (
      <div className="aspect-square w-full animate-pulse rounded-3xl bg-white/10" />
    ),
  }
);

interface ShowcaseSectionProps {
  product: Product;
}

export default function ShowcaseSection({ product }: ShowcaseSectionProps) {
  const reduced = useReducedMotion();
  const specs = getProductSpecifications(product).slice(0, 4);
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello JFF, I'm interested in ${product.name} (${product.color}, ${product.material}). Please share pricing.`
  )}`;

  return (
    <SnapSection id="showcase" dark className="justify-center pt-16">
      <CinematicBackground variant="dark" />

      <div className="container-custom relative z-10 grid min-h-0 flex-1 items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-12">
        <motion.div
          {...revealFromLeft(reduced)}
          className="min-w-0 overflow-visible lg:sticky lg:top-24"
        >
          <ImmersiveProductViewer
            images={product.images}
            productName={product.name}
            variant="dark"
          />
        </motion.div>

        <motion.div {...revealFromRight(reduced)} className="flex flex-col justify-center">
          <p className="eyebrow">Product Spotlight</p>
          <SplitText
            text={product.name}
            className="heading-section mt-3 text-white"
            mode="words"
          />
          <p className="mt-4 text-sm leading-relaxed text-gray-400 md:text-base">
            {product.description}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {[product.gender, product.category, product.material, product.color]
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-gray-400"
                >
                  {tag}
                </span>
              ))}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <span
              className="h-5 w-5 rounded-full ring-2 ring-white/20"
              style={{
                backgroundColor: COLOR_MAP[product.color] ?? COLOR_MAP.Standard,
              }}
            />
            <span className="text-sm text-gray-300">{product.color} colorway</span>
          </div>

          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
              Available Sizes
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.slice(0, 8).map((size) => (
                <span
                  key={size}
                  className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/15 px-3 text-xs font-semibold text-white"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 8 && (
                <span className="flex h-10 items-center px-2 text-xs text-gray-500">
                  +{product.sizes.length - 8} more
                </span>
              )}
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-8">
            {specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[10px] uppercase tracking-widest text-gray-500">
                  {spec.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-white">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-4">
            <MagneticButton href={whatsappHref} variant="primary" external>
              <MessageCircle className="inline h-4 w-4" />
              WhatsApp Inquiry
            </MagneticButton>
            <Link
              href={`/products/${product.slug}`}
              className="link-underline inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand-accent"
            >
              Full Product Details
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </SnapSection>
  );
}
