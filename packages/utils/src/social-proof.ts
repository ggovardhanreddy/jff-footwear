import type {
  CustomerReview,
  ProductSocialProof,
  ProductSocialProofApi,
  ReviewDistribution,
} from "@jff/types";

const EMPTY_DISTRIBUTION: ReviewDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

export function emptyDistribution(): ReviewDistribution {
  return { ...EMPTY_DISTRIBUTION };
}

/** One decimal, taken from the stored average. Does not clamp into a 4.0–4.5 band. */
export function formatRating(value: number): string {
  if (!Number.isFinite(value)) return "";
  return (Math.round(value * 10) / 10).toFixed(1);
}

/** Rating counts stay exact until 10,000, then use a compact floor such as 10K+. */
export function formatRatingCount(value: number): string {
  const count = Math.max(0, Math.floor(value));
  if (count >= 10000) return `${Math.floor(count / 1000)}K+`;
  return new Intl.NumberFormat("en-IN").format(count);
}

/** Wishlist totals use a compact form from 1,000 upward, and never mean purchases. */
export function formatWishlistCount(value: number): string {
  const count = Math.max(0, Math.floor(value));
  if (count >= 10000) return `${Math.floor(count / 1000)}K+`;
  if (count >= 1000) {
    const compact = Math.round((count / 1000) * 10) / 10;
    return Number.isInteger(compact) ? `${compact.toFixed(0)}K` : compact.toFixed(1) + "K";
  }
  return new Intl.NumberFormat("en-IN").format(count);
}

export function hasDisplayableProof(
  proof: ProductSocialProof | null | undefined,
  allowDemo = false
): boolean {
  if (!proof) return false;
  if (proof.source === "demo" && !allowDemo) return false;
  const hasRating = proof.ratingCount > 0 && proof.ratingAverage != null;
  return hasRating || proof.wishlistCount > 0;
}

export function aggregateReviews(
  reviews: CustomerReview[],
  wishlistCount = 0,
  source: ProductSocialProof["source"] = "database"
): ProductSocialProof {
  const distribution = emptyDistribution();
  let ratingSum = 0;
  let reviewCount = 0;
  let verifiedReviewCount = 0;
  let helpfulReviewCount = 0;

  for (const review of reviews) {
    const star = Math.round(review.rating);
    if (star >= 1 && star <= 5) {
      distribution[star as 1 | 2 | 3 | 4 | 5] += 1;
      ratingSum += review.rating;
    }
    if (review.body.trim()) reviewCount += 1;
    if (review.verifiedPurchase) verifiedReviewCount += 1;
    helpfulReviewCount += Math.max(0, review.helpfulCount);
  }

  const ratingCount = reviews.length;
  return {
    ratingAverage: ratingCount > 0 ? Math.round((ratingSum / ratingCount) * 10) / 10 : null,
    ratingCount,
    reviewCount,
    wishlistCount: Math.max(0, Math.floor(wishlistCount)),
    reviewDistribution: distribution,
    verifiedReviewCount,
    helpfulReviewCount,
    source,
  };
}

export function socialProofFromApi(row: ProductSocialProofApi): ProductSocialProof | null {
  const distribution = {
    ...emptyDistribution(),
    ...row.review_distribution,
  };
  const proof: ProductSocialProof = {
    ratingAverage:
      row.rating_average == null || Number.isNaN(Number(row.rating_average))
        ? null
        : Math.round(Number(row.rating_average) * 10) / 10,
    ratingCount: Number(row.rating_count) || 0,
    reviewCount: Number(row.review_count) || 0,
    wishlistCount: Number(row.wishlist_count) || 0,
    reviewDistribution: distribution,
    verifiedReviewCount: Number(row.verified_review_count) || 0,
    helpfulReviewCount: Number(row.helpful_review_count) || 0,
    source: "database",
  };
  if (proof.ratingCount <= 0) proof.ratingAverage = null;
  if (!hasDisplayableProof(proof)) return null;
  return proof;
}
