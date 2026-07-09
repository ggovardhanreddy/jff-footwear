"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import ProductGrid from "@/components/products/ProductGrid";
import EmptyState from "@/components/ui/EmptyState";
import { SearchSuggestions } from "@/components/features";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { filterProducts } from "@/lib/utils";
import { DEFAULT_FILTERS, ROUTES } from "@/lib/constants";
import { useSearchHistory } from "@/context/SearchHistoryContext";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const { add: addSearch } = useSearchHistory();
  const [submitted, setSubmitted] = useState(query);

  useEffect(() => {
    setSubmitted(query);
    if (query) addSearch(query);
  }, [query, addSearch]);

  const results = useMemo(() => {
    if (!submitted) return [];
    return filterProducts(products, {
      ...DEFAULT_FILTERS,
      search: submitted,
    });
  }, [submitted]);

  return (
    <PageShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Search", href: ROUTES.search },
        ]}
      />
      <PageHeader
        eyebrow="Discover"
        title="Search"
        description="Find slippers by name, category, material, or colour."
      />

      <div className="mx-auto mb-12 max-w-2xl">
        <SearchSuggestions
          onSelect={(q) => {
            window.location.href = `${ROUTES.search}?q=${encodeURIComponent(q)}`;
          }}
        />
      </div>

      {submitted && (
        <div className="mt-4">
          <p className="mb-6 text-sm text-brand-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-brand-black dark:text-white">
              &ldquo;{submitted}&rdquo;
            </span>
          </p>
          {results.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products found"
              description="Try a different keyword or browse our collections."
              actionLabel="Browse Collections"
              actionHref={ROUTES.collections}
            />
          ) : (
            <ProductGrid products={results} />
          )}
        </div>
      )}
    </PageShell>
  );
}
