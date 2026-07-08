"use client";

import { useEffect } from "react";
import SectionProgress from "@/components/cinematic/SectionProgress";
import ScrollProgressBar from "@/components/cinematic/ScrollProgressBar";
import CinematicOverlay from "@/components/cinematic/primitives/CinematicOverlay";
import HeroSection from "@/components/cinematic/sections/HeroSection";
import ComfortSection from "@/components/cinematic/sections/ComfortSection";
import ShowcaseSection from "@/components/cinematic/sections/ShowcaseSection";
import MaterialsSection from "@/components/cinematic/sections/MaterialsSection";
import ColorsSection from "@/components/cinematic/sections/ColorsSection";
import FeaturesSection from "@/components/cinematic/sections/FeaturesSection";
import StatsSection from "@/components/cinematic/sections/StatsSection";
import GallerySection from "@/components/cinematic/sections/GallerySection";
import FAQSection from "@/components/cinematic/sections/FAQSection";
import ContactSection from "@/components/cinematic/sections/ContactSection";
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

interface CinematicLandingProps {
  heroProduct: Product;
  comfortProduct: Product;
  showcaseProduct: Product;
  galleryProducts: Product[];
  materials: MaterialItem[];
  colors: ColorItem[];
  features: Feature[];
}

export default function CinematicLanding({
  heroProduct,
  comfortProduct,
  showcaseProduct,
  galleryProducts,
  materials,
  colors,
  features,
}: CinematicLandingProps) {
  useEffect(() => {
    document.documentElement.classList.add("cinematic-page", "cinematic-ready");
    return () => {
      document.documentElement.classList.remove("cinematic-page", "cinematic-ready");
    };
  }, []);

  const heroImage =
    heroProduct.images.find((img) => /front\.|F1\.|main\./i.test(img)) ||
    heroProduct.images[0];

  const heroGallery = heroProduct.images
    .filter((img) => /front|side|top|F1|F2|main/i.test(img))
    .slice(0, 4);

  return (
    <>
      <ScrollProgressBar />
      <CinematicOverlay />
      <SectionProgress enabled />

      <div className="cinematic-landing">
        <HeroSection
          productName={heroProduct.name}
          heroImage={heroImage}
          galleryImages={heroGallery.length > 1 ? heroGallery : [heroImage]}
          productSlug={heroProduct.slug}
        />
        <ComfortSection product={comfortProduct} />
        <ShowcaseSection product={showcaseProduct} />
        <MaterialsSection materials={materials} />
        <ColorsSection colors={colors} />
        <FeaturesSection features={features} />
        <StatsSection />
        <GallerySection products={galleryProducts} />
        <FAQSection />
        <ContactSection />
      </div>
    </>
  );
}
