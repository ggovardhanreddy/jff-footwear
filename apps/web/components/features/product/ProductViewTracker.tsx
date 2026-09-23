"use client";

import { useEffect } from "react";
import { getProductMainImage } from "@/lib/utils";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useInstall } from "@/context/InstallContext";
import { trackCommerce } from "@/lib/analytics";
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
    trackCommerce("view_item", { item_id: product.slug });
  }, [product, track, trackProductView]);

  return null;
}
