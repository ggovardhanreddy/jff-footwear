"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowRight as SeeAllIcon } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/products/ProductCard";
import type { Product } from "@/types";

interface LatestCollectionProps {
  products: Product[];
}

export default function LatestCollection({
  products,
}: LatestCollectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const amount = container.clientWidth * 0.85;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="mb-12 flex flex-col items-end justify-between gap-4 md:flex-row md:items-center">
          <SectionHeading
            subtitle="Just Arrived"
            title="Latest Collection"
            description="Fresh designs crafted for the modern lifestyle."
            align="left"
            className="mb-0"
          />
          <div className="flex items-center gap-3">
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-colors hover:border-brand-black"
                aria-label="Scroll to previous products"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-colors hover:border-brand-black"
                aria-label="Scroll to next products"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <Link
              href="/products?sort=newest"
              className="flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-black transition-colors hover:text-brand-accent"
            >
              See All New
              <SeeAllIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <motion.div
          ref={scrollRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="w-[78vw] shrink-0 snap-start sm:w-[45vw] lg:w-[28vw] xl:w-[22vw]"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
