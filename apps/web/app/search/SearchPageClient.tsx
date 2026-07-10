"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mic, Search } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import ProductGrid from "@/components/products/ProductGrid";
import ProductCard from "@/components/products/ProductCard";
import EmptyState from "@/components/ui/EmptyState";
import { SearchSuggestions } from "@/components/features";
import { AnimatedBorder } from "@/components/premium";
import { products } from "@/data/products";
import { filterProducts } from "@/lib/utils";
import { DEFAULT_FILTERS, ROUTES } from "@/lib/constants";
import { useSearchHistory } from "@/context/SearchHistoryContext";
import { POPULAR_SEARCHES } from "@/data/popular-searches";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const { add: addSearch, recent } = useSearchHistory();
  const [liveQuery, setLiveQuery] = useState(query);

  useEffect(() => {
    setLiveQuery(query);
    if (query) addSearch(query);
  }, [query, addSearch]);

  const liveResults = useMemo(() => {
    const q = liveQuery.trim();
    if (!q) return [];
    return filterProducts(products, {
      ...DEFAULT_FILTERS,
      search: q,
    }).slice(0, 24);
  }, [liveQuery]);

  const popularProducts = useMemo(() => products.filter((p) => p.featured).slice(0, 8), []);

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
        title="Search JFF"
        description="Live search · voice · recent · trending · popular pairs."
      />

      <AnimatedBorder className="mx-auto mb-10 max-w-2xl" contentClassName="p-4 md:p-5">
        <SearchSuggestions
          onSelect={(q) => {
            setLiveQuery(q);
            window.location.href = `${ROUTES.search}?q=${encodeURIComponent(q)}`;
          }}
        />
        <p className="mt-3 flex items-center gap-1.5 text-[11px] text-brand-muted">
          <Mic className="h-3.5 w-3.5" aria-hidden />
          Voice search available via the mic — say a style, material, or gender.
        </p>
      </AnimatedBorder>

      {/* Live typeahead results without full navigation */}
      <div className="mb-8">
        <label className="sr-only" htmlFor="live-search">
          Live search
        </label>
        <input
          id="live-search"
          type="search"
          value={liveQuery}
          onChange={(e) => setLiveQuery(e.target.value)}
          placeholder="Type to search live…"
          className="input-field mx-auto mb-6 block w-full max-w-2xl rounded-2xl py-3.5"
          aria-label="Live product search"
        />
      </div>

      {liveQuery.trim() ? (
        <div className="mt-2">
          <p className="mb-6 text-sm text-brand-muted">
            {liveResults.length} result{liveResults.length === 1 ? "" : "s"} for{" "}
            <span className="font-semibold text-brand-black dark:text-white">
              &ldquo;{liveQuery.trim()}&rdquo;
            </span>
          </p>
          {liveResults.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No products found"
              description="Try a different keyword or browse our collections."
              actionLabel="Browse Collections"
              actionHref={ROUTES.collections}
            />
          ) : (
            <ProductGrid products={liveResults} />
          )}
        </div>
      ) : (
        <div className="space-y-12">
          {recent.length > 0 && (
            <section>
              <h2 className="mb-4 font-display text-xl font-semibold">Recent searches</h2>
              <div className="flex flex-wrap gap-2">
                {recent.map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setLiveQuery(term)}
                    className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium dark:border-white/10 dark:bg-brand-dark"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-4 font-display text-xl font-semibold">Trending searches</h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => {
                    addSearch(term);
                    setLiveQuery(term);
                  }}
                  className="rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1.5 text-xs font-semibold text-brand-black dark:text-brand-accent"
                >
                  {term}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-2 font-display text-xl font-semibold">Popular products</h2>
            <p className="mb-6 text-sm text-brand-muted">
              Featured JFF pairs shoppers open most often.
            </p>
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:px-0">
              {popularProducts.map((product, index) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.04 }}
                  className="w-[78vw] shrink-0 sm:w-[46vw] md:w-auto"
                >
                  <ProductCard product={product} index={index} />
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}
    </PageShell>
  );
}
