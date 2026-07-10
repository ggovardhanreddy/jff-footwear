"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AssetImage from "@/components/ui/AssetImage";
import { GlassCard } from "@/components/motion";
import { AnimatedBorder } from "@/components/premium";
import { cn } from "@/lib/utils";

type CategoryTile = {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
};

export default function CategoriesAnimatedGrid({ categories }: { categories: CategoryTile[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const tiles = root.querySelectorAll<HTMLElement>("[data-cat-tile]");
    const ctx = gsap.context(() => {
      gsap.from(tiles, {
        opacity: 0,
        y: 48,
        rotateX: 8,
        duration: 0.75,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 80%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [categories]);

  return (
    <div
      ref={rootRef}
      className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      style={{ perspective: 1200 }}
    >
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/products?category=${encodeURIComponent(category.name)}`}
          data-cat-tile
          className="focus-ring group block"
        >
          <AnimatedBorder contentClassName="overflow-hidden !rounded-[27px] !bg-transparent p-0">
            <GlassCard
              hover
              className={cn(
                "relative aspect-[4/3] overflow-hidden !rounded-[27px] !border-0 !bg-transparent !p-0 shadow-soft"
              )}
            >
              <AssetImage
                src={category.image}
                alt={category.name}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-bold text-white">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-300">{category.productCount} Products</p>
                <p className="mt-2 text-sm text-gray-400 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                  {category.description}
                </p>
              </div>
            </GlassCard>
          </AnimatedBorder>
        </Link>
      ))}
    </div>
  );
}
