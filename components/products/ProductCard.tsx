"use client";

import Link from "next/link";
import {
  ProductCardShell,
  ProductCardImage,
  ProductCardBadges,
  ProductCardQuickView,
  ProductCardMeta,
  ProductCardPrice,
} from "./card";
import { COLOR_MAP } from "@/lib/constants";
import { getProductMainImage } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
}

export default function ProductCard({
  product,
  index = 0,
  priority = false,
}: ProductCardProps) {
  const mainImage = getProductMainImage(product);
  const productHref = `/products/${product.slug}`;

  return (
    <ProductCardShell index={index}>
      <div className="relative">
        <ProductCardImage
          src={mainImage}
          alt={product.name}
          priority={priority || index < 4}
        />
        <ProductCardBadges
          featured={product.featured}
          newArrival={product.newArrival}
        />
        <ProductCardQuickView href={productHref} productName={product.name} />
      </div>

      <Link href={productHref} className="block">
        <div className="space-y-5 border-t border-white/50 bg-white/50 px-6 py-6 backdrop-blur-md md:px-7 md:py-7">
          <ProductCardMeta
            gender={product.gender}
            category={product.category}
            material={product.material}
          />

          <div className="space-y-3">
            <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-brand-black transition-colors duration-300 group-hover:text-brand-accent">
              {product.name}
            </h3>

            <ProductCardPrice price={product.price} />

            <div className="flex items-center gap-2.5 pt-1">
              <span
                className="h-4 w-4 rounded-full border border-black/10 shadow-sm ring-2 ring-white"
                style={{
                  backgroundColor:
                    COLOR_MAP[product.color] || COLOR_MAP.Standard,
                }}
                title={product.color}
              />
              <span className="text-xs font-medium tracking-wide text-brand-muted">
                {product.color !== "Standard" ? product.color : "Multi color"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-black/[0.05] pt-5">
            {!product.price && (
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-muted">
                Inquire for pricing
              </span>
            )}
            {product.price && <span />}
            <span className="ml-auto text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-black transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-accent">
              Explore →
            </span>
          </div>
        </div>
      </Link>
    </ProductCardShell>
  );
}
