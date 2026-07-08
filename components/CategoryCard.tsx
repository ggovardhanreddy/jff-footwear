"use client";

import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import { motion, useReducedMotion } from "framer-motion";
import { fadeInUp, hoverLift, IMAGE_ZOOM_CLASS, MOTION_GPU } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  index?: number;
}

export default function CategoryCard({
  name,
  description,
  image,
  productCount,
  index = 0,
}: CategoryCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      {...fadeInUp(reduced)}
      transition={{
        duration: reduced ? 0 : 0.55,
        delay: reduced ? 0 : Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={MOTION_GPU}
    >
      <motion.div {...hoverLift(reduced)}>
        <Link
          href={`/products?category=${encodeURIComponent(name)}`}
          className="card-premium group block overflow-hidden rounded-2xl"
        >
          <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
            <AssetImage
              src={image}
              alt={name}
              fill
              className={cn("object-cover", IMAGE_ZOOM_CLASS)}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="font-display text-xl font-bold">{name}</h3>
              <p className="mt-1 text-xs text-gray-300">{productCount} styles</p>
            </div>
          </div>
          <div className="p-5">
            <p className="line-clamp-2 text-sm text-brand-muted">{description}</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
