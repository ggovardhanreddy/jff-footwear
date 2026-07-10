"use client";

import { useEffect } from "react";
import { getProductMainImage } from "@/lib/utils";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useInstall } from "@/context/InstallContext";
import type { Product } from "@/types";

/** Tracks product views — place on PDP */
export function ProductViewTracker({ product }: { product: Product }) {
  const { track } = useRecentlyViewed();
  const { trackProductView } = useInstall();

  useEffect(() => {
    track({
      slug: product.slug,
      name: product.name,
      image: getProductMainImage(product),
    });
    trackProductView();
  }, [product, track, trackProductView]);

  return null;
}
