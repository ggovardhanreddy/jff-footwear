"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, TrendingUp, Mic, ScanLine } from "lucide-react";
import { POPULAR_SEARCHES } from "@/data/popular-searches";
import { useSearchHistory } from "@/context/SearchHistoryContext";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface SearchSuggestionsProps {
  className?: string;
  onSelect?: (query: string) => void;
}

export default function SearchSuggestions({ className, onSelect }: SearchSuggestionsProps) {
  const { recent, add } = useSearchHistory();
  const [query, setQuery] = useState("");

  const submit = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    add(trimmed);
    onSelect?.(trimmed);
    window.location.href = `${ROUTES.search}?q=${encodeURIComponent(trimmed)}`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
        className="relative"
        role="search"
      >
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search or tap mic for voice…"
          className="input-field w-full rounded-2xl py-3.5 pl-11 pr-24"
          aria-label="Search products"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-1">
          <button
            type="button"
            className="rounded-lg p-2 text-brand-muted hover:bg-black/5"
            aria-label="Voice search"
            title="Voice search"
            onClick={() => {
              const SpeechRecognition =
                // @ts-expect-error webkit
                window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SpeechRecognition) {
                alert("Voice search is not supported in this browser.");
                return;
              }
              const recognition = new SpeechRecognition();
              recognition.lang = "en-IN";
              recognition.onresult = (event: {
                results: { [key: number]: { [key: number]: { transcript: string } } };
              }) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                submit(transcript);
              };
              recognition.start();
            }}
          >
            <Mic className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-lg p-2 text-brand-muted hover:bg-black/5"
            aria-label="Scan barcode (coming soon)"
            title="Barcode scanner — coming soon"
          >
            <ScanLine className="h-4 w-4" />
          </button>
        </div>
      </form>

      {recent.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-muted">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Recently Searched
          </p>
          <div className="flex flex-wrap gap-2">
            {recent.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => submit(term)}
                className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand-accent hover:text-brand-accent dark:border-white/10 dark:bg-brand-dark"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-muted">
          <TrendingUp className="h-3.5 w-3.5" aria-hidden />
          Trending Searches
        </p>
        <div className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((term) => (
            <Link
              key={term}
              href={`${ROUTES.search}?q=${encodeURIComponent(term)}`}
              onClick={() => add(term)}
              className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:border-brand-accent hover:text-brand-accent dark:border-white/10 dark:bg-brand-dark"
            >
              {term}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
