"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import AssetImage from "@/components/ui/AssetImage";
import PriceCard from "@/components/pricing/PriceCard";
import ButtonLink from "@/components/ui/ButtonLink";
import { getProductPricing } from "@/lib/pricing";
import { getProductMainImage } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import type { Product } from "@/types";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const reduced = useReducedMotion();
  const pricing = product ? getProductPricing(product) : null;

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-view-title"
        >
          <motion.div
            initial={reduced ? false : { scale: 0.92, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduced ? undefined : { scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="grid max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-[28px] bg-white shadow-2xl dark:bg-brand-dark sm:grid-cols-2"
          >
            <div className="relative aspect-square bg-neutral-100">
              <AssetImage
                src={getProductMainImage(product)}
                alt={product.name}
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
            <div className="flex flex-col overflow-y-auto p-6">
              <div className="flex items-start justify-between gap-2">
                <h2
                  id="quick-view-title"
                  className="font-display text-xl font-bold text-brand-black dark:text-white"
                >
                  {product.name}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-sm text-brand-muted">
                {product.category} · {product.material}
              </p>
              {pricing && <PriceCard pricing={pricing} className="mt-4" />}
              <p className="mt-4 line-clamp-3 text-sm text-brand-muted">
                {product.description}
              </p>
              <div className="mt-auto flex flex-col gap-2 pt-6">
                <ButtonLink
                  href={ROUTES.product(product.slug)}
                  size="lg"
                  className="w-full justify-center"
                >
                  View Full Details
                </ButtonLink>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Hook-style opener for product cards */
export function useQuickView() {
  const [product, setProduct] = useState<Product | null>(null);
  return {
    product,
    open: setProduct,
    close: () => setProduct(null),
  };
}
