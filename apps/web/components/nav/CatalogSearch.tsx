"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { products } from "@/data/products";
import { POPULAR_SEARCHES } from "@/data/popular-searches";
import { useSearchHistory } from "@/context/SearchHistoryContext";
import { filterProducts, getProductMainImage } from "@/lib/utils";
import { DEFAULT_FILTERS, ROUTES } from "@/lib/constants";
import { getProductPricing, formatINR } from "@/lib/pricing";
import { trackCommerce } from "@/lib/analytics";
import AssetImage from "@/components/ui/AssetImage";

const CATEGORIES = [
  { label: "Men", href: "/products?gender=Men" },
  { label: "Women", href: "/products?gender=Women" },
  { label: "Kids", href: "/products?gender=Kids" },
  { label: "New arrivals", href: "/products?new=1" },
  { label: "Bathroom", href: "/products?category=Bathroom" },
  { label: "Orthopedic", href: "/products?category=Orthopedic" },
  { label: "Memory foam", href: "/products?material=Memory Foam" },
] as const;

export default function CatalogSearch() {
  const router = useRouter();
  const { recent, add } = useSearchHistory();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const matches = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return filterProducts(products, { ...DEFAULT_FILTERS, search: q }).slice(0, 6);
  }, [query]);

  useEffect(() => {
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const go = (term: string) => {
    const q = term.trim();
    if (!q) return;
    add(q);
    trackCommerce("search", { search_term: q });
    setOpen(false);
    setQuery("");
    router.push(`${ROUTES.search}?q=${encodeURIComponent(q)}`);
  };

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          go(query);
        }}
      >
        <label htmlFor="catalog-search" className="sr-only">
          Search for products, styles and more
        </label>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
          aria-hidden
        />
        <input
          id="catalog-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search for products, styles and more"
          autoComplete="off"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          className="h-11 w-full rounded-full border border-black/10 bg-white pl-10 pr-4 text-sm text-brand-black outline-none ring-brand-accent/30 placeholder:text-brand-muted focus:ring-2 dark:border-white/15 dark:bg-[#1c1916] dark:text-[#f4f0ea]"
        />
      </form>

      {open ? (
        <div
          id={listId}
          className="absolute left-0 right-0 top-[calc(100%+0.4rem)] z-[80] max-h-[70vh] overflow-y-auto rounded-2xl border border-black/10 bg-[#fffcf8] p-3 shadow-[0_18px_50px_-24px_rgba(22,19,17,0.45)] dark:border-white/10 dark:bg-[#161412]"
        >
          {matches.length > 0 ? (
            <div className="mb-3">
              <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted">
                Products
              </p>
              <ul>
                {matches.map((product) => {
                  const pricing = getProductPricing(product);
                  return (
                    <li key={product.slug}>
                      <Link
                        href={`/products/${product.slug}`}
                        onClick={() => {
                          if (query.trim()) add(query.trim());
                          setOpen(false);
                        }}
                        className="focus-ring flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-black/[0.04] dark:hover:bg-white/5"
                      >
                        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-[#efeae3]">
                          <AssetImage
                            src={getProductMainImage(product)}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-brand-black dark:text-[#f4f0ea]">
                            {product.name}
                          </span>
                          <span className="text-xs text-brand-muted">
                            {product.gender} · {product.color} · {formatINR(pricing.sellingPrice)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {recent.length > 0 ? (
            <SuggestionRow title="Recent searches" items={recent.slice(0, 6)} onPick={go} />
          ) : null}
          <SuggestionRow title="Popular searches" items={[...POPULAR_SEARCHES]} onPick={go} />

          <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted">
            Categories
          </p>
          <div className="flex flex-wrap gap-2 px-2 pb-1">
            {CATEGORIES.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                onClick={() => setOpen(false)}
                className="focus-ring inline-flex min-h-11 items-center rounded-full border border-black/10 px-3 text-xs font-semibold dark:border-white/15"
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SuggestionRow({
  title,
  items,
  onPick,
}: {
  title: string;
  items: readonly string[];
  onPick: (term: string) => void;
}) {
  return (
    <div className="mb-2">
      <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-muted">
        {title}
      </p>
      <div className="flex flex-wrap gap-2 px-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onPick(item)}
            className="focus-ring inline-flex min-h-11 items-center rounded-full bg-black/[0.04] px-3 text-xs font-medium dark:bg-white/10"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
