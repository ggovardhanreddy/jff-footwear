"use client";

import { motion } from "framer-motion";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import PageShell from "@/components/ui/PageShell";

export default function CartLoading() {
  return (
    <PageShell className="pb-12">
      <motion.div
        className="page-header space-y-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="skeleton-shimmer h-4 w-28 rounded-full" aria-hidden />
        <div className="skeleton-shimmer h-10 w-48 rounded-xl" aria-hidden />
      </motion.div>
      <ProductGridSkeleton count={2} />
      <p className="sr-only" role="status">
        Loading cart…
      </p>
    </PageShell>
  );
}
