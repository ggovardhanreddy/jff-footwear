"use client";

import { motion, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import QuantitySelector from "@/components/QuantitySelector";
import { formatINR } from "@/lib/pricing";
import { getProductMetaBySlug } from "@/lib/product-meta";
import { checkoutItemStagger, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { hoverLift } from "@/lib/motion";
import { CHECKOUT_EYEBROW, CHECKOUT_SECTION_TITLE } from "@/lib/checkout-styles";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

interface OrderReviewProps {
  items: CartItem[];
  editable?: boolean;
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  className?: string;
}

export default function OrderReview({
  items,
  editable = false,
  onUpdateQuantity,
  onRemove,
  className,
}: OrderReviewProps) {
  const reduced = useReducedMotion();

  if (items.length === 0) {
    return (
      <p className="text-sm text-brand-muted">No items to review.</p>
    );
  }

  return (
    <section className={cn("space-y-5", className)} aria-label="Order review">
      <header>
        <p className={CHECKOUT_EYEBROW}>Your Bag</p>
        <h2 className={cn(CHECKOUT_SECTION_TITLE, "mt-2 text-2xl")}>
          Order Review
        </h2>
      </header>

      <ul className={cn("space-y-4", CHECKOUT_MOTION_GPU)}>
        {items.map((item, index) => {
          const meta = getProductMetaBySlug(item.slug);
          const Wrapper = reduced ? "li" : motion.li;

          return (
            <Wrapper
              key={item.id}
              {...(!reduced
                ? {
                    custom: index,
                    variants: checkoutItemStagger,
                    initial: "hidden",
                    animate: "show",
                  }
                : {})}
            >
              <motion.article
                {...hoverLift(reduced)}
                className="flex gap-4 rounded-[24px] border border-black/[0.05] bg-gradient-to-br from-white to-neutral-50/60 p-4 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.1)] sm:p-5"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-[18px] bg-neutral-100 ring-1 ring-black/[0.04] sm:h-28 sm:w-24">
                  <AssetImage
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>

                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-base font-bold leading-snug text-brand-black sm:text-lg">
                        {item.name}
                      </h3>
                      <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-brand-muted sm:text-sm">
                        {meta && (
                          <>
                            <div>
                              <dt className="inline font-medium">Material: </dt>
                              <dd className="inline">{meta.material}</dd>
                            </div>
                            <div>
                              <dt className="inline font-medium">Category: </dt>
                              <dd className="inline">{meta.category}</dd>
                            </div>
                          </>
                        )}
                        <div>
                          <dt className="inline font-medium">Color: </dt>
                          <dd className="inline">{item.color}</dd>
                        </div>
                        <div>
                          <dt className="inline font-medium">Size: </dt>
                          <dd className="inline">{item.size}</dd>
                        </div>
                      </dl>
                    </div>
                    {editable && onRemove && (
                      <button
                        type="button"
                        onClick={() => onRemove(item.id)}
                        className="shrink-0 text-xs font-semibold text-red-600 transition-colors hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-end justify-between gap-3 border-t border-black/[0.05] pt-3">
                    {editable && onUpdateQuantity ? (
                      <div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand-muted">
                          Quantity
                        </p>
                        <QuantitySelector
                          value={item.quantity}
                          onChange={(qty) => onUpdateQuantity(item.id, qty)}
                          min={1}
                          max={99}
                        />
                      </div>
                    ) : (
                      <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-muted">
                        Qty {item.quantity}
                      </span>
                    )}
                    <div className="text-right">
                      <p className="font-display text-lg font-bold tabular-nums text-brand-black">
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
              </motion.article>
            </Wrapper>
          );
        })}
      </ul>
    </section>
  );
}
