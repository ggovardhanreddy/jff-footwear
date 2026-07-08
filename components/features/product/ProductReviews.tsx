"use client";

import { Star } from "lucide-react";
import { reviews } from "@/data/content";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductReviewsProps {
  product: Product;
  className?: string;
}

function matchReviews(product: Product) {
  return reviews.filter(
    (r) =>
      r.productName.toLowerCase().includes(product.name.split(" ")[0]?.toLowerCase() ?? "") ||
      r.productName.toLowerCase().includes(product.category.toLowerCase())
  );
}

export default function ProductReviews({
  product,
  className,
}: ProductReviewsProps) {
  const matched = matchReviews(product);
  const display = matched.length > 0 ? matched : reviews.slice(0, 3);
  const avg =
    display.reduce((s, r) => s + r.rating, 0) / display.length;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: display.filter((r) => r.rating === star).length,
    pct: (display.filter((r) => r.rating === star).length / display.length) * 100,
  }));

  return (
    <section className={cn("space-y-8", className)} aria-labelledby="reviews-heading">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand-accent">Customer Reviews</p>
          <h2 id="reviews-heading" className="heading-section mt-2">
            What Buyers Say
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-5 w-5",
                  i < Math.round(avg)
                    ? "fill-brand-accent text-brand-accent"
                    : "text-neutral-300"
                )}
                aria-hidden
              />
            ))}
          </div>
          <span className="font-display text-2xl font-bold">{avg.toFixed(1)}</span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-2 rounded-2xl border border-black/5 bg-white/60 p-5 dark:border-white/10 dark:bg-brand-dark">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted">
            Rating Distribution
          </p>
          {distribution.map(({ star, pct, count }) => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="w-8 font-medium">{star}★</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                <div
                  className="h-full rounded-full bg-brand-accent"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-6 text-right text-brand-muted">{count}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4 lg:col-span-2">
          {display.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-black/5 bg-white/60 p-5 dark:border-white/10 dark:bg-brand-dark"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/15 text-sm font-bold text-brand-accent">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-xs text-brand-muted">{review.location}</p>
                </div>
                <div className="ml-auto flex" aria-label={`${review.rating} stars`}>
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-brand-accent text-brand-accent" />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                {review.comment}
              </p>
              {/* Review images placeholder */}
              <div className="mt-3 flex gap-2" aria-hidden>
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-14 w-14 rounded-xl bg-neutral-100 dark:bg-neutral-800"
                  />
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
