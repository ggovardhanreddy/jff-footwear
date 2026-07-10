import type { Metadata } from "next";
import { Suspense } from "react";
import { createMetadata } from "@/lib/seo";
import InstallPageClient from "./InstallPageClient";

export const metadata: Metadata = createMetadata({
  title: "Install JFF App",
  description:
    "Download the JFF Footwear app for iPhone or Android — or install the free web app on your home screen. We detect your device automatically.",
  path: "/install",
});

export default function InstallPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell">
          <div className="container-custom py-16 text-center text-sm text-brand-muted">
            Detecting your device…
          </div>
        </div>
      }
    >
      <InstallPageClient />
    </Suspense>
  );
}
