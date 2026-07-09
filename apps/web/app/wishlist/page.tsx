import type { Metadata } from "next";
import WishlistPageClient from "./WishlistPageClient";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Wishlist",
  description: "Your saved JFF footwear — shop your favourites anytime.",
  path: "/wishlist",
  index: false,
});

export default function WishlistPage() {
  return <WishlistPageClient />;
}
