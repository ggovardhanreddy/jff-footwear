import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import AdminCouponsClient from "./AdminCouponsClient";

export const metadata: Metadata = createMetadata({
  title: "Admin Coupons",
  path: "/admin/coupons",
  index: false,
});

export default function AdminCouponsPage() {
  return <AdminCouponsClient />;
}
