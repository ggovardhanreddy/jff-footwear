"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { COLOR_MAP } from "@/lib/constants";
import type { ColorVariant, ProductColor } from "@/types";
import { cn } from "@/lib/utils";

interface ColorSelectorProps {
  variants: ColorVariant[];
  selectedColor: ProductColor;
  onSelect: (variant: ColorVariant) => void;
  size?: "sm" | "md";
}

export default function ColorSelector({
  variants,
  selectedColor,
  onSelect,
  size = "md",
}: ColorSelectorProps) {
  const reduced = useReducedMotion();
  const dotSize = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((variant) => {
        const hex = COLOR_MAP[variant.color] || COLOR_MAP.Standard;
        const isSelected = selectedColor === variant.color;
        const isLight = ["White", "Cream", "Yellow"].includes(variant.color);

        return (
          <button
            key={variant.slug}
            onClick={() => onSelect(variant)}
            className="group flex flex-col items-center gap-1.5"
            aria-label={`Select ${variant.color}`}
            aria-pressed={isSelected}
            title={variant.color}
          >
            <span className="relative">
              {isSelected && !reduced && (
                <motion.span
                  layoutId="color-ring"
                  className="absolute -inset-1.5 rounded-full border-2 border-brand-accent"
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                />
              )}
              <motion.span
                animate={
                  isSelected && !reduced
                    ? { scale: [1, 1.12, 1], boxShadow: "0 0 20px rgba(200,169,110,0.45)" }
                    : { scale: 1, boxShadow: "0 0 0px transparent" }
                }
                transition={{ duration: 0.35 }}
                className={cn(
                  dotSize,
                  "relative block rounded-full border-2 transition-colors duration-200",
                  isSelected
                    ? "border-brand-black"
                    : "border-gray-200 group-hover:border-brand-muted",
                  isLight && "shadow-inner"
                )}
                style={{ backgroundColor: hex }}
              />
            </span>
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wider",
                isSelected ? "text-brand-black" : "text-brand-muted"
              )}
            >
              {variant.color}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function ColorLinkSelector({
  variants,
  selectedColor,
}: {
  variants: ColorVariant[];
  selectedColor: ProductColor;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {variants.map((variant) => {
        const hex = COLOR_MAP[variant.color] || COLOR_MAP.Standard;
        const isSelected = selectedColor === variant.color;

        return (
          <Link
            key={variant.slug}
            href={`/products/${variant.slug}`}
            className="group flex flex-col items-center gap-1.5"
            aria-label={`View ${variant.color}`}
          >
            <span
              className={cn(
                "h-8 w-8 rounded-full border-2 transition-all",
                isSelected
                  ? "border-brand-black ring-2 ring-brand-accent ring-offset-2"
                  : "border-gray-200 group-hover:border-brand-muted"
              )}
              style={{ backgroundColor: hex }}
            />
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wider",
                isSelected ? "text-brand-black" : "text-brand-muted"
              )}
            >
              {variant.color}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
