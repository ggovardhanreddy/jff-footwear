"use client";

import Link from "next/link";
import { Clock, Trash2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { ROUTES } from "@/lib/constants";

export default function RecentlyViewedPageClient() {
  const { items, clear } = useRecentlyViewed();

  const viewed = items
    .map((item) => products.find((p) => p.slug === item.slug))
    .filter(Boolean);

  return (
    <PageShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Recently Viewed", href: ROUTES.recentlyViewed },
        ]}
      />
      <PageHeader
        eyebrow="Continue Browsing"
        title="Recently Viewed"
        description={
          items.length === 0
            ? undefined
            : `${items.length} ${items.length === 1 ? "product" : "products"} in your history`
        }
        actions={
          items.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="focus-ring inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:underline"
            >
              <Trash2 className="h-4 w-4" />
              Clear history
            </button>
          ) : undefined
        }
      />

      {viewed.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No recently viewed products"
          description="Products you view will appear here for quick access."
          actionLabel="Start Shopping"
          actionHref={ROUTES.products}
        />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {viewed.map((product, i) => (
            <li key={product!.id}>
              <ProductCard product={product!} index={i} />
            </li>
          ))}
        </ul>
      )}

      {viewed.length > 0 && (
        <p className="mt-10 text-center text-sm text-brand-muted">
          <Link href={ROUTES.products} className="font-semibold text-brand-blue hover:underline dark:text-brand-blue-dark">
            Browse all products →
          </Link>
        </p>
      )}
    </PageShell>
  );
}
