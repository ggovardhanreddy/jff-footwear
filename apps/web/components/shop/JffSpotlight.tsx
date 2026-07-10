"use client";

import { StaggeredGrid, type StaggeredGridItem } from "@/components/premium";
import { ROUTES } from "@/lib/constants";

const SPOTLIGHT: StaggeredGridItem[] = [
  {
    id: "premium",
    title: "Premium Collection",
    subtitle: "House exclusives, elevated finishes.",
    href: ROUTES.collections,
    tone: "from-neutral-900 to-neutral-600",
  },
  {
    id: "new",
    title: "New Collection",
    href: `${ROUTES.products}?sort=newest`,
    tone: "from-zinc-900 to-zinc-700",
  },
  {
    id: "bestsellers",
    title: "Best Sellers",
    href: `${ROUTES.products}?featured=1`,
    tone: "from-[#1a1612] to-[#c8a96e]",
  },
  {
    id: "trending",
    title: "Trending",
    href: `${ROUTES.products}?sort=popular`,
    tone: "from-stone-900 to-amber-800/80",
  },
  {
    id: "comfort",
    title: "Comfort Series",
    href: `${ROUTES.products}?category=${encodeURIComponent("Orthopedic")}`,
    tone: "from-black to-zinc-800",
  },
  {
    id: "festival",
    title: "Festival Collection",
    href: ROUTES.collections,
    tone: "from-[#0c0c0c] to-[#3d3428]",
  },
];

export default function JffSpotlight() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-black dark:text-white md:text-3xl">
          JFF Spotlight
        </h2>
        <p className="mt-1.5 text-sm text-brand-muted md:text-base">
          Curated collections from the JFF house — exclusively our own.
        </p>
      </div>
      <StaggeredGrid items={SPOTLIGHT} />
    </section>
  );
}
