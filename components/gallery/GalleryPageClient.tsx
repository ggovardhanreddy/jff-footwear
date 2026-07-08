"use client";

import { useState } from "react";
import AssetImage from "@/components/ui/AssetImage";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import SectionHeading from "@/components/ui/SectionHeading";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import { assetPath } from "@/lib/paths";
import { products } from "@/data";
import { cn } from "@/lib/utils";

export default function GalleryPageClient() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState("All");

  const allImages = products.flatMap((product) =>
    product.images.map((src, i) => ({
      src,
      alt: `${product.name} - Image ${i + 1}`,
      category: product.category,
    }))
  );

  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filtered =
    activeFilter === "All"
      ? allImages
      : allImages.filter((img) => img.category === activeFilter);

  const slides = filtered.map((img) => ({
    src: assetPath(img.src),
    alt: img.alt,
  }));

  return (
    <PageShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Gallery", href: "/gallery" },
        ]}
      />
      <SectionHeading
        subtitle="Visual Showcase"
        title="Gallery"
        titleAs="h1"
        description="Explore our premium slipper collection through stunning visuals."
      />

      <div
        className="mb-8 flex flex-wrap gap-2"
        role="group"
        aria-label="Filter gallery by category"
      >
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveFilter(cat)}
            aria-pressed={activeFilter === cat}
            className={cn(
              "focus-ring rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors",
              activeFilter === cat
                ? "bg-brand-black text-white"
                : "bg-white text-brand-muted hover:text-brand-black"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {filtered.map((img, index) => (
          <button
            key={`${img.src}-${index}`}
            type="button"
            onClick={() => {
              setLightboxIndex(index);
              setLightboxOpen(true);
            }}
            className="focus-ring group relative mb-4 block w-full overflow-hidden break-inside-avoid rounded-2xl"
            aria-label={`View ${img.alt}`}
          >
            <div className="relative aspect-[4/5]">
              <AssetImage
                src={img.src}
                alt={img.alt}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </div>
          </button>
        ))}
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={slides}
        plugins={[Zoom]}
      />
    </PageShell>
  );
}
