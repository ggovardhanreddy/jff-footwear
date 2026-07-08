"use client";

import { FileText, Download } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { cn } from "@/lib/utils";

interface GSTInvoiceOptionProps {
  className?: string;
}

export default function GSTInvoiceOption({ className }: GSTInvoiceOptionProps) {
  const { show } = useToast();

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 text-emerald-600" />
        <div>
          <p className="text-sm font-semibold text-brand-black dark:text-white">
            GST Invoice Available
          </p>
          <p className="text-xs text-brand-muted">
            Request GST invoice on checkout via WhatsApp
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => show("Invoice download — coming soon", "info")}
        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 dark:bg-brand-dark"
      >
        <Download className="h-3.5 w-3.5" />
        Download Invoice
      </button>
    </div>
  );
}
