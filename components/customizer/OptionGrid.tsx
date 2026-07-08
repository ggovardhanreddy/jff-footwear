"use client";

import { cn } from "@/lib/utils";

interface OptionGridProps<T extends string> {
  options: T[];
  value: T | "";
  onChange: (value: T) => void;
  descriptions?: Partial<Record<T, string>>;
  columns?: 2 | 3 | 4;
}

export default function OptionGrid<T extends string>({
  options,
  value,
  onChange,
  descriptions,
  columns = 3,
}: OptionGridProps<T>) {
  return (
    <div
      className={cn(
        "grid gap-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4"
      )}
      role="listbox"
      aria-label="Options"
    >
      {options.map((option) => {
        const selected = value === option;
        const desc = descriptions?.[option];
        return (
          <button
            key={option}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => onChange(option)}
            className={cn(
              "focus-ring rounded-2xl border p-4 text-left transition-all duration-300",
              selected
                ? "border-brand-accent bg-brand-accent/10 shadow-soft"
                : "border-black/[0.08] bg-white hover:border-brand-accent/40 hover:shadow-soft"
            )}
          >
            <span className="font-display text-base font-semibold text-brand-black">
              {option}
            </span>
            {desc && (
              <p className="mt-2 text-xs leading-relaxed text-brand-muted">
                {desc}
              </p>
            )}
          </button>
        );
      })}
    </div>
  );
}
