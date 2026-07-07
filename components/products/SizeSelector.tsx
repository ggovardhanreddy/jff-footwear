"use client";

import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: number[];
  selected: number | null;
  onSelect: (size: number) => void;
}

export default function SizeSelector({
  sizes,
  selected,
  onSelect,
}: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isSelected = selected === size;
        return (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={cn(
              "flex h-11 w-11 items-center justify-center border text-sm font-medium transition-all duration-200",
              isSelected
                ? "border-brand-black bg-brand-black text-white"
                : "border-gray-200 bg-white text-brand-black hover:border-brand-black"
            )}
            aria-label={`Select size ${size}`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
