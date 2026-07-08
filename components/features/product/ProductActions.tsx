"use client";

import {
  Share2,
  Link2,
  Printer,
  Download,
  GitCompare,
  FileText,
} from "lucide-react";
import { useCompare } from "@/context/CompareContext";
import { useToast } from "@/context/ToastContext";
import { shareProduct } from "@/lib/utils";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductActionsProps {
  product: Product;
  className?: string;
}

export default function ProductActions({
  product,
  className,
}: ProductActionsProps) {
  const { toggle, isComparing } = useCompare();
  const { show } = useToast();

  const productUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/products/${product.slug}`
      : `/products/${product.slug}`;

  const handleShare = async () => {
    try {
      await shareProduct(product, productUrl);
      show("Link copied to clipboard!", "success");
    } catch {
      show("Unable to share", "error");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      show("Product link copied!", "success");
    } catch {
      show("Copy failed", "error");
    }
  };

  const handlePrint = () => {
    window.print();
    show("Print dialog opened", "info");
  };

  const handleCatalogue = () => {
    show("Catalogue PDF download — coming soon", "info");
  };

  const handleQuotation = () => {
    show("Print quotation — coming soon", "info");
  };

  const handleCompare = () => {
    toggle(product);
    show(
      isComparing(product.slug)
        ? "Removed from compare"
        : "Added to compare (max 4)",
      "success"
    );
  };

  const actions = [
    { icon: Share2, label: "Share", onClick: handleShare },
    { icon: Link2, label: "Copy Link", onClick: handleCopy },
    { icon: GitCompare, label: "Compare", onClick: handleCompare, active: isComparing(product.slug) },
    { icon: Printer, label: "Print", onClick: handlePrint },
    { icon: Download, label: "Catalogue PDF", onClick: handleCatalogue },
    { icon: FileText, label: "Quotation", onClick: handleQuotation },
  ];

  return (
    <div
      className={cn("flex flex-wrap gap-2", className)}
      role="group"
      aria-label="Product actions"
    >
      {actions.map(({ icon: Icon, label, onClick, active }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-colors",
            active
              ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
              : "border-black/10 bg-white hover:border-brand-accent hover:text-brand-accent dark:border-white/10 dark:bg-brand-dark"
          )}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
