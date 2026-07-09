"use client";

import { useEffect } from "react";
import { getProductMainImage } from "@/lib/utils";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import type { Product } from "@/types";

/** Tracks product views — place on PDP */
export function ProductViewTracker({ product }: { product: Product }) {
  const { track } = useRecentlyViewed();

  useEffect(() => {
    track({
      slug: product.slug,
      name: product.name,
      image: getProductMainImage(product),
    });
  }, [product, track]);

  return null;
}
