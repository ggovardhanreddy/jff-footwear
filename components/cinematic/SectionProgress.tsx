"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const CINEMATIC_SECTIONS = [
  { id: "hero", label: "Hero" },
  { id: "comfort", label: "Comfort" },
  { id: "showcase", label: "Spotlight" },
  { id: "materials", label: "Materials" },
  { id: "colors", label: "Colors" },
  { id: "features", label: "Why JFF" },
  { id: "stats", label: "Stats" },
  { id: "gallery", label: "Gallery" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "Contact" },
] as const;

interface SectionProgressProps {
  enabled?: boolean;
}

export default function SectionProgress({ enabled = true }: SectionProgressProps) {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    if (!enabled) return;

    const sections = CINEMATIC_SECTIONS.map((s) =>
      document.getElementById(s.id)
    ).filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(visible[0].target.id);
        }
      },
      { threshold: [0.35, 0.5, 0.65], rootMargin: "-10% 0px -10% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled) return null;

  return (
    <nav
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex lg:right-8"
      aria-label="Section navigation"
    >
      {CINEMATIC_SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className="group flex items-center justify-end gap-3"
          aria-label={`Go to ${section.label}`}
          aria-current={active === section.id}
        >
          <span
            className={cn(
              "text-[9px] font-semibold uppercase tracking-[0.2em] opacity-0 transition-all duration-300 group-hover:opacity-100",
              active === section.id ? "text-brand-accent opacity-100" : "text-white/70"
            )}
          >
            {section.label}
          </span>
          <span
            className={cn(
              "block h-2 rounded-full transition-all duration-500",
              active === section.id
                ? "h-8 w-1 bg-brand-accent"
                : "w-1 bg-white/25 group-hover:bg-white/50"
            )}
          />
        </a>
      ))}
    </nav>
  );
}
