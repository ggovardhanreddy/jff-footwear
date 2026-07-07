"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PremiumProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function PremiumProductImage({
  src,
  alt,
  priority = false,
  className,
}: PremiumProductImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const springConfig = { stiffness: 280, damping: 28, mass: 0.6 };
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const parallaxX = useSpring(0, springConfig);
  const parallaxY = useSpring(0, springConfig);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      rotateX.set(-y * 10);
      rotateY.set(x * 10);
      parallaxX.set(x * 12);
      parallaxY.set(y * 12);
    },
    [parallaxX, parallaxY, prefersReducedMotion, rotateX, rotateY]
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    parallaxX.set(0);
    parallaxY.set(0);
  }, [parallaxX, parallaxY, rotateX, rotateY]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-neutral-50 to-neutral-100",
        className
      )}
      style={{ perspective: 1200 }}
    >
      <div
        className={cn(
          "absolute inset-0 z-10 transition-opacity duration-500",
          loaded ? "pointer-events-none opacity-0" : "opacity-100"
        )}
        aria-hidden
      >
        <div className="skeleton-shimmer absolute inset-0 bg-neutral-100" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-neutral-200 border-t-brand-accent/40 animate-spin" />
        </div>
      </div>

      <motion.div
        className="relative h-full w-full will-change-transform"
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }
        }
      >
        <motion.div
          className="relative h-full w-full"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          style={
            prefersReducedMotion ? undefined : { x: parallaxX, y: parallaxY }
          }
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={priority ? undefined : "lazy"}
            onLoad={() => setLoaded(true)}
            className={cn(
              "object-cover transition-opacity duration-700",
              loaded ? "opacity-100" : "opacity-0"
            )}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </motion.div>
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.04] via-transparent to-white/20" />
    </div>
  );
}
