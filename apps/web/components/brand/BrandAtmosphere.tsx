"use client";

import { motion, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import { useTheme } from "@/context/ThemeContext";
import { assetPath } from "@/lib/paths";
import { brandAssets, brandDark, brandLight } from "@jff/ui/brand";
import { cn } from "@/lib/utils";

/** Ambient gradient orbs + subtle brand watermark — adapts to light/dark theme. */
export default function BrandAtmosphere() {
  const { resolved } = useTheme();
  const reduced = useReducedMotion();
  const tokens = resolved === "dark" ? brandDark : brandLight;
  const isDark = resolved === "dark";
  const backgroundLogo = assetPath(
    isDark ? brandAssets.backgroundLogoDark : brandAssets.backgroundLogoLight
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ background: tokens.gradient }} />

      {/* Large brand watermark — transparent PNG assets */}
      <div className="absolute inset-0 flex items-center justify-center pt-12">
        <motion.div
          animate={
            reduced
              ? undefined
              : {
                  scale: [1, 1.03, 1],
                  y: [0, -12, 0],
                }
          }
          transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          className={cn(
            "relative h-[min(88vw,680px)] w-[min(88vw,680px)]",
            isDark ? "opacity-[0.18]" : "opacity-[0.10]"
          )}
        >
          <AssetImage src={backgroundLogo} alt="" fill sizes="100vw" className="object-contain" />
        </motion.div>
      </div>

      {!reduced ? (
        <>
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-32 top-20 h-96 w-96 rounded-full opacity-40 blur-3xl dark:opacity-25"
            style={{ background: resolved === "dark" ? "#3b82f6" : "#93c5fd" }}
          />
          <motion.div
            animate={{ x: [0, -24, 0], y: [0, 16, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-24 bottom-32 h-80 w-80 rounded-full opacity-30 blur-3xl dark:opacity-20"
            style={{ background: resolved === "dark" ? "#6366f1" : "#bfdbfe" }}
          />
        </>
      ) : null}
    </div>
  );
}
