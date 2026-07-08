"use client";

import { motion, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import QuantitySelector from "@/components/QuantitySelector";
import { formatINR } from "@/lib/pricing";
import { checkoutItemStagger, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  editable?: boolean;
  variant?: "default" | "premium";
  className?: string;
}

export default function OrderSummary({
  items,
  onUpdateQuantity,
  onRemove,
  editable = false,
  variant = "default",
  className,
}: OrderSummaryProps) {
  const reduced = useReducedMotion();
  const isPremium = variant === "premium";

  if (items.length === 0) {
    return (
      <p className={cn("text-sm text-brand-muted", className)}>
        Your cart is empty. Add products to see the order summary.
      </p>
    );
  }

  const ItemWrapper = isPremium && !reduced ? motion.li : "li";

  return (
    <ul
      className={cn(
        isPremium ? "space-y-3" : "space-y-4",
        CHECKOUT_MOTION_GPU,
        className
      )}
    >
      {items.map((item, index) => (
        <ItemWrapper
          key={item.id}
          {...(isPremium && !reduced
            ? {
                custom: index,
                variants: checkoutItemStagger,
                initial: "hidden",
                animate: "show",
              }
            : {})}
          className={cn(
            "flex gap-4",
            isPremium
              ? "rounded-[22px] border border-black/[0.04] bg-gradient-to-br from-white to-neutral-50/80 p-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.1)]"
              : "rounded-2xl border border-black/[0.05] bg-white/60 p-4"
          )}
        >
          <div
            className={cn(
              "relative shrink-0 overflow-hidden bg-neutral-100",
              isPremium
                ? "h-[88px] w-[72px] rounded-[18px] ring-1 ring-black/[0.04]"
                : "h-20 w-16 rounded-xl"
            )}
          >
            <AssetImage
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes={isPremium ? "72px" : "64px"}
            />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p
                  className={cn(
                    "line-clamp-2 font-semibold text-brand-black",
                    isPremium ? "text-[15px] leading-snug" : "text-sm"
                  )}
                >
                  {item.name}
                </p>
                <p className="mt-1 text-xs text-brand-muted">
                  Size {item.size}
                  {item.color !== "Standard" ? ` · ${item.color}` : ""}
                </p>
              </div>
              {editable && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {editable && onUpdateQuantity ? (
                <QuantitySelector
                  value={item.quantity}
                  onChange={(qty) => onUpdateQuantity(item.id, qty)}
                  min={1}
                  max={99}
                />
              ) : (
                <span
                  className={cn(
                    "text-xs text-brand-muted",
                    isPremium &&
                      "rounded-full bg-neutral-100 px-2.5 py-1 font-semibold uppercase tracking-wider"
                  )}
                >
                  Qty {item.quantity}
                </span>
              )}
              <div className="text-right">
                <p
                  className={cn(
                    "font-bold tabular-nums text-brand-black",
                    isPremium ? "text-base" : "text-sm"
                  )}
                >
                  {formatINR(item.pricing.sellingPrice * item.quantity)}
                </p>
                {item.pricing.mrp > item.pricing.sellingPrice && (
                  <p className="text-xs text-brand-muted line-through">
                    {formatINR(item.pricing.mrp * item.quantity)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ItemWrapper>
      ))}
    </ul>
  );
}
