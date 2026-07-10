import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import NotificationsPageClient from "./NotificationsPageClient";

export const metadata: Metadata = createMetadata({
  title: "Notifications",
  path: "/notifications",
});

export default function NotificationsPage() {
  return <NotificationsPageClient />;
}
