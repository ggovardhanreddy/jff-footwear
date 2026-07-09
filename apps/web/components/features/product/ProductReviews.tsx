"use client";

import { MessageCircle, Shield, Star } from "lucide-react";
import { reviews } from "@/data/content";
import { COMPANY_STATS } from "@/data/company";
import type { Product } from "@/types";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProductReviewsProps {
  product: Product;
  className?: string;
}

function matchReviews(product: Product) {
  return reviews.filter(
    (r) =>
      r.productName
        .toLowerCase()
        .includes(product.name.split(" ")[0]?.toLowerCase() ?? "") ||
      r.productName.toLowerCase().includes(product.category.toLowerCase())
  );
}

export default function ProductReviews({
  product,
  className,
}: ProductReviewsProps) {
  const matched = matchReviews(product);
  const display = matched.length > 0 ? matched : reviews;
  const hasReviews = display.length > 0;
  const avg = hasReviews
    ? display.reduce((s, r) => s + r.rating, 0) / display.length
    : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: display.filter((r) => r.rating === star).length,
    pct: hasReviews
      ? (display.filter((r) => r.rating === star).length / display.length) * 100
      : 0,
  }));

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi JFF, I'd like to share feedback about ${product.name}.`
  )}`;

  return (
    <section
      className={cn("space-y-8", className)}
      aria-labelledby="reviews-heading"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand-accent">Customer Reviews</p>
          <h2 id="reviews-heading" className="heading-section mt-2">
            {hasReviews ? "What Buyers Say" : "Product Quality"}
          </h2>
        </div>
        {hasReviews && (
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
            <span className="font-display text-2xl font-bold">
              {avg.toFixed(1)}
            </span>
          </div>
        )}
      </div>

      {!hasReviews ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-surface rounded-2xl p-6 dark:glass-card">
            <div className="flex items-start gap-3">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue dark:text-brand-blue-dark" />
              <div>
                <p className="font-semibold text-brand-black dark:text-white">
                  Verified manufacturing quality
                </p>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  JFF Footwear manufactures {product.category.toLowerCase()} slippers
                  in {product.material.toLowerCase()} at our Rayachoty facility. We
                  focus on comfort, durability, and consistent quality — not inflated
                  review scores.
                </p>
              </div>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {COMPANY_STATS.map((stat) => (
                <li
                  key={stat.label}
                  className="rounded-xl bg-brand-light/80 px-4 py-3 dark:bg-white/5"
                >
                  <p className="text-lg font-bold text-brand-black dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-brand-muted">{stat.label}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-surface flex flex-col justify-between rounded-2xl p-6 dark:glass-card">
            <div>
              <p className="font-semibold text-brand-black dark:text-white">
                Share your experience
              </p>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                Purchased this style? We welcome honest feedback on WhatsApp. Verified
                buyer reviews will be published here as they are collected.
              </p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp focus-ring mt-6 w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              Send Feedback on WhatsApp
            </a>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="card-surface space-y-2 rounded-2xl p-5 dark:glass-card">
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
                className="card-surface rounded-2xl p-5 dark:glass-card"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-accent/15 text-sm font-bold text-brand-accent">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-xs text-brand-muted">{review.location}</p>
                  </div>
                  <div
                    className="ml-auto flex"
                    aria-label={`${review.rating} stars`}
                  >
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-3.5 w-3.5 fill-brand-accent text-brand-accent"
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">
                  {review.comment}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
