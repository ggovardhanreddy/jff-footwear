import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import AddressesPageClient from "./AddressesPageClient";

export const metadata: Metadata = createMetadata({
  title: "Saved Addresses",
  path: "/account/addresses",
});

export default function AddressesPage() {
  return <AddressesPageClient />;
}
