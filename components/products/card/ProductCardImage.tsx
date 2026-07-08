"use client";

import { useState } from "react";
import AssetImage from "@/components/ui/AssetImage";
import { cn } from "@/lib/utils";
import { IMAGE_ZOOM_CLASS } from "@/lib/motion";

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
        <div
          className="skeleton-shimmer absolute inset-0 z-10 bg-neutral-100"
          aria-hidden
        />
      )}

      <div className="relative h-full w-full overflow-hidden">
        <AssetImage
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          onLoad={() => setLoaded(true)}
          className={cn(
            "object-cover transition-opacity duration-500",
            IMAGE_ZOOM_CLASS,
            loaded ? "opacity-100" : "opacity-0"
          )}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/[0.06] via-transparent to-white/30" />
    </div>
  );
}
