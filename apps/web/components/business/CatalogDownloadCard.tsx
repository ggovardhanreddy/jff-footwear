"use client";

import Link from "next/link";
import { Download, FileSpreadsheet } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { CATALOG_PATHS } from "@jff/config/wholesale-config";
import { ROUTES } from "@/lib/constants";
import Button from "@/components/ui/Button";

interface CatalogDownloadCardProps {
  productCount: number;
  className?: string;
}

export default function CatalogDownloadCard({
  productCount,
  className,
}: CatalogDownloadCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={className}
    >
      <div className="rounded-[24px] border border-black/[0.06] bg-white p-6 shadow-soft dark:border-white/10 dark:glass-card">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10">
            <FileSpreadsheet className="h-6 w-6 text-brand-accent" aria-hidden />
          </div>
          <div className="flex-1">
            <p className="eyebrow text-brand-accent">Product Catalog</p>
            <h3 className="mt-1 font-display text-xl font-bold">Download Full Catalogue</h3>
            <p className="mt-2 text-sm text-brand-muted">
              {productCount} styles with SKU, category, sizes, MRP, retail, and indicative
              wholesale / distributor pricing — ready for your buying team.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a href={CATALOG_PATHS.csv} download="jff-catalog.csv">
            <Button variant="primary" type="button">
              <Download className="h-4 w-4" />
              Download CSV
            </Button>
          </a>
          <Link href={ROUTES.catalog}>
            <Button variant="outline" type="button">
              Browse Catalog
            </Button>
          </Link>
        </div>

        <p className="mt-4 text-xs text-brand-muted">
          Updated with the latest product range. For printed catalogues or custom assortments,
          contact our wholesale team.
        </p>
      </div>
    </motion.div>
  );
}
