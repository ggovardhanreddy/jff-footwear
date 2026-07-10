"use client";

import { useEffect, useState } from "react";
import { Coins, ShoppingBag, Zap } from "lucide-react";
import Button from "@/components/ui/Button";
import PriceCard from "@/components/pricing/PriceCard";
import { cn } from "@/lib/utils";
import { formatCoins } from "@jff/api/coins";
import type { ProductPricing } from "@/types";

interface StickyProductBarProps {
  productName: string;
  pricing: ProductPricing;
  onAddToCart: () => void;
  onBuyNow?: () => void;
  onWhatsApp?: () => void;
  coinsEarned?: number;
  disabled?: boolean;
  className?: string;
}

export default function StickyProductBar({
  productName,
  pricing,
  onAddToCart,
  onBuyNow,
  onWhatsApp,
  coinsEarned = 0,
  disabled = false,
  className,
}: StickyProductBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-white/95 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-brand-dark/95",
        "pb-[max(1rem,env(safe-area-inset-bottom))] lg:pb-4",
        "mb-[3.5rem] lg:mb-0",
        className
      )}
      role="region"
      aria-label="Sticky product actions"
    >
      <div className="container-custom flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-brand-black dark:text-white">
            {productName}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <PriceCard pricing={pricing} variant="compact" />
            {coinsEarned > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-accent">
                <Coins className="h-3 w-3" />+{formatCoins(coinsEarned)}
              </span>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={disabled}
          onClick={onAddToCart}
          className="shrink-0 !px-3"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="hidden sm:inline">Add to Cart</span>
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={disabled}
          onClick={onBuyNow || onWhatsApp || onAddToCart}
          className="shrink-0 !px-3 shadow-[0_0_20px_rgba(200,169,110,0.35)]"
        >
          <Zap className="h-5 w-5" />
          <span className="hidden sm:inline">Buy Now</span>
        </Button>
      </div>
    </div>
  );
}
