"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProductGalleryTabs from "@/components/products/ProductGalleryTabs";
import ProductDetails from "@/components/products/ProductDetails";
import { getProductBySlug } from "@/lib/utils";
import type { Product, ColorVariant } from "@/types";

interface ProductExperienceProps {
  product: Product;
  colorVariants: ColorVariant[];
  catalog: Product[];
}

/**
 * Client PDP shell — color morph without full page reload,
 * shared gallery + details state.
 */
export default function ProductExperience({
  product: initialProduct,
  colorVariants,
  catalog,
}: ProductExperienceProps) {
  const router = useRouter();
  const [product, setProduct] = useState(initialProduct);

  const handleColorSelect = useCallback(
    (variant: ColorVariant) => {
      if (variant.slug === product.slug) return;
      const next = getProductBySlug(catalog, variant.slug);
      if (!next) {
        router.push(`/products/${variant.slug}`);
        return;
      }
      setProduct(next);
      window.history.replaceState(null, "", `/products/${variant.slug}`);
    },
    [catalog, product.slug, router]
  );

  return (
    <div className="grid gap-12 bg-white dark:bg-transparent lg:grid-cols-2 lg:gap-16">
      <ProductGalleryTabs
        images={product.images}
        productName={product.name}
        morphKey={product.slug}
      />
      <ProductDetails
        product={product}
        colorVariants={colorVariants}
        onColorSelect={handleColorSelect}
      />
    </div>
  );
}
