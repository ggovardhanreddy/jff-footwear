"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";

interface ProductCardQuickViewProps {
  href: string;
  productName: string;
}

export default function ProductCardQuickView({
  href,
  productName,
}: ProductCardQuickViewProps) {
  return (
    <div className="absolute inset-x-5 bottom-5 z-20 flex justify-center opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
      <motion.div
        initial={false}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
      >
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-black shadow-[0_8px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl transition-colors duration-300 hover:bg-brand-black hover:text-white"
          aria-label={`Quick view ${productName}`}
        >
          <Eye className="h-4 w-4" />
          Quick View
        </Link>
      </motion.div>
    </div>
  );
}
