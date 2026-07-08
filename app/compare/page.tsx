import { createMetadata } from "@/lib/seo";
import ComparePageClient from "./ComparePageClient";

export const metadata = createMetadata({
  title: "Compare Products",
  description: "Compare JFF slippers side by side — category, material, color, sizes, and price.",
  path: "/compare",
});

export default function ComparePage() {
  return <ComparePageClient />;
}
