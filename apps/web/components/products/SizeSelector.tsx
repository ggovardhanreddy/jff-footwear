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
              "focus-ring flex h-11 min-w-[2.75rem] items-center justify-center rounded-xl border px-2 text-sm font-medium transition-all duration-200",
              isSelected
                ? "border-brand-black bg-brand-black text-white"
                : "border-gray-200 bg-white text-brand-black hover:border-brand-black"
            )}
            aria-label={`Select size ${size}`}
            aria-pressed={isSelected}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
