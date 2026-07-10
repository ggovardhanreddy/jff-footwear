import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import InstallPageClient from "./InstallPageClient";

export const metadata: Metadata = createMetadata({
  title: "Get the JFF App",
  description:
    "Install JFF as a free Progressive Web App for faster shopping and extra reward coins.",
  path: "/install",
});

export default function InstallPage() {
  return <InstallPageClient />;
}
