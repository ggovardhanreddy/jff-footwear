import type { Metadata } from "next";
import { Suspense } from "react";
import { createMetadata } from "@/lib/seo";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = createMetadata({
  title: "Sign in",
  description: "Sign in to your JFF account for orders, rewards, and wishlist sync.",
  path: "/login",
});

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell container-custom py-16">
          <div className="mx-auto h-64 max-w-md animate-pulse rounded-[2rem] bg-black/5 dark:bg-white/5" />
        </div>
      }
    >
      <LoginPageClient />
    </Suspense>
  );
}
