import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import AccountPageClient from "./AccountPageClient";

export const metadata: Metadata = createMetadata({
  title: "Account",
  description: "Manage your JFF orders, rewards, addresses, and preferences.",
  path: "/account",
});

export default function AccountPage() {
  return <AccountPageClient />;
}
