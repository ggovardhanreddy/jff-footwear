"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import ButtonLink from "@/components/ui/ButtonLink";
import AssetImage from "@/components/ui/AssetImage";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import { useWishlist } from "@/context/WishlistContext";
import { formatINR } from "@/lib/pricing";
import { ROUTES } from "@/lib/constants";

export default function WishlistPageClient() {
  const { items, remove, clear } = useWishlist();

  return (
    <PageShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wishlist", href: "/wishlist" },
        ]}
      />

      <PageHeader
        eyebrow="Save for Later"
        title="Wishlist"
        description={
          items.length === 0
            ? undefined
            : `${items.length} ${items.length === 1 ? "item" : "items"} saved`
        }
        actions={
          items.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="focus-ring text-sm font-semibold text-red-600 hover:underline"
            >
              Clear all
            </button>
          ) : undefined
        }
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any product to save it for later."
          actionLabel="Explore Products"
          actionHref={ROUTES.products}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex gap-4 rounded-[24px] border border-black/[0.06] bg-white/80 p-4 shadow-soft backdrop-blur-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-premium dark:border-white/10 dark:bg-brand-dark"
            >
              <Link
                href={ROUTES.product(item.slug)}
                className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100"
              >
                <AssetImage
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </Link>
              <div className="min-w-0 flex-1">
                <Link
                  href={ROUTES.product(item.slug)}
                  className="line-clamp-2 font-semibold hover:text-brand-accent"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-bold">
                  {formatINR(item.pricing.sellingPrice)}
                </p>
                <div className="mt-3 flex gap-2">
                  <ButtonLink
                    href={ROUTES.product(item.slug)}
                    size="sm"
                    variant="outline"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    View
                  </ButtonLink>
                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  );
}
