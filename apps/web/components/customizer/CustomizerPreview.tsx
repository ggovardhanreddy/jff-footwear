"use client";

import { motion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import { COLOR_MAP } from "@/lib/constants";
import { getPreviewCaption, getPreviewImage } from "@/lib/customizer/images";
import type { ProductCustomization } from "@/types/customizer";
import type { ProductColor } from "@/types";
import { cn } from "@/lib/utils";

interface CustomizerPreviewProps {
  config: ProductCustomization;
  className?: string;
}

export default function CustomizerPreview({
  config,
  className,
}: CustomizerPreviewProps) {
  const previewImage = getPreviewImage(config);
  const caption = getPreviewCaption(config);

  return (
    <div className={cn("rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-premium backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:glass-card", className)}>
      <p className="eyebrow text-brand-accent">Live Preview</p>
      <div className="relative mt-4 aspect-square overflow-hidden rounded-2xl bg-brand-light dark:bg-brand-charcoal">
        {previewImage ? (
          <motion.div
            key={previewImage + config.color + config.category}
            initial={{ opacity: 0.6, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative h-full w-full"
          >
            <AssetImage
              src={previewImage}
              alt="Custom slipper preview"
              fill
              className="object-contain p-4"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            {config.customLogo && config.logoPreviewUrl && (
              <div
                className={cn(
                  "absolute flex items-center justify-center rounded-lg border-2 border-white/80 bg-white/90 p-1 shadow-lg",
                  logoPositionClass(config.logoPosition)
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={config.logoPreviewUrl}
                  alt="Logo preview"
                  className="max-h-10 max-w-16 object-contain"
                />
              </div>
            )}
          </motion.div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center text-sm text-brand-muted">
            <span className="text-4xl opacity-40">👟</span>
            <p>Options update the preview as you configure</p>
          </div>
        )}
      </div>

      <p className="mt-3 text-center text-xs font-medium text-brand-muted">
        {caption}
      </p>

      {config.color && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <span
            className="h-5 w-5 rounded-full border"
            style={{
              backgroundColor:
                COLOR_MAP[config.color as ProductColor] ?? COLOR_MAP.Standard,
            }}
            aria-hidden
          />
          <span className="text-sm font-medium">{config.color}</span>
          {config.size !== "" && (
            <span className="text-sm text-brand-muted">· Size {config.size}</span>
          )}
        </div>
      )}
    </div>
  );
}

function logoPositionClass(position: ProductCustomization["logoPosition"]): string {
  switch (position) {
    case "Top":
      return "left-1/2 top-4 -translate-x-1/2";
    case "Heel":
      return "bottom-4 left-1/2 -translate-x-1/2";
    case "Side":
      return "right-4 top-1/2 -translate-y-1/2";
    case "Strap":
      return "left-4 top-1/3";
    default:
      return "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2";
  }
}
