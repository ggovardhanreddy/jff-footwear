"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type ImageTrailProps = {
  images: string[];
  className?: string;
  maxTrail?: number;
  threshold?: number;
};

/**
 * Desktop mouse-follow image trail for hero surfaces.
 * Disabled on touch / coarse pointers and when reduced motion is preferred.
 * Framer/GSAP-free — plain DOM for performance.
 */
export default function ImageTrail({
  images,
  className,
  maxTrail = 8,
  threshold = 48,
}: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const lastRef = useRef({ x: 0, y: 0 });
  const nodesRef = useRef<HTMLDivElement[]>([]);
  const enabledRef = useRef(false);

  const spawn = useCallback(
    (x: number, y: number) => {
      const root = containerRef.current;
      if (!root || images.length === 0 || !enabledRef.current) return;

      const imgSrc = images[indexRef.current % images.length]!;
      indexRef.current += 1;

      const node = document.createElement("div");
      node.className =
        "pointer-events-none absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl opacity-0 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] will-change-transform md:h-28 md:w-28";
      node.style.left = `${x}px`;
      node.style.top = `${y}px`;
      node.style.zIndex = String(10 + (indexRef.current % maxTrail));

      const img = document.createElement("img");
      img.src = imgSrc;
      img.alt = "";
      img.draggable = false;
      img.className = "h-full w-full object-cover";
      node.appendChild(img);
      root.appendChild(node);

      nodesRef.current.push(node);
      while (nodesRef.current.length > maxTrail) {
        const old = nodesRef.current.shift();
        old?.remove();
      }

      requestAnimationFrame(() => {
        node.style.transition = "opacity 0.35s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)";
        node.style.opacity = "0.85";
        node.style.transform = "translate(-50%, -50%) scale(1) rotate(0deg)";
      });

      window.setTimeout(() => {
        node.style.opacity = "0";
        node.style.transform = "translate(-50%, -60%) scale(0.6) rotate(-8deg)";
      }, 420);

      window.setTimeout(() => {
        node.remove();
        nodesRef.current = nodesRef.current.filter((n) => n !== node);
      }, 900);
    },
    [images, maxTrail]
  );

  useEffect(() => {
    const root = containerRef.current;
    const host = root?.parentElement;
    if (!root || !host) return;

    const syncEnabled = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const narrow = window.matchMedia("(max-width: 768px)").matches;
      enabledRef.current = !reduced && !coarse && !narrow;
    };
    syncEnabled();

    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqCoarse = window.matchMedia("(pointer: coarse)");
    const mqNarrow = window.matchMedia("(max-width: 768px)");
    mqReduced.addEventListener("change", syncEnabled);
    mqCoarse.addEventListener("change", syncEnabled);
    mqNarrow.addEventListener("change", syncEnabled);

    const onMove = (e: PointerEvent) => {
      if (!enabledRef.current || e.pointerType === "touch") return;
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - lastRef.current.x;
      const dy = y - lastRef.current.y;
      if (Math.hypot(dx, dy) < threshold) return;
      lastRef.current = { x, y };
      spawn(x, y);
    };

    host.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      host.removeEventListener("pointermove", onMove);
      mqReduced.removeEventListener("change", syncEnabled);
      mqCoarse.removeEventListener("change", syncEnabled);
      mqNarrow.removeEventListener("change", syncEnabled);
    };
  }, [spawn, threshold]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden md:block",
        className
      )}
      aria-hidden
    />
  );
}
