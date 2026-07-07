"use client";

import { motion } from "framer-motion";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  loading?: boolean;
}

export default function ProductGrid({
  products,
  emptyMessage = "No products found matching your criteria.",
  loading = false,
}: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[320px] items-center justify-center rounded-3xl bg-white"
      >
        <p className="text-body max-w-md text-center">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <div className="premium-product-gallery grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
