"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  PerspectiveCarousel,
  FlipText,
  ImageTrail,
  type PerspectiveSlide,
} from "@/components/premium";
import { ROUTES } from "@/lib/constants";

export type HeroSlide = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
};

export default function ShopHeroCarousel({ slides }: { slides: HeroSlide[] }) {
  if (!slides.length) return null;

  const trailImages = slides.map((s) => s.image).slice(0, 6);

  const perspectiveSlides: PerspectiveSlide[] = slides.map((slide) => ({
    id: slide.id,
    image: slide.image,
    content: (
      <>
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
          JFF Collection
        </p>
        <FlipText
          key={`${slide.id}-title`}
          as="h1"
          text={slide.title}
          className="max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-white md:text-6xl lg:text-7xl"
        />
        <p className="mt-4 max-w-lg text-base text-white/75 md:text-lg">{slide.subtitle}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={slide.ctaPrimary.href || ROUTES.products}
            className="group inline-flex items-center gap-2 rounded-full bg-brand-accent px-7 py-3.5 text-sm font-semibold text-brand-black shadow-[0_0_32px_rgba(200,169,110,0.45)] transition hover:brightness-110"
          >
            Shop Now
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={slide.ctaSecondary.href || ROUTES.collections}
            className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Explore Collection
          </Link>
        </div>
      </>
    ),
  }));

  return (
    <div className="relative">
      <ImageTrail images={trailImages} />
      <PerspectiveCarousel slides={perspectiveSlides} autoPlay />
    </div>
  );
}
