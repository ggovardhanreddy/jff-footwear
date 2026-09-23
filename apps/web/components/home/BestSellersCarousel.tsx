"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import ProductCard from "@/components/products/ProductCard";
import SectionIntro from "./SectionIntro";
import type { Product } from "@/types";

type BestSellersCarouselProps = {
  products: Product[];
  onQuickView?: (product: Product) => void;
};

export default function BestSellersCarousel({ products, onQuickView }: BestSellersCarouselProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const scrollByCard = (direction: number) => {
    const node = scroller.current;
    if (!node) return;
    const card = node.querySelector<HTMLElement>("[data-seller-card]");
    const width = card?.offsetWidth ?? node.clientWidth * 0.8;
    node.scrollBy({ left: direction * (width + 16), behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section className="container-custom py-16 md:py-24" aria-labelledby="bestsellers-heading">
      <div className="flex items-end justify-between gap-4">
        <div id="bestsellers-heading" className="min-w-0 flex-1">
          <SectionIntro
            eyebrow="Most loved"
            title="Best sellers"
            description="Styles shoppers return to. Swipe on mobile, or use the arrows."
            href="/collections/best-sellers"
            cta="View all"
          />
        </div>
        <div className="mb-8 hidden gap-2 md:mb-10 md:flex">
          <CarouselButton label="Previous products" onClick={() => scrollByCard(-1)}>
            <ChevronLeft className="h-5 w-5" />
          </CarouselButton>
          <CarouselButton label="Next products" onClick={() => scrollByCard(1)}>
            <ChevronRight className="h-5 w-5" />
          </CarouselButton>
        </div>
      </div>
      <div
        ref={scroller}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, index) => (
          <div
            key={product.slug}
            data-seller-card
            className="w-[78%] shrink-0 snap-start sm:w-[46%] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/4)]"
          >
            <ProductCard product={product} index={index} onQuickView={onQuickView} />
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2 md:hidden">
        <CarouselButton label="Previous products" onClick={() => scrollByCard(-1)}>
          <ChevronLeft className="h-5 w-5" />
        </CarouselButton>
        <CarouselButton label="Next products" onClick={() => scrollByCard(1)}>
          <ChevronRight className="h-5 w-5" />
        </CarouselButton>
      </div>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="focus-ring inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-brand-black transition-transform hover:scale-105 dark:border-white/15 dark:bg-[#1c1916] dark:text-[#f4f0ea]"
    >
      {children}
    </button>
  );
}
