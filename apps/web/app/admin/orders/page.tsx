import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import AdminOrdersClient from "./AdminOrdersClient";

export const metadata: Metadata = createMetadata({
  title: "Admin Orders",
  path: "/admin/orders",
  index: false,
});

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
