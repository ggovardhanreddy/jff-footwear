"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductFilterSidebar, {
  MobileFilterToggle,
} from "@/components/products/ProductFilters";
import ProductGrid from "@/components/products/ProductGrid";
import SearchBar from "@/components/ui/SearchBar";
import SectionHeading from "@/components/ui/SectionHeading";
import Breadcrumb from "@/components/Breadcrumb";
import { filterProducts } from "@/lib/utils";
import { DEFAULT_FILTERS, SORT_OPTIONS } from "@/lib/constants";
import type { Product, ProductFilters } from "@/types";
import { cn } from "@/lib/utils";

interface ProductsPageClientProps {
  products: Product[];
  filterOptions: {
    categories: string[];
    materials: string[];
    genders: string[];
    colors: string[];
    sizes: number[];
  };
}

export default function ProductsPageClient({
  products,
  filterOptions,
}: ProductsPageClientProps) {
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category:
        (searchParams.get("category") as ProductFilters["category"]) || "",
      material:
        (searchParams.get("material") as ProductFilters["material"]) || "",
      gender: (searchParams.get("gender") as ProductFilters["gender"]) || "",
      color: (searchParams.get("color") as ProductFilters["color"]) || "",
      size: searchParams.get("size") ? Number(searchParams.get("size")) : "",
      sort: (searchParams.get("sort") as ProductFilters["sort"]) || "featured",
      search: searchParams.get("search") || "",
      featured: searchParams.get("featured") === "true",
      newArrival: searchParams.get("new") === "true",
    }));
  }, [searchParams]);

  const filtered = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );

  return (
    <div className="relative z-10 container-custom section-padding">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
        ]}
      />

      <SectionHeading
        subtitle="Our Collection"
        title="All Products"
        titleAs="h1"
        description="Browse our complete range of premium slippers. Filter by category, material, color, size, and more."
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <SearchBar
          value={filters.search}
          onChange={(search) => setFilters({ ...filters, search })}
          className="max-w-md flex-1"
        />
        <div className="flex items-center gap-3">
          <select
            value={filters.sort}
            onChange={(e) =>
              setFilters({ ...filters, sort: e.target.value as never })
            }
            className="input-field w-auto py-3"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <MobileFilterToggle
            isOpen={mobileFiltersOpen}
            onToggle={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          />
        </div>
      </div>

      <p className="mb-6 text-sm text-brand-muted">
        Showing{" "}
        <span className="font-semibold text-brand-black">{filtered.length}</span>{" "}
        products
      </p>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside
          className={cn(
            "w-full shrink-0 lg:block lg:w-64",
            mobileFiltersOpen ? "block" : "hidden"
          )}
        >
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-widest">
            Filters
          </h3>
          <ProductFilterSidebar
            filters={filters}
            onChange={setFilters}
            filterOptions={filterOptions}
          />
        </aside>

        <div className="flex-1">
          <ProductGrid products={filtered} />
        </div>
      </div>
    </div>
  );
}
