"use client";

import { useState } from "react";
import Link from "next/link";
import { QuickViewModal } from "@/components/features";
import Newsletter from "@/components/Newsletter";
import ShoppingHero from "@/components/home/ShoppingHero";
import ProductShelf from "@/components/home/ProductShelf";
import ShopByStyle, { type StyleCard } from "@/components/home/ShopByStyle";
import WhyJff from "@/components/home/WhyJff";
import WholesaleBand from "@/components/home/WholesaleBand";
import ReviewsBand from "@/components/home/ReviewsBand";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { getProductMainImage } from "@/lib/utils";
import { formatINR } from "@/lib/pricing";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { ROUTES, COMPANY } from "@/lib/constants";
import type { Product } from "@/types";

type ShopHomeClientProps = {
  products: Product[];
};

const CATEGORY_LINKS = [
  { label: "Men", href: "/products?gender=Men" },
  { label: "Women", href: "/products?gender=Women" },
  { label: "Kids", href: "/products?gender=Kids" },
  { label: "New arrivals", href: "/products?new=1" },
  { label: "Best sellers", href: "/collections/best-sellers" },
  { label: "Offers", href: "/#offers" },
  { label: "Orthopedic", href: "/products?category=Orthopedic" },
  { label: "Memory foam", href: "/products?material=Memory Foam" },
  { label: "Bathroom", href: "/products?category=Bathroom" },
  { label: "Casual", href: "/products?category=Regular" },
  { label: "Daily wear", href: "/products?material=EVA" },
  { label: "Trending", href: "/collections/trending" },
] as const;

