import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Cart",
  description: "Review your JFF Footwear cart and proceed to checkout.",
  path: "/cart",
  index: false,
});

export { default } from "./CartPageClient";
