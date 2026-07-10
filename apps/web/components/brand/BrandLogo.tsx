"use client";

import { AnimatePresence, motion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import { useTheme } from "@/context/ThemeContext";
import { assetPath } from "@/lib/paths";
import { brandAssets } from "@jff/ui/brand";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  /** Force logo variant regardless of site theme (e.g. dark footer) */
  variant?: "light" | "dark";
  /**
   * Blend white paper fringes into the page background.
   * Transparent PNGs are preferred; multiply/screen is a safety net.
   */
  blend?: boolean;
}

export default function BrandLogo({
  alt,
  className,
  width = 80,
  height = 80,
  priority = false,
  variant,
  blend = true,
}: BrandLogoProps) {
  const { resolved } = useTheme();
  const theme = variant ?? resolved;
  const isDark = theme === "dark";
  const src = assetPath(isDark ? brandAssets.logoDark : brandAssets.logoLight);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width, height }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <AssetImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            className={cn(
              "h-full w-full bg-transparent object-contain",
              blend && (isDark ? "mix-blend-screen" : "mix-blend-multiply")
            )}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
