"use client";

import Link from "next/link";
import Image from "next/image";
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
            title={variant.color}
          >
            <span className="relative">
              <span
                className={cn(
                  dotSize,
                  "block rounded-full border-2 transition-all duration-200",
                  isSelected
                    ? "border-brand-black ring-2 ring-brand-accent ring-offset-2"
                    : "border-gray-200 group-hover:border-brand-muted",
                  isLight && "shadow-inner"
                )}
                style={{ backgroundColor: hex }}
              />
              {variant.image && (
                <Image
                  src={variant.image}
                  alt=""
                  width={32}
                  height={32}
                  className="sr-only"
                  aria-hidden
                />
              )}
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
