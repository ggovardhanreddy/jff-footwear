import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import OrdersPageClient from "./OrdersPageClient";

export const metadata: Metadata = createMetadata({
  title: "Orders",
  description: "Track your JFF order history and status.",
  path: "/account/orders",
});

export default function OrdersPage() {
  return <OrdersPageClient />;
}
