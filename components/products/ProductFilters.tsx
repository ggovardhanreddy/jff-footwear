"use client";

import { SlidersHorizontal, X } from "lucide-react";
import type { ProductFilters } from "@/types";
import { cn } from "@/lib/utils";

interface ProductFilterSidebarProps {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  filterOptions: {
    categories: string[];
    materials: string[];
    genders: string[];
    colors: string[];
    sizes: number[];
  };
  className?: string;
}

export default function ProductFilterSidebar({
  filters,
  onChange,
  filterOptions,
  className,
}: ProductFilterSidebarProps) {
  const update = (partial: Partial<ProductFilters>) => {
    onChange({ ...filters, ...partial });
  };

  const clearFilters = () => {
    onChange({
      ...filters,
      category: "",
      material: "",
      gender: "",
      color: "",
      size: "",
      featured: false,
      newArrival: false,
    });
  };

  const hasActiveFilters =
    filters.category ||
    filters.material ||
    filters.gender ||
    filters.color ||
    filters.size !== "" ||
    filters.featured ||
    filters.newArrival;

  return (
    <div className={cn("space-y-6", className)} id="product-filters">
      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.featured}
            onChange={(e) => update({ featured: e.target.checked })}
            className="accent-brand-accent"
          />
          Featured only
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.newArrival}
            onChange={(e) => update({ newArrival: e.target.checked })}
            className="accent-brand-accent"
          />
          New arrivals only
        </label>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Gender
        </label>
        <select
          value={filters.gender}
          onChange={(e) =>
            update({ gender: e.target.value as ProductFilters["gender"] })
          }
          className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
        >
          <option value="">All Genders</option>
          {filterOptions.genders.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Category
        </label>
        <select
          value={filters.category}
          onChange={(e) =>
            update({ category: e.target.value as ProductFilters["category"] })
          }
          className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
        >
          <option value="">All Categories</option>
          {filterOptions.categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Material
        </label>
        <select
          value={filters.material}
          onChange={(e) =>
            update({ material: e.target.value as ProductFilters["material"] })
          }
          className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
        >
          <option value="">All Materials</option>
          {filterOptions.materials.map((mat) => (
            <option key={mat} value={mat}>
              {mat}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Color
        </label>
        <select
          value={filters.color}
          onChange={(e) =>
            update({ color: e.target.value as ProductFilters["color"] })
          }
          className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
        >
          <option value="">All Colors</option>
          {filterOptions.colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Size
        </label>
        <select
          value={filters.size}
          onChange={(e) =>
            update({ size: e.target.value ? Number(e.target.value) : "" })
          }
          className="w-full border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-accent"
        >
          <option value="">All Sizes</option>
          {filterOptions.sizes.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex w-full items-center justify-center gap-2 border border-gray-200 py-2.5 text-xs font-semibold uppercase tracking-widest text-brand-muted transition-colors hover:border-brand-black hover:text-brand-black"
        >
          <X className="h-3.5 w-3.5" />
          Clear Filters
        </button>
      )}
    </div>
  );
}

export function MobileFilterToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="focus-ring flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium lg:hidden"
      aria-expanded={isOpen}
      aria-controls="product-filters"
    >
      <SlidersHorizontal className="h-4 w-4" />
      {isOpen ? "Hide Filters" : "Filters"}
    </button>
  );
}
