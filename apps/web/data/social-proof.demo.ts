import type { CustomerReview, ProductSocialProof } from "@/types";
import { aggregateReviews } from "@jff/utils";

/**
 * SAMPLE DATA ONLY.
 * These reviews are not customer feedback and must never be shown as real ratings.
 * They load only when NEXT_PUBLIC_SOCIAL_PROOF_DEMO=true, and the UI labels them
 * "Sample data".
 */
const SAMPLE_REVIEWS: CustomerReview[] = [
  {
    id: "sample-review-1",
    productSlug: "jff-001",
    authorName: "Sample customer",
    rating: 4,
    title: "Sample review",
    body: "Sample text for layout preview. This is not a customer review.",
    createdAt: "2026-01-01T00:00:00.000Z",
    verifiedPurchase: true,
    helpfulCount: 3,
  },
  {
    id: "sample-review-2",
    productSlug: "jff-001",
    authorName: "Sample customer",
    rating: 5,
    title: "Sample review",
    body: "Another sample sentence used only to preview the rating bars.",
    createdAt: "2026-01-02T00:00:00.000Z",
    verifiedPurchase: false,
    helpfulCount: 1,
  },
];

export const DEMO_SOCIAL_PROOF: Record<string, ProductSocialProof> = {
  "jff-001": {
    ...aggregateReviews(SAMPLE_REVIEWS, 24, "demo"),
    source: "demo",
  },
};

export const DEMO_REVIEWS = SAMPLE_REVIEWS;
