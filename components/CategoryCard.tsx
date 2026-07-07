"use client";

import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link
        href={`/products?category=${encodeURIComponent(name)}`}
        className="card-premium group block overflow-hidden rounded-2xl"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-light">
          <AssetImage
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h3 className="font-display text-xl font-bold">{name}</h3>
            <p className="mt-1 text-xs text-gray-300">{productCount} styles</p>
          </div>
        </div>
        <div className="p-5">
          <p className="text-sm text-brand-muted line-clamp-2">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
