"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import ImmersiveProductViewer from "./ImmersiveProductViewer";
import { cn } from "@/lib/utils";

const Product360Viewer = dynamic(() => import("./Product360Viewer"), {
  loading: () => (
    <div className="skeleton-shimmer aspect-square w-full rounded-3xl" />
  ),
});

interface ProductGalleryTabsProps {
  images: string[];
  productName: string;
  /** Changes trigger image morph when color variant switches */
  morphKey?: string;
}

export default function ProductGalleryTabs({
  images,
  productName,
  morphKey,
}: ProductGalleryTabsProps) {
  const [mode, setMode] = useState<"gallery" | "360">("gallery");
  const has360 = images.some((img) => /360|spin|frame/i.test(img));

  return (
    <div>
      {has360 && (
        <div
          className="mb-4 inline-flex rounded-xl border border-black/[0.06] bg-white p-1"
          role="tablist"
          aria-label="Gallery view"
        >
          {(["gallery", "360"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={mode === tab}
              onClick={() => setMode(tab)}
              className={cn(
                "focus-ring rounded-lg px-4 py-2 text-xs font-semibold uppercase tracking-widest transition-colors",
                mode === tab
                  ? "bg-brand-black text-white"
                  : "text-brand-muted hover:text-brand-black"
              )}
            >
              {tab === "gallery" ? "Gallery" : "360° View"}
            </button>
          ))}
        </div>
      )}

      {mode === "gallery" || !has360 ? (
        <ImmersiveProductViewer
          key={morphKey ?? productName}
          images={images}
          productName={productName}
        />
      ) : (
        <Product360Viewer images={images} productName={productName} />
      )}
    </div>
  );
}
