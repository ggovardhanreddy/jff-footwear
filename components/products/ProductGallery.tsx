"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center bg-brand-light text-brand-muted">
        No images available
      </div>
    );
  }

  const lightboxSlides = images.map((src, i) => ({
    src,
    alt: `${productName} - Image ${i + 1}`,
  }));

  return (
    <div className="space-y-4">
      <div
        className="group relative aspect-square cursor-zoom-in overflow-hidden bg-brand-light"
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setLightboxOpen(true)}
        aria-label="Open image zoom view"
      >
        <Image
          src={images[activeIndex]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
          <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
        <span className="absolute bottom-4 left-4 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
          {activeIndex + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div
          className={cn(
            "grid gap-2",
            images.length <= 4 ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-6"
          )}
        >
          {images.map((src, index) => (
            <button
              key={src}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-square overflow-hidden border-2 transition-all",
                activeIndex === index
                  ? "border-brand-black"
                  : "border-transparent hover:border-brand-accent"
              )}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                loading="lazy"
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={activeIndex}
        slides={lightboxSlides}
        plugins={[Zoom]}
        zoom={{ maxZoomPixelRatio: 3 }}
        on={{
          view: ({ index }) => setActiveIndex(index),
        }}
      />
    </div>
  );
}
