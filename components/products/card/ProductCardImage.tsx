"use client";

import { useState } from "react";
import AssetImage from "@/components/ui/AssetImage";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductCardImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

export default function ProductCardImage({
  src,
  alt,
  priority = false,
  className,
}: ProductCardImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-neutral-100",
        className
      )}
    >
      {!loaded && (
        <div className="skeleton-shimmer absolute inset-0 z-10 bg-neutral-100" aria-hidden />
      )}

      <motion.div
        className="relative h-full w-full"
        whileHover={{ scale: 1.08 }}
        transition={{ type: "spring", stiffness: 260, damping: 26 }}
      >
        <AssetImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.06] via-transparent to-white/30" />
    </div>
  );
}
