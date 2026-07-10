import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import AdminBannersClient from "./AdminBannersClient";

export const metadata: Metadata = createMetadata({
  title: "Admin Banners",
  path: "/admin/banners",
  index: false,
});

export default function AdminBannersPage() {
  return <AdminBannersClient />;
}
