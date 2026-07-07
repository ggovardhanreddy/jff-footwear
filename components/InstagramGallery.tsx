"use client";

import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import { motion } from "framer-motion";
import { Instagram } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

interface InstagramGalleryProps {
  images: string[];
}

export default function InstagramGallery({ images }: InstagramGalleryProps) {
  const displayImages = images.slice(0, 8);

  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          subtitle="@jfffootwear"
          title="Follow Our Journey"
          description="Behind-the-scenes from our factory floor to finished products."
        />

        <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
          {displayImages.map((src, index) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-brand-light"
            >
              <AssetImage
                src={src}
                alt={`JFF Footwear gallery ${index + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
                <Instagram className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="text-sm font-semibold uppercase tracking-widest text-brand-accent transition-colors hover:text-brand-black"
          >
            View Full Gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}
