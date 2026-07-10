import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import RewardsPageClient from "./RewardsPageClient";

export const metadata: Metadata = createMetadata({
  title: "JFF Coins Rewards",
  description: "View your JFF Coins balance, earn history, and membership level.",
  path: "/account/rewards",
});

export default function RewardsPage() {
  return <RewardsPageClient />;
}
