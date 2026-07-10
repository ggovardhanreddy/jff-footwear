"use client";

import Link from "next/link";
import { Coins, Share2, ShoppingBag } from "lucide-react";
import { ProductCardShell, ProductCardImage, ProductCardBadges, ProductCardMeta } from "./card";
import PriceCard from "@/components/pricing/PriceCard";
import { WishlistButton } from "@/components/features";
import { COLOR_MAP } from "@/lib/constants";
import { getProductMainImage, shareProduct } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";
import { useCart } from "@/context/CartContext";
import { getProductPricing } from "@/lib/pricing";
import { coinsEarnedForProduct, formatCoins } from "@jff/api/coins";
import { PRICING_CONFIG } from "@jff/config/pricing-config";
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
  const coins = coinsEarnedForProduct(product);
  const { show: showToast } = useToast();
  const { addItem } = useCart();

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      typeof window !== "undefined" ? `${window.location.origin}${productHref}` : productHref;
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
        <ProductCardImage src={mainImage} alt={product.name} priority={priority || index < 4} />
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

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-xs text-brand-muted">
              <span className="inline-flex items-center gap-1 font-medium text-brand-accent">
                <Coins className="h-3.5 w-3.5" />
                Earn {formatCoins(coins)}
              </span>
              <span>{PRICING_CONFIG.estimatedDelivery.label}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span
                className="h-4 w-4 rounded-full border border-black/10 shadow-sm ring-2 ring-white"
                style={{
                  backgroundColor: COLOR_MAP[product.color] || COLOR_MAP.Standard,
                }}
                title={product.color}
                aria-label={`Color: ${product.color}`}
              />
              <span className="text-xs font-medium tracking-wide text-brand-muted">
                {product.color !== "Standard" ? product.color : "Multi color"}
              </span>
              {product.sizes?.length ? (
                <span className="text-xs text-brand-muted">
                  Sizes {product.sizes.slice(0, 4).join(", ")}
                  {product.sizes.length > 4 ? "…" : ""}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 border-t border-black/[0.05] pt-5 dark:border-white/10">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addItem({
                  product,
                  size: product.sizes?.[0] ?? 7,
                  quantity: 1,
                });
                showToast("Added to cart", "success");
              }}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-brand-black px-3.5 py-2 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-brand-accent hover:text-brand-black dark:bg-white dark:text-brand-black"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              Quick Add
            </button>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-black transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-brand-accent dark:text-white">
              Explore →
            </span>
          </div>
        </div>
      </Link>
    </ProductCardShell>
  );
}
