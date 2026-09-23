import type { CustomerReview, ProductSocialProof, ProductSocialProofApi } from "@jff/types";
import { socialProofFromApi } from "@jff/utils";
import { getSupabaseBrowserClient } from "./supabase";

export async function fetchSocialProofMap(): Promise<Record<string, ProductSocialProof>> {
  const client = getSupabaseBrowserClient();
  if (!client) return {};

  const { data, error } = await client.rpc("list_product_social_proof");
  if (error || !Array.isArray(data)) return {};

  const map: Record<string, ProductSocialProof> = {};
  for (const row of data as ProductSocialProofApi[]) {
    const proof = socialProofFromApi(row);
    if (proof && row.product_slug) map[row.product_slug] = proof;
  }
  return map;
}

export async function fetchProductReviews(slug: string): Promise<CustomerReview[]> {
  const client = getSupabaseBrowserClient();
  if (!client || !slug) return [];

  const { data, error } = await client.rpc("list_product_reviews", { slug });
  if (error || !Array.isArray(data)) return [];

  const reviews: CustomerReview[] = [];
  for (const row of data) {
    const record = row as {
      id: string;
      product_slug: string;
      author_name: string;
      rating: number;
      title: string | null;
      body: string | null;
      created_at: string;
      verified_purchase: boolean;
      helpful_count: number;
      image_url: string | null;
    };
    const body = record.body?.trim() ?? "";
    if (!body) continue;
    const review: CustomerReview = {
      id: record.id,
      productSlug: record.product_slug,
      authorName: record.author_name || "JFF customer",
      rating: record.rating,
      title: record.title?.trim() ?? "",
      body,
      createdAt: record.created_at,
      verifiedPurchase: Boolean(record.verified_purchase),
      helpfulCount: Number(record.helpful_count) || 0,
    };
    if (record.image_url) review.imageUrl = record.image_url;
    reviews.push(review);
  }
  return reviews;
}

export async function submitProductReview(input: {
  productSlug: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
}): Promise<{ error: string | null }> {
  const client = getSupabaseBrowserClient();
  if (!client) return { error: "Reviews are unavailable right now." };

  const rating = Math.round(input.rating);
  const body = input.body.trim();
  if (rating < 1 || rating > 5) return { error: "Choose a rating from 1 to 5." };
  if (body.length < 8) return { error: "Write a short review before submitting." };

  const { error } = await client.from("reviews").insert({
    product_slug: input.productSlug,
    user_id: input.userId,
    rating,
    title: input.title.trim() || null,
    body,
    approved: false,
  });

  return { error: error?.message ?? null };
}

export async function markReviewHelpful(
  reviewId: string
): Promise<{ count: number | null; error: string | null }> {
  const client = getSupabaseBrowserClient();
  if (!client) return { count: null, error: "Sign in to mark a review helpful." };

  const { data, error } = await client.rpc("mark_review_helpful", { review: reviewId });
  if (error) return { count: null, error: error.message };
  return { count: typeof data === "number" ? data : Number(data), error: null };
}
