"use client";

import LuxuryHero from "./LuxuryHero";
import ShopByMaterial from "./ShopByMaterial";
import ShopByGender from "./ShopByGender";
import WhyChooseJFF from "./WhyChooseJFF";
import ProductCategories from "./ProductCategories";
import Newsletter from "@/components/Newsletter";
import FAQAccordion from "@/components/shared/FAQAccordion";
import {
  ProductCarousel,
} from "@/components/features";
import InstagramFeedPlaceholder from "@/components/features/sections/InstagramFeedPlaceholder";
import SectionHeading from "@/components/ui/SectionHeading";
import ButtonLink from "@/components/ui/ButtonLink";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import { reviews, faqs, categories } from "@/data/content";
import { products } from "@/data";
import {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  getTrendingProducts,
} from "@/lib/product-sections";
import { ROUTES } from "@/lib/constants";
import type { Product } from "@/types";

interface PremiumHomeProps {
  heroProduct: Product;
}

export default function PremiumHome({ heroProduct }: PremiumHomeProps) {
  const reduced = useReducedMotion();

  const materialCounts = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.material] = (acc[p.material] ?? 0) + 1;
    return acc;
  }, {});

  const categoriesWithImages = categories.map((cat) => ({
    ...cat,
    productCount: products.filter((p) => p.category === cat.name).length,
  }));

  const galleryPreview = getFeaturedProducts(6);

  return (
    <>
      <LuxuryHero heroProduct={heroProduct} />

      <div className="bg-brand-cream">
        <section className="section-padding">
          <div className="container-custom">
            <ProductCarousel
              title="Featured Collections"
              subtitle="Curated"
              products={getFeaturedProducts(8)}
              viewAllHref={`${ROUTES.products}?featured=true`}
            />
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="container-custom space-y-16">
            <ProductCarousel
              title="New Arrivals"
              subtitle="Just In"
              products={getNewArrivals(8)}
              viewAllHref={`${ROUTES.products}?new=true`}
            />
            <ProductCarousel
              title="Best Sellers"
              subtitle="Customer Favorites"
              products={getBestSellers(8)}
            />
            <ProductCarousel
              title="Trending Now"
              subtitle="Popular"
              products={getTrendingProducts(8)}
            />
          </div>
        </section>

        <ProductCategories categories={categoriesWithImages} />
        <ShopByMaterial productCounts={materialCounts} />
        <ShopByGender />
        <WhyChooseJFF />

        <section className="section-padding bg-white">
          <div className="container-custom">
            <SectionHeading
              subtitle="Testimonials"
              title="Customer Reviews"
              description="Trusted by customers across India and worldwide."
            />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 6).map((review, index) => (
                <motion.blockquote
                  key={review.id}
                  initial={reduced ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-[24px] border border-black/[0.06] bg-brand-cream/50 p-6"
                >
                  <div className="flex gap-1 text-brand-accent" aria-hidden>
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-brand-muted">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <footer className="mt-4 border-t border-black/[0.06] pt-4">
                    <cite className="not-italic">
                      <span className="font-semibold text-brand-black">
                        {review.name}
                      </span>
                      <span className="text-brand-muted"> · {review.location}</span>
                    </cite>
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-custom">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <SectionHeading
                subtitle="Visual Showcase"
                title="Gallery"
                description="Explore our premium slipper collection."
                className="mb-0 text-left"
                align="left"
              />
              <ButtonLink href={ROUTES.gallery} variant="outline">
                View Gallery
              </ButtonLink>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
              {galleryPreview.map((product) => (
                <Link
                  key={product.id}
                  href={ROUTES.product(product.slug)}
                  className="focus-ring group relative aspect-square overflow-hidden rounded-2xl"
                >
                  <AssetImage
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-brand-light">
          <div className="container-custom max-w-3xl">
            <SectionHeading
              subtitle="Questions"
              title="Frequently Asked"
              description="Everything you need to know about ordering JFF slippers."
            />
            <FAQAccordion faqs={faqs.slice(0, 6)} showHeading={false} />
            <p className="mt-8 text-center">
              <Link
                href={ROUTES.faq}
                className="focus-ring text-sm font-semibold text-brand-accent hover:underline"
              >
                View all FAQs →
              </Link>
            </p>
          </div>
        </section>

        <Newsletter />

        <section className="section-padding border-t border-black/[0.06] bg-white">
          <div className="container-custom">
            <InstagramFeedPlaceholder />
          </div>
        </section>
      </div>
    </>
  );
}