export default function ShopHomeClient({ products }: ShopHomeClientProps) {
  const [quickView, setQuickView] = useState<Product | null>(null);
  const { items: recent } = useRecentlyViewed();
  const withImages = products.filter((product) => product.images.length > 0);
  const pool = withImages.length ? withImages : products;
  const heroProduct = pool.find((product) => product.featured) ?? pool[0] ?? null;

  const newArrivals = products.filter((product) => product.newArrival).slice(0, 8);
  const bestSellers = (
    products.filter((product) => product.featured).length
      ? products.filter((product) => product.featured)
      : pool
  ).slice(0, 8);
  const trending = [...products]
    .sort((a, b) => score(b) - score(a))
    .filter(
      (product, index, list) => list.findIndex((item) => item.slug === product.slug) === index
    )
    .slice(0, 8);

  const viewed = recent
    .map((item) => products.find((product) => product.slug === item.slug))
    .filter((product): product is Product => Boolean(product));
  const recommended = viewed.length ? viewed.slice(0, 8) : bestSellers.slice(0, 4);

  const styles: StyleCard[] = [
    styleCard("Casual", "/products?category=Regular", products, (p) => p.category === "Regular"),
    styleCard("Daily Wear", "/products?material=EVA", products, (p) => p.material === "EVA"),
    styleCard(
      "Orthopedic",
      "/products?category=Orthopedic",
      products,
      (p) => p.category === "Orthopedic"
    ),
    styleCard(
      "Bathroom",
      "/products?category=Bathroom",
      products,
      (p) => p.category === "Bathroom"
    ),
    styleCard(
      "Memory Foam",
      "/products?material=Memory Foam",
      products,
      (p) => p.material === "Memory Foam"
    ),
    styleCard("Kids", "/products?gender=Kids", products, (p) => p.gender === "Kids"),
    styleCard("Trending", "/collections/trending", products, (p) => p.featured || p.newArrival),
    styleCard("New", "/products?new=1", products, (p) => p.newArrival),
  ];

  const dealProducts = bestSellers.slice(0, 4);

  return (
    <div className="overflow-x-clip pb-24">
      <nav
        aria-label="Shop by category"
        className="border-b border-black/[0.06] bg-[#f6f3ee] pt-20 dark:border-white/10 dark:bg-[#0c0b0a] lg:pt-32"
      >
        <div className="container-custom flex gap-2 overflow-x-auto py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.href + link.label}
              href={link.href}
              className="focus-ring inline-flex min-h-11 shrink-0 items-center rounded-full border border-black/10 bg-white px-4 text-xs font-semibold uppercase tracking-[0.12em] text-brand-black dark:border-white/15 dark:bg-[#1c1916] dark:text-[#f4f0ea]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <ShoppingHero
        product={heroProduct}
        image={heroProduct ? getProductMainImage(heroProduct) : ""}
      />

      <ProductShelf
        id="deals-heading"
        eyebrow="Catalogue price"
        title="Deals"
        description={`Listed at ${formatINR(PRICING_CONFIG.defaultProduct.sellingPrice)} (MRP ${formatINR(PRICING_CONFIG.defaultProduct.mrp)}). This is the current price, not a timed sale.`}
        href={ROUTES.products}
        cta="View all"
        products={dealProducts}
        onQuickView={setQuickView}
      />

      <section className="container-custom py-6" aria-labelledby="shop-category-heading">
        <h2
          id="shop-category-heading"
          className="font-display text-3xl font-semibold text-brand-black dark:text-[#f4f0ea]"
        >
          Shop by category
        </h2>
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Men", "/products?gender=Men"],
            ["Women", "/products?gender=Women"],
            ["Kids", "/products?gender=Kids"],
            ["All footwear", ROUTES.products],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="focus-ring flex min-h-[88px] items-end rounded-2xl border border-black/[0.06] bg-[#fffcf8] p-4 text-lg font-semibold dark:border-white/10 dark:bg-[#1c1916]"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      <ProductShelf
        id="new-heading"
        eyebrow="Just added"
        title="New arrivals"
        href="/products?new=1"
        cta="View all"
        products={newArrivals.length ? newArrivals : pool.slice(0, 8)}
        onQuickView={setQuickView}
      />
      <ProductShelf
        id="best-heading"
        eyebrow="Most stocked favorites"
        title="Best sellers"
        href="/collections/best-sellers"
        cta="View all"
        products={bestSellers}
        onQuickView={setQuickView}
      />
      <ProductShelf
        id="trending-heading"
        eyebrow="Browsing now"
        title="Trending products"
        description="Featured and new styles from the catalogue. This is not a live sales ranking."
        href="/collections/trending"
        cta="View all"
        products={trending}
        onQuickView={setQuickView}
      />
      <ProductShelf
        id="recommended-heading"
        eyebrow={recent.length ? "From your browsing" : "Popular styles"}
        title={recent.length ? "Recently viewed" : "Recommended for you"}
        description={
          recent.length
            ? "Pairs you opened on this device."
            : "Popular catalogue styles. Personal recommendations appear after you view products."
        }
        href={ROUTES.recentlyViewed}
        cta="View all"
        products={recommended}
        onQuickView={setQuickView}
      />

      <ShopByStyle styles={styles} />

      <section id="offers" className="container-custom scroll-mt-32 py-8 md:py-10">
        <h2 className="font-display text-3xl font-semibold text-brand-black dark:text-[#f4f0ea]">
          JFF offers
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-brand-muted">
          Only offers configured in checkout are listed here.
        </p>
        <ul className="mt-5 grid gap-3 md:grid-cols-3">
          <li className="rounded-2xl border border-black/[0.06] bg-[#fffcf8] p-5 dark:border-white/10 dark:bg-[#1c1916]">
            <p className="text-sm font-semibold">Catalogue price</p>
            <p className="mt-2 text-sm text-brand-muted">
              {formatINR(PRICING_CONFIG.defaultProduct.sellingPrice)} instead of MRP{" "}
              {formatINR(PRICING_CONFIG.defaultProduct.mrp)}.
            </p>
          </li>
          {Object.entries(PRICING_CONFIG.coupon.codes).map(([code, coupon]) => (
            <li
              key={code}
              className="rounded-2xl border border-black/[0.06] bg-[#fffcf8] p-5 dark:border-white/10 dark:bg-[#1c1916]"
            >
              <p className="text-sm font-semibold">{coupon.label}</p>
              <p className="mt-2 text-sm text-brand-muted">
                Apply code{" "}
                <span className="font-semibold text-brand-black dark:text-[#f4f0ea]">{code}</span>{" "}
                at checkout.
              </p>
            </li>
          ))}
          <li className="rounded-2xl border border-black/[0.06] bg-[#fffcf8] p-5 dark:border-white/10 dark:bg-[#1c1916]">
            <p className="text-sm font-semibold">Free delivery</p>
            <p className="mt-2 text-sm text-brand-muted">
              Orders of {formatINR(PRICING_CONFIG.fees.freeDeliveryThreshold)} or more. Otherwise
              delivery is {formatINR(PRICING_CONFIG.fees.deliveryCharge)}.
            </p>
          </li>
        </ul>
      </section>

      <WhyJff />
      <WholesaleBand />
      <ReviewsBand />

      <section className="container-custom py-8 md:py-10" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="font-display text-3xl font-semibold">
          Shopping with JFF
        </h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Payments", "UPI, cards, net banking, and cash on delivery at checkout."],
            [
              "Delivery",
              `${PRICING_CONFIG.estimatedDelivery.label} from ${COMPANY.locationShort}.`,
            ],
            ["Support", `${COMPANY.phone} and WhatsApp during ${COMPANY.businessHours}.`],
            ["Made here", `Footwear made in Rayachoty since ${COMPANY.foundedYear}.`],
          ].map(([title, copy]) => (
            <li
              key={title}
              className="rounded-2xl border border-black/[0.06] bg-white p-4 text-sm dark:border-white/10 dark:bg-[#1c1916]"
            >
              <p className="font-semibold">{title}</p>
              <p className="mt-1 text-brand-muted">{copy}</p>
            </li>
          ))}
        </ul>
      </section>

      <Newsletter />
      {quickView ? <QuickViewModal product={quickView} onClose={() => setQuickView(null)} /> : null}
    </div>
  );
}

function score(product: Product) {
  return (product.featured ? 2 : 0) + (product.newArrival ? 1 : 0);
}

function styleCard(
  name: string,
  href: string,
  products: Product[],
  match: (product: Product) => boolean
): StyleCard {
  const visual = products.find((product) => match(product) && product.images.length > 0);
  return {
    name,
    href,
    image: visual ? getProductMainImage(visual) : "/images/categories/regular.svg",
  };
}
