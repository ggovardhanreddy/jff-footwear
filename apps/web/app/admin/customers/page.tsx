import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import AdminCustomersClient from "./AdminCustomersClient";

export const metadata: Metadata = createMetadata({
  title: "Admin Customers",
  path: "/admin/customers",
  index: false,
});

export default function AdminCustomersPage() {
  return <AdminCustomersClient />;
}
