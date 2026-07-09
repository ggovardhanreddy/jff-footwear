import type { Metadata } from "next";
import RecentlyViewedPageClient from "./RecentlyViewedPageClient";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Recently Viewed",
  description: "Pick up where you left off — your recently viewed JFF footwear styles.",
  path: "/recently-viewed",
  index: false,
});

export default function RecentlyViewedPage() {
  return <RecentlyViewedPageClient />;
}
