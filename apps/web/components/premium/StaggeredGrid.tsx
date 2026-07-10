"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

export type StaggeredGridItem = {
  id: string;
  title: string;
  href: string;
  subtitle?: string;
  image?: string;
  className?: string;
  tone?: string;
};

type StaggeredGridProps = {
  items: StaggeredGridItem[];
  className?: string;
};

/**
 * Bento-style staggered grid with GSAP entrance.
 * Large tiles via item.className (e.g. sm:col-span-2 sm:row-span-2).
 */
export default function StaggeredGrid({ items, className }: StaggeredGridProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.registerPlugin(ScrollTrigger);
    const tiles = root.querySelectorAll<HTMLElement>("[data-stagger-tile]");
    const ctx = gsap.context(() => {
      gsap.from(tiles, {
        opacity: 0,
        y: 36,
        scale: 0.96,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: root,
          start: "top 85%",
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [items]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "grid auto-rows-[minmax(140px,auto)] gap-4 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {items.map((item, i) => (
        <Link
          key={item.id}
          href={item.href}
          data-stagger-tile
          className={cn(
            "group relative flex min-h-[140px] overflow-hidden rounded-[1.75rem] bg-gradient-to-br p-6 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-18px_rgba(200,169,110,0.35)]",
            item.tone ?? "from-zinc-900 to-zinc-700",
            i === 0 && "lg:col-span-2 lg:row-span-2 lg:min-h-[300px]",
            i === 3 && "lg:col-span-2",
            item.className
          )}
        >
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
          <div className="relative z-10 flex w-full flex-col justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/60">
              JFF
            </span>
            <div>
              <h3
                className={cn(
                  "font-display font-semibold text-white",
                  i === 0 ? "text-3xl md:text-4xl" : "text-2xl"
                )}
              >
                {item.title}
              </h3>
              {item.subtitle ? <p className="mt-1 text-sm text-white/65">{item.subtitle}</p> : null}
              <span className="mt-2 inline-block text-xs font-semibold uppercase tracking-widest text-brand-accent transition group-hover:translate-x-1">
                Explore →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
