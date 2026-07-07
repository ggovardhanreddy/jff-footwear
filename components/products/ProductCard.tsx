"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ImageWithZoom from "@/components/ui/ImageWithZoom";
import Badge from "@/components/ui/Badge";
import { COLOR_MAP } from "@/lib/constants";
import { getProductMainImage } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const mainImage = getProductMainImage(product);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="card-premium group"
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-light">
          <ImageWithZoom
            src={mainImage}
            alt={product.name}
            fill
            className="h-full w-full"
          />
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.newArrival && <Badge variant="new">New</Badge>}
            {product.featured && <Badge variant="accent">Featured</Badge>}
          </div>
        </div>

        <div className="space-y-3 p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
              {product.gender} · {product.category}
            </p>
            <h3 className="mt-1 font-display text-base font-semibold leading-tight text-brand-black transition-colors group-hover:text-brand-accent">
              {product.name}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="h-4 w-4 rounded-full border border-gray-200"
              style={{
                backgroundColor:
                  COLOR_MAP[product.color] || COLOR_MAP.Standard,
              }}
              title={product.color}
            />
            <span className="text-xs text-brand-muted">{product.material}</span>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <span className="text-xs font-medium uppercase tracking-wider text-brand-muted">
              {product.color !== "Standard" ? product.color : "Multi"}
            </span>
            <span className="text-xs font-medium uppercase tracking-wider text-brand-muted transition-colors group-hover:text-brand-accent">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
