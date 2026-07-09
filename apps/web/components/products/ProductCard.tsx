"use client";

import Link from "next/link";
import { Share2 } from "lucide-react";
import {
  ProductCardShell,
  ProductCardImage,
  ProductCardBadges,
  ProductCardMeta,
} from "./card";
import PriceCard from "@/components/pricing/PriceCard";
import { WishlistButton } from "@/components/features";
import { COLOR_MAP } from "@/lib/constants";
import { getProductMainImage, shareProduct } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { getProductPricing } from "@/lib/pricing";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  index?: number;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({
  product,
  index = 0,
  priority = false,
  onQuickView,
}: ProductCardProps) {
  const mainImage = getProductMainImage(product);
  const productHref = `/products/${product.slug}`;
  const pricing = getProductPricing(product);
  const { show: showToast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${productHref}`
        : productHref;
    try {
      await shareProduct(product, url);
      showToast("Link copied to clipboard", "success");
    } catch {
      showToast("Could not share product", "error");
    }
  };

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
          category={product.category}
          material={product.material}
          gender={product.gender}
        />
        <div className="absolute right-3 top-3 z-20 flex flex-col gap-2">
          <WishlistButton product={product} size="sm" />
          <button
            type="button"
            onClick={handleShare}
            className="focus-ring flex h-9 w-9 items-center justify-center rounded-full border border-white/60 bg-white/80 shadow-md backdrop-blur-sm transition-colors hover:bg-brand-black hover:text-white"
            aria-label={`Share ${product.name}`}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>
        {onQuickView && (
          <div className="absolute inset-x-5 bottom-5 z-20 flex justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="premium-quick-view focus-ring opacity-100 sm:opacity-0"
            >
              Quick View
            </button>
          </div>
        )}
      </div>

      <Link href={productHref} className="block">
        <div className="space-y-5 border-t border-white/50 bg-white/50 px-6 py-6 backdrop-blur-md dark:border-white/10 dark:bg-brand-dark/50 md:px-7 md:py-7">
          <ProductCardMeta
            gender={product.gender}
            category={product.category}
            material={product.material}
          />

          <div className="space-y-3">
            <h3 className="font-display text-xl font-semibold leading-snug tracking-tight text-brand-black transition-colors duration-300 group-hover:text-brand-accent dark:text-white">
              {product.name}
            </h3>

            <PriceCard pricing={pricing} variant="compact" />

            <div className="flex items-center gap-2.5 pt-1">
              <span
                className="h-4 w-4 rounded-full border border-black/10 shadow-sm ring-2 ring-white"
                style={{
                  backgroundColor:
                    COLOR_MAP[product.color] || COLOR_MAP.Standard,
                }}
                title={product.color}
                aria-label={`Color: ${product.color}`}
              />
              <span className="text-xs font-medium tracking-wide text-brand-muted">
                {product.color !== "Standard" ? product.color : "Multi color"}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end border-t border-black/[0.05] pt-5 dark:border-white/10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-black transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-accent dark:text-white">
              Explore →
            </span>
          </div>
        </div>
      </Link>
    </ProductCardShell>
  );
}
