import { createMetadata } from "@/lib/seo";
import CheckoutPageClient from "./CheckoutPageClient";

export const metadata = createMetadata({
  title: "Checkout",
  description:
    "Complete your JFF Footwear order — enter delivery address and proceed via WhatsApp.",
  path: "/checkout",
  index: false,
});

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
