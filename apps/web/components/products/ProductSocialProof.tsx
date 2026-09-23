"use client";

import { Star } from "lucide-react";
import {
  formatRating,
  formatRatingCount,
  formatWishlistCount,
  hasDisplayableProof,
} from "@jff/utils";
import { useProductSocialProof, useSocialProofDemo } from "@/context/SocialProofContext";
import type { ProductSocialProof } from "@/types";

export function ProductSocialProofLines({
  slug,
  variant = "card",
}: {
  slug: string;
  variant?: "card" | "detail";
}) {
  const proof = useProductSocialProof(slug);
  const allowDemo = useSocialProofDemo();
  if (!hasDisplayableProof(proof, allowDemo) || !proof) return null;
  return <SocialProofLines proof={proof} variant={variant} />;
}

export function SocialProofLines({
  proof,
  variant = "card",
}: {
  proof: ProductSocialProof;
  variant?: "card" | "detail";
}) {
  const hasRating = proof.ratingCount > 0 && proof.ratingAverage != null;
  const rating = hasRating ? formatRating(proof.ratingAverage as number) : "";
  const compact = variant === "card";

  return (
    <div className={compact ? "space-y-0.5 text-xs" : "space-y-1 text-sm"}>
      {proof.source === "demo" ? (
        <p className="font-semibold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
          Sample data
        </p>
      ) : null}
      {hasRating ? (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-brand-black dark:text-[#f4f0ea]">
          <span className="inline-flex items-center gap-1 font-semibold">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-hidden />
            <span>{rating}</span>
          </span>
          <span className="text-brand-muted">
            {formatRatingCount(proof.ratingCount)} rating{proof.ratingCount === 1 ? "" : "s"}
          </span>
        </p>
      ) : null}
      {proof.wishlistCount > 0 ? (
        <p className="text-brand-muted">
          <span aria-hidden>❤️ </span>
          {compact
            ? `${formatWishlistCount(proof.wishlistCount)} wishlisted`
            : `${formatWishlistCount(proof.wishlistCount)} people added to wishlist`}
        </p>
      ) : null}
    </div>
  );
}
