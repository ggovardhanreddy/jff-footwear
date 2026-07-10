"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import ShopHeroCarousel from "@/components/shop/ShopHeroCarousel";
import ProductRail, { EmptyContinueHint } from "@/components/shop/ProductRail";
import JffSpotlight from "@/components/shop/JffSpotlight";
import DiscountsForYou from "@/components/shop/DiscountsForYou";
import WidestCollection from "@/components/shop/WidestCollection";
import ProductCard from "@/components/products/ProductCard";
import { QuickViewModal } from "@/components/features";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import type { HeroSlide } from "@/components/shop/ShopHeroCarousel";
import type { Product } from "@/types";

type Props = {
  heroSlides: HeroSlide[];
  suggested: Product[];
  youMayLike: Product[];
  mustHave: Product[];
  newAdditions: Product[];
  topSelection: Product[];
  allProducts: Product[];
};

export default function ShopHomeClient({
  heroSlides,
  suggested,
  youMayLike,
  mustHave,
  newAdditions,
  topSelection,
  allProducts,
}: Props) {
  const { items: recentSlugs } = useRecentlyViewed();
  const { items: wishlist } = useWishlist();
  const { profile, user } = useAuth();
  const [quickView, setQuickView] = useState<Product | null>(null);

  const recentProducts = useMemo(() => {
    const map = new Map(allProducts.map((p) => [p.slug, p]));
    return recentSlugs
      .map((item) => map.get(item.slug))
      .filter((p): p is Product => Boolean(p))
      .slice(0, 10);
  }, [allProducts, recentSlugs]);

  const personalized = useMemo(() => {
    if (!wishlist.length) return suggested;
    const wishSet = new Set(wishlist.map((w) => w.slug));
    const wishProduct = allProducts.find((w) => wishSet.has(w.slug));
    const fromWishCats = wishProduct
      ? allProducts.filter(
          (p) =>
            (p.category === wishProduct.category || p.gender === wishProduct.gender) &&
            !wishSet.has(p.slug)
        )
      : [];
    return (fromWishCats.length ? fromWishCats : suggested).slice(0, 10);
  }, [allProducts, suggested, wishlist]);

  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || undefined;

  return (
    <div className="page-shell relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(200,169,110,0.12),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(37,99,235,0.06),transparent_45%)]" />

      <div className="container-custom space-y-16 pb-16 md:space-y-24 md:pb-24">
        <ShopHeroCarousel slides={heroSlides} />

        <section className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-black dark:text-white md:text-3xl">
                Still looking for these?
              </h2>
              <p className="mt-1.5 text-sm text-brand-muted md:text-base">
                Hi {displayName || "there"}, continue where you left off.
              </p>
            </div>
            <Link
              href={ROUTES.recentlyViewed}
              className="rounded-full border border-black/10 bg-white/70 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest backdrop-blur dark:border-white/15 dark:bg-white/5"
            >
              Continue Shopping
            </Link>
          </div>
          {recentProducts.length ? (
            <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:gap-6 md:px-0">
              {recentProducts.map((product, index) => (
                <div key={product.slug} className="w-[78vw] shrink-0 sm:w-[46vw] md:w-[280px]">
                  <ProductCard product={product} index={index} onQuickView={setQuickView} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyContinueHint name={displayName} />
          )}
        </section>

        <ProductRail
          title="Suggested For You"
          subtitle="Personalized from your browsing, wishlist, and what’s trending at JFF."
          products={personalized}
          href={ROUTES.products}
          onQuickView={setQuickView}
        />

        <JffSpotlight />

        <ProductRail
          title="You May Like"
          subtitle="Smooth picks matched to your taste — tap the heart to save."
          products={youMayLike}
          href={ROUTES.products}
          onQuickView={setQuickView}
        />

        <DiscountsForYou />

        <ProductRail
          title="Must Have Deals"
          subtitle="Best-selling JFF pairs with limited stock energy."
          products={mustHave}
          href={ROUTES.products}
          large
          onQuickView={setQuickView}
        />

        <ProductRail
          title="JFF New Additions"
          subtitle="Latest arrivals with a fresh reveal — shop what’s new."
          products={newAdditions}
          href={`${ROUTES.products}?new=1`}
          ctaLabel="New arrivals"
          onQuickView={setQuickView}
        />

        <WidestCollection />

        <ProductRail
          title="Top Selection"
          subtitle="Customer favorites and highest-purchased JFF styles today."
          products={topSelection}
          href={ROUTES.products}
          onQuickView={setQuickView}
        />

        <section className="overflow-hidden rounded-[2rem] border border-black/[0.06] bg-brand-black px-6 py-12 text-center text-white dark:border-white/10 md:px-12 md:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            Experience JFF
          </p>
          <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold md:text-4xl">
            Crafted comfort. Every step.
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/65">
            Install the JFF app experience as a PWA for faster shopping, extra coins, and early
            access to new collections — free on your home screen.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href={ROUTES.install}
              className="rounded-full bg-brand-accent px-7 py-3.5 text-sm font-semibold text-brand-black shadow-[0_0_28px_rgba(200,169,110,0.4)]"
            >
              Get the JFF App
            </Link>
            <Link
              href={ROUTES.brand}
              className="rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white"
            >
              Brand story
            </Link>
          </div>
        </section>
      </div>

      {quickView ? <QuickViewModal product={quickView} onClose={() => setQuickView(null)} /> : null}
    </div>
  );
}
