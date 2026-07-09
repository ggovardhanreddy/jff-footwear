"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NavSearchProps {
  showSolid: boolean;
}

export default function NavSearch({ showSolid }: NavSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (!q) return;
      router.push(`${ROUTES.search}?q=${encodeURIComponent(q)}`);
      setOpen(false);
      setQuery("");
    },
    [query, router]
  );

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "focus-ring hidden rounded-lg p-2.5 transition-colors md:inline-flex",
          showSolid
            ? "text-brand-black hover:text-brand-accent"
            : "text-white/90 hover:text-brand-accent"
        )}
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="hidden items-center gap-2 md:flex"
      role="search"
    >
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search slippers…"
          autoFocus
          className="w-48 rounded-xl border border-black/10 bg-white/90 py-2 pl-9 pr-3 text-sm backdrop-blur-md focus:border-brand-accent focus:outline-none focus:ring-2 focus:ring-brand-accent/30 lg:w-56"
          aria-label="Search products"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          setQuery("");
        }}
        className="focus-ring rounded-lg p-2 text-brand-muted hover:text-brand-black"
        aria-label="Close search"
      >
        <X className="h-4 w-4" />
      </button>
    </form>
  );
}
