"use client";

import { Share2, Link2, Printer, Download, GitCompare, FileText } from "lucide-react";
import { CATALOG_PATHS, MOQ_BY_ORDER_TYPE } from "@jff/config/wholesale-config";
import { getWholesaleUnitPrice } from "@jff/utils/wholesale";
import type { Product } from "@/types";
import { useCompare } from "@/context/CompareContext";
import { useToast } from "@/context/ToastContext";
import { formatINR, getProductPricing } from "@/lib/pricing";
import { cn, shareProduct } from "@/lib/utils";

interface ProductActionsProps {
  product: Product;
  className?: string;
}

export default function ProductActions({ product, className }: ProductActionsProps) {
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
    const link = document.createElement("a");
    link.href = CATALOG_PATHS.csv;
    link.download = "jff-catalog.csv";
    link.click();
    show("Catalogue download started", "success");
  };

  const handleQuotation = () => {
    const pricing = getProductPricing(product);
    const wholesale = getWholesaleUnitPrice(pricing.sellingPrice, "wholesale");
    const distributor = getWholesaleUnitPrice(pricing.sellingPrice, "distributor");
    const html = `<!DOCTYPE html><html><head><title>JFF Quotation — ${product.name}</title>
<style>body{font-family:system-ui,sans-serif;padding:2rem;max-width:640px;margin:0 auto}
h1{font-size:1.25rem}table{width:100%;border-collapse:collapse;margin-top:1rem}
td,th{border:1px solid #ddd;padding:.5rem;text-align:left}th{background:#f5f5f5}
.small{color:#666;font-size:.875rem;margin-top:2rem}</style></head><body>
<h1>JFF Footwear — Indicative Quotation</h1>
<p><strong>${product.name}</strong> (${product.slug})</p>
<table><tr><th>Price type</th><th>Per pair</th><th>MOQ</th></tr>
<tr><td>Retail</td><td>${formatINR(pricing.sellingPrice)}</td><td>1</td></tr>
<tr><td>Wholesale</td><td>${formatINR(wholesale)}</td><td>${MOQ_BY_ORDER_TYPE.Wholesale}+</td></tr>
<tr><td>Distributor</td><td>${formatINR(distributor)}</td><td>${MOQ_BY_ORDER_TYPE.Distributor}+</td></tr>
</table>
<p class="small">Indicative pricing only. Final quote on WhatsApp. ${new Date().toLocaleDateString("en-IN")}</p>
<script>window.onload=function(){window.print()}</script></body></html>`;
    const win = window.open("", "_blank", "noopener,noreferrer");
    if (win) {
      win.document.write(html);
      win.document.close();
      show("Quotation opened for print", "info");
    } else {
      show("Allow pop-ups to print quotation", "error");
    }
  };

  const handleCompare = () => {
    toggle(product);
    show(
      isComparing(product.slug) ? "Removed from compare" : "Added to compare (max 4)",
      "success"
    );
  };

  const actions = [
    { icon: Share2, label: "Share", onClick: handleShare },
    { icon: Link2, label: "Copy Link", onClick: handleCopy },
    {
      icon: GitCompare,
      label: "Compare",
      onClick: handleCompare,
      active: isComparing(product.slug),
    },
    { icon: Printer, label: "Print", onClick: handlePrint },
    { icon: Download, label: "Catalogue CSV", onClick: handleCatalogue },
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
