import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import AdminDashboardClient from "./AdminDashboardClient";

export const metadata: Metadata = createMetadata({
  title: "Admin",
  path: "/admin",
  index: false,
});

export default function AdminPage() {
  return <AdminDashboardClient />;
}
