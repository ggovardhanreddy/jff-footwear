"use client";

import { useEffect, useState } from "react";
import { MessageCircle, ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import PriceCard from "@/components/pricing/PriceCard";
import { cn } from "@/lib/utils";
import type { ProductPricing } from "@/types";

interface StickyProductBarProps {
  productName: string;
  pricing: ProductPricing;
  onAddToCart: () => void;
  onWhatsApp: () => void;
  disabled?: boolean;
  className?: string;
}

export default function StickyProductBar({
  productName,
  pricing,
  onAddToCart,
  onWhatsApp,
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
        "pb-[max(1rem,env(safe-area-inset-bottom))]",
        className
      )}
      role="region"
      aria-label="Sticky product actions"
    >
      <div className="container-custom flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-brand-black dark:text-white">
            {productName}
          </p>
          <PriceCard pricing={pricing} variant="compact" className="mt-1" />
        </div>
        <Button
          type="button"
          variant="primary"
          size="lg"
          disabled={disabled}
          onClick={onAddToCart}
          className="shrink-0 !px-4"
        >
          <ShoppingBag className="h-5 w-5" />
          <span className="hidden sm:inline">Add to Cart</span>
        </Button>
        <Button
          type="button"
          variant="whatsapp"
          size="lg"
          disabled={disabled}
          onClick={onWhatsApp}
          className="shrink-0 !px-4"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="hidden sm:inline">WhatsApp</span>
        </Button>
      </div>
    </div>
  );
}
