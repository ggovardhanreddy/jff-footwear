"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { fetchProductReviews, markReviewHelpful, submitProductReview } from "@jff/api/social-proof";
import { aggregateReviews, formatRating, formatRatingCount, hasDisplayableProof } from "@jff/utils";
import { useAuth } from "@/context/AuthContext";
import { useProductSocialProof, useSocialProofDemo } from "@/context/SocialProofContext";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CustomerReview, Product, ReviewDistribution } from "@/types";

interface ProductReviewsProps {
  product: Product;
  className?: string;
}

type SortMode = "recent" | "helpful";

export default function ProductReviews({ product, className }: ProductReviewsProps) {
  const { user } = useAuth();
  const stored = useProductSocialProof(product.slug);
  const allowDemo = useSocialProofDemo();
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [star, setStar] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>("recent");
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const rows = await fetchProductReviews(product.slug);
      if (cancelled) return;
      if (rows.length === 0 && allowDemo) {
        const demo = await import("@/data/social-proof.demo");
        setReviews(demo.DEMO_REVIEWS.filter((review) => review.productSlug === product.slug));
      } else {
        setReviews(rows);
      }
      setLoaded(true);
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [allowDemo, product.slug]);

  const proof = useMemo(() => {
    if (reviews.length > 0) {
      return aggregateReviews(
        reviews,
        stored?.wishlistCount ?? 0,
        reviews.some((review) => review.id.startsWith("sample-")) ? "demo" : "database"
      );
    }
    return stored;
  }, [reviews, stored]);

  const visible = useMemo(() => {
    const filtered = reviews.filter((review) => {
      if (star && Math.round(review.rating) !== star) return false;
      if (verifiedOnly && !review.verifiedPurchase) return false;
      return true;
    });
    return [...filtered].sort((a, b) => {
      if (sort === "helpful") return b.helpfulCount - a.helpfulCount;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [reviews, sort, star, verifiedOnly]);

  const showProof = hasDisplayableProof(proof, allowDemo) && proof;
  const distribution = proof?.reviewDistribution;

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setFormMessage("");
    const result = await submitProductReview({
      productSlug: product.slug,
      userId: user.id,
      rating,
      title,
      body,
    });
    setSubmitting(false);
    if (result.error) {
      setFormMessage(result.error);
      return;
    }
    setRating(0);
    setTitle("");
    setBody("");
    setFormMessage("Thanks. Your review will appear after it is checked.");
  };

  const onHelpful = async (reviewId: string) => {
    if (reviewId.startsWith("sample-")) return;
    const result = await markReviewHelpful(reviewId);
    if (result.count == null) return;
    setReviews((current) =>
      current.map((review) =>
        review.id === reviewId
          ? { ...review, helpfulCount: result.count ?? review.helpfulCount }
          : review
      )
    );
  };

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="reviews-heading">
      <div>
        <h2 id="reviews-heading" className="font-display text-2xl font-semibold md:text-3xl">
          Customer reviews
        </h2>
        {proof?.source === "demo" ? (
          <p className="mt-2 text-sm font-semibold text-amber-700 dark:text-amber-300">
            Sample data. These are not customer ratings.
          </p>
        ) : null}
      </div>

      {!loaded ? (
        <p className="text-sm text-brand-muted">Loading reviews…</p>
      ) : !showProof || !proof ? (
        <div className="rounded-2xl border border-black/[0.06] bg-[#fffcf8] p-5 dark:border-white/10 dark:bg-[#1c1916]">
          <p className="font-medium">No ratings yet</p>
          <p className="mt-2 text-sm text-brand-muted">
            Ratings and written reviews appear here after a purchase is reviewed and approved.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <div className="rounded-2xl border border-black/[0.06] p-4 dark:border-white/10">
            {proof.ratingAverage != null && proof.ratingCount > 0 ? (
              <>
                <p className="flex items-center gap-2 font-display text-3xl font-semibold">
                  <Star className="h-6 w-6 fill-amber-400 text-amber-500" aria-hidden />
                  {formatRating(proof.ratingAverage)}
                </p>
                <p className="mt-1 text-sm text-brand-muted">
                  {formatRating(proof.ratingAverage)} out of 5
                </p>
                <p className="text-sm text-brand-muted">
                  {formatRatingCount(proof.ratingCount)} rating{proof.ratingCount === 1 ? "" : "s"}
                </p>
                {proof.reviewCount > 0 ? (
                  <p className="text-sm text-brand-muted">
                    {formatRatingCount(proof.reviewCount)} written review
                    {proof.reviewCount === 1 ? "" : "s"}
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-brand-muted">No star rating yet</p>
            )}
            {distribution ? (
              <DistributionBars distribution={distribution} total={proof.ratingCount} />
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter reviews">
              <FilterChip
                active={star === null && !verifiedOnly}
                onClick={() => {
                  setStar(null);
                  setVerifiedOnly(false);
                }}
              >
                All
              </FilterChip>
              {[5, 4, 3, 2, 1].map((value) => (
                <FilterChip key={value} active={star === value} onClick={() => setStar(value)}>
                  {value}★
                </FilterChip>
              ))}
              <FilterChip
                active={verifiedOnly}
                onClick={() => setVerifiedOnly((current) => !current)}
              >
                Verified Purchase
              </FilterChip>
              <FilterChip active={sort === "recent"} onClick={() => setSort("recent")}>
                Most Recent
              </FilterChip>
              <FilterChip active={sort === "helpful"} onClick={() => setSort("helpful")}>
                Most Helpful
              </FilterChip>
            </div>

            {visible.length === 0 ? (
              <p className="text-sm text-brand-muted">No reviews match these filters.</p>
            ) : (
              <ul className="space-y-3">
                {visible.map((review) => (
                  <li
                    key={review.id}
                    className="rounded-2xl border border-black/[0.06] p-4 dark:border-white/10"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <StarRow rating={review.rating} />
                      {review.verifiedPurchase ? (
                        <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                          Verified Purchase
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-sm font-semibold">{review.authorName}</p>
                    <p className="text-xs text-brand-muted">
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    {review.title ? (
                      <p className="mt-2 text-sm font-medium">{review.title}</p>
                    ) : null}
                    <p className="mt-1 text-sm leading-relaxed text-brand-muted">{review.body}</p>
                    {review.imageUrl ? (
                      // Customer photos are remote URLs stored with the review.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.imageUrl}
                        alt=""
                        className="mt-3 h-24 w-24 rounded-lg object-cover"
                      />
                    ) : null}
                    <button
                      type="button"
                      onClick={() => void onHelpful(review.id)}
                      className="focus-ring mt-3 text-xs font-semibold text-brand-muted"
                    >
                      Helpful {review.helpfulCount}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-black/[0.06] p-4 dark:border-white/10">
        <h3 className="text-sm font-semibold">Write a review</h3>
        {user ? (
          <form onSubmit={(event) => void onSubmit(event)} className="mt-3 space-y-3">
            <div className="flex gap-1" role="group" aria-label="Your rating">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  className="focus-ring rounded p-1"
                  aria-label={`${value} star${value === 1 ? "" : "s"}`}
                  aria-pressed={rating === value}
                >
                  <Star
                    className={cn(
                      "h-5 w-5",
                      value <= rating ? "fill-amber-400 text-amber-500" : "text-neutral-300"
                    )}
                  />
                </button>
              ))}
            </div>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Title"
              className="input-field w-full"
              maxLength={80}
            />
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="How was this pair?"
              className="input-field min-h-24 w-full"
              maxLength={800}
              required
            />
            <button
              type="submit"
              disabled={submitting || rating < 1}
              className="focus-ring inline-flex min-h-11 items-center rounded-full bg-brand-black px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white disabled:opacity-50 dark:bg-[#f4f0ea] dark:text-[#161311]"
            >
              {submitting ? "Submitting…" : "Submit review"}
            </button>
            {formMessage ? <p className="text-sm text-brand-muted">{formMessage}</p> : null}
          </form>
        ) : (
          <p className="mt-2 text-sm text-brand-muted">
            <Link
              href={`${ROUTES.login}?next=${encodeURIComponent(`/products/${product.slug}`)}`}
              className="font-semibold underline"
            >
              Sign in
            </Link>{" "}
            to write a review. It is published after it is checked.
          </p>
        )}
      </div>
    </section>
  );
}

function DistributionBars({
  distribution,
  total,
}: {
  distribution: ReviewDistribution;
  total: number;
}) {
  return (
    <ul className="mt-4 space-y-1.5" aria-label="Rating distribution">
      {[5, 4, 3, 2, 1].map((value) => {
        const count = distribution[value as 1 | 2 | 3 | 4 | 5] ?? 0;
        const width = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <li key={value} className="flex items-center gap-2 text-xs">
            <span className="w-6">{value}★</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <span
                className="block h-full rounded-full bg-amber-400"
                style={{ width: `${width}%` }}
              />
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="inline-flex" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Star
          key={value}
          className={cn(
            "h-3.5 w-3.5",
            value <= Math.round(rating) ? "fill-amber-400 text-amber-500" : "text-neutral-300"
          )}
          aria-hidden
        />
      ))}
    </span>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "focus-ring inline-flex min-h-11 items-center rounded-full border px-3 text-xs font-semibold",
        active
          ? "border-brand-black bg-brand-black text-white dark:border-[#f4f0ea] dark:bg-[#f4f0ea] dark:text-[#161311]"
          : "border-black/10 dark:border-white/15"
      )}
    >
      {children}
    </button>
  );
}
