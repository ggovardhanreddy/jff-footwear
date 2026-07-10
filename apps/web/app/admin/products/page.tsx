import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import AdminProductsClient from "./AdminProductsClient";

export const metadata: Metadata = createMetadata({
  title: "Admin Products",
  path: "/admin/products",
  index: false,
});

export default function AdminProductsPage() {
  return <AdminProductsClient />;
}
