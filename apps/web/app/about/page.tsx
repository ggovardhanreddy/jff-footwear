import AssetImage from "@/components/ui/AssetImage";
import Link from "next/link";
import { Users, Factory, MapPin, Target, Eye, Calendar, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import JsonLd from "@/components/seo/JsonLd";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import PageShell from "@/components/ui/PageShell";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { COMPANY, STATS, ROUTES } from "@/lib/constants";
import { breadcrumbTrail } from "@/lib/breadcrumbs";
import { ABOUT_US, MISSION, VISION } from "@/data/company";
import AboutPageEnhancements from "@/components/features/sections/AboutPageEnhancements";
import { QualityCommitment, BusinessPagesGrid } from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Breadcrumb from "@/components/Breadcrumb";
import { toBreadcrumbItems } from "@/lib/breadcrumbs";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "Founded in January 2021, JFF Footwear is an Indian slipper manufacturer based in Rayachoty, Andhra Pradesh — crafting comfortable footwear for men, women, kids, and unisex collections.",
  path: "/about",
});

const statIcons = [Calendar, Users, Factory, MapPin] as const;

export default function AboutPage() {
  const crumbs = breadcrumbTrail({ name: "About Us", path: ROUTES.about });

  return (
    <PageShell ambient="light" fullWidth>
      <JsonLd data={createBreadcrumbJsonLd(crumbs)} />
      <section className="relative flex min-h-[50vh] items-center overflow-hidden bg-brand-black">
        <AssetImage
          src="/images/hero-banner.svg"
          alt="JFF Footwear"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 to-brand-black/50" />
        <AnimatedBackground variant="dark" />
        <div className="container-custom relative z-10 section-padding">
          <Breadcrumb items={toBreadcrumbItems(crumbs)} />
          <p className="eyebrow">About Us</p>
          <h1 className="heading-display mt-4 max-w-3xl text-white">
            Premium Footwear, Made in India
          </h1>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <SectionHeading
                subtitle="Who We Are"
                title="JFF Footwear"
                align="left"
                className="mb-8"
              />
              <div className="content-prose space-y-4 text-body">
                {ABOUT_US.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
              <AssetImage
                src="/images/hero-banner.svg"
                alt="JFF Footwear"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Target className="h-8 w-8 text-brand-accent" />
              <h2 className="mt-4 font-display text-2xl font-bold">Our Mission</h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted">
                {MISSION}
              </p>
            </div>
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <Eye className="h-8 w-8 text-brand-accent" />
              <h2 className="mt-4 font-display text-2xl font-bold">Our Vision</h2>
              <p className="mt-4 text-sm leading-relaxed text-brand-muted">
                {VISION}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-black text-white">
        <div className="container-custom">
          <SectionHeading
            subtitle="At a Glance"
            title="JFF by the Numbers"
            className="mb-12 [&_h2]:text-white [&_p]:text-gray-400"
          />
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STATS.map((stat, index) => {
              const Icon = statIcons[index] ?? Factory;
              return (
                <div key={stat.label} className="text-center">
                  <Icon className="mx-auto mb-4 h-8 w-8 text-brand-accent" />
                  <p className="font-display text-3xl font-bold md:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
                  {"sublabel" in stat && stat.sublabel ? (
                    <p className="text-xs text-gray-500">{stat.sublabel}</p>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <SectionHeading
            subtitle="What We Make"
            title="Footwear for Everyone"
            description={`${COMPANY.fullName} manufactures slippers for men, women, kids, and unisex collections.`}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["Men", "Women", "Kids", "Unisex"].map((audience) => (
              <div
                key={audience}
                className="rounded-2xl border border-gray-100 p-6 text-center"
              >
                <p className="font-display text-lg font-bold">{audience}</p>
                <p className="mt-2 text-sm text-brand-muted">
                  Comfortable, durable styles for everyday wear.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <ScrollReveal>
            <QualityCommitment showHeading />
          </ScrollReveal>
          <div className="mt-8 text-center">
            <Link
              href={ROUTES.qualityCommitment}
              className="focus-ring inline-flex items-center gap-2 text-sm font-semibold text-brand-accent hover:underline"
            >
              Read our full quality commitment
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          <ScrollReveal>
            <BusinessPagesGrid excludeHref={ROUTES.about} compact />
          </ScrollReveal>
        </div>
      </section>

      <AboutPageEnhancements />
    </PageShell>
  );
}
