"use client";

import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import ProductCard from "./ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  emptyVariant?: "search" | "products";
  loading?: boolean;
  infiniteScroll?: boolean;
  onQuickView?: (product: Product) => void;
}

export default function ProductGrid({
  products,
  emptyMessage = "No products found matching your criteria.",
  emptyVariant = "search",
  loading = false,
  infiniteScroll = false,
  onQuickView,
}: ProductGridProps) {
  const { visibleItems, hasMore, sentinelRef } = useInfiniteScroll(products, {
    pageSize: 12,
    total: products.length,
  });

  const display = infiniteScroll ? visibleItems : products;

  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (products.length === 0) {
    if (emptyVariant === "search") {
      return (
        <EmptyState
          icon={PackageSearch}
          title="No results found"
          description={emptyMessage}
          actionLabel="Browse All Products"
          actionHref="/products"
        />
      );
    }
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-[320px] items-center justify-center rounded-3xl bg-white dark:bg-brand-dark"
      >
        <p className="text-body max-w-md text-center">{emptyMessage}</p>
      </motion.div>
    );
  }

  return (
    <>
      <div className="premium-product-gallery grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {display.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            priority={index < 4}
            onQuickView={onQuickView}
          />
        ))}
      </div>
      {infiniteScroll && hasMore && (
        <div ref={sentinelRef} className="py-8">
          <ProductGridSkeleton count={4} />
        </div>
      )}
    </>
  );
}
