import Link from "next/link";
import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero, WholesaleCardGrid, PageCta, QualityCommitment } from "@/components/site";
import { BulkQuoteForm, CatalogDownloadCard, WholesalePricingPanel } from "@/components/business";
import { ScrollStory } from "@/components/motion";
import BulkDiscountCalculator from "@/components/features/business/BulkDiscountCalculator";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { AnimatedBorder, StaggeredGrid, type StaggeredGridItem } from "@/components/premium";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { COMPANY, ROUTES, WHATSAPP_NUMBER } from "@/lib/constants";
import { MOQ_BY_ORDER_TYPE } from "@jff/config/wholesale-config";
import { products } from "@/data";

export const metadata = createMetadata({
  title: "Wholesale & Bulk Orders",
  description:
    "Bulk orders, wholesale pricing, MOQ tiers, dealer support, and distributor enquiries — partner with JFF Footwear in Rayachoty, Andhra Pradesh.",
  path: "/wholesale",
});

const MOQ_TILES: StaggeredGridItem[] = [
  {
    id: "retail",
    title: `Retail · ${MOQ_BY_ORDER_TYPE.Retail}+`,
    subtitle: "Starter packs for shops",
    href: ROUTES.dealer,
    tone: "from-zinc-900 to-zinc-700",
  },
  {
    id: "wholesale",
    title: `Wholesale · ${MOQ_BY_ORDER_TYPE.Wholesale}+`,
    subtitle: "Dealer pricing tiers",
    href: "#quote",
    tone: "from-[#1a1612] to-[#c8a96e]",
  },
  {
    id: "distributor",
    title: `Distributor · ${MOQ_BY_ORDER_TYPE.Distributor}+`,
    subtitle: "Territory programmes",
    href: ROUTES.distributor,
    tone: "from-stone-900 to-amber-900/80",
  },
  {
    id: "export",
    title: `Export · ${MOQ_BY_ORDER_TYPE.Export}+`,
    subtitle: "International MOQ",
    href: ROUTES.oem,
    tone: "from-black to-zinc-800",
  },
  {
    id: "dealer",
    title: "Dealer Registration",
    subtitle: "Apply to sell JFF",
    href: ROUTES.dealer,
    tone: "from-neutral-900 to-neutral-600",
  },
  {
    id: "sales",
    title: "Contact Sales",
    subtitle: "WhatsApp · phone · email",
    href: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello JFF, I need wholesale pricing and MOQ details.")}`,
    tone: "from-[#0c0c0c] to-[#3d3428]",
  },
];

export default function WholesalePage() {
  return (
    <PageShell ambient="light">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Wholesale", path: "/wholesale" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Wholesale", href: "/wholesale" },
        ]}
      />

      <PageHero
        eyebrow="Business Partners"
        title="Wholesale & Bulk Orders"
        description={`${COMPANY.fullName} supplies retailers, dealers, and distributors across India with comfortable, durable slippers manufactured in Rayachoty, Andhra Pradesh.`}
        className="mb-10"
      />

      <div className="mb-10 flex flex-wrap gap-3">
        <Link
          href={ROUTES.dealer}
          className="rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-black"
        >
          Dealer Registration
        </Link>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello JFF, contact sales for bulk order.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-black/10 bg-white/80 px-6 py-3 text-sm font-semibold backdrop-blur dark:border-white/15"
        >
          Contact Sales
        </a>
        <Link
          href={ROUTES.catalog}
          className="rounded-full border border-black/10 px-6 py-3 text-sm font-semibold dark:border-white/15"
        >
          Download Catalogue
        </Link>
      </div>

      <section className="mb-16 space-y-4">
        <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
          MOQ & partner paths
        </h2>
        <p className="max-w-2xl text-sm text-brand-muted md:text-base">
          Clear minimums for retail, wholesale, distributor, and export — plus dealer registration
          and direct sales contact.
        </p>
        <StaggeredGrid items={MOQ_TILES} />
      </section>

      <ScrollReveal>
        <WholesaleCardGrid />
      </ScrollReveal>

      <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-start">
        <ScrollReveal variant="slideLeft" delay={0.05}>
          <AnimatedBorder contentClassName="p-6">
            <WholesalePricingPanel />
          </AnimatedBorder>
        </ScrollReveal>
        <ScrollReveal variant="slideRight" delay={0.08}>
          <BulkDiscountCalculator />
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-16" delay={0.1}>
        <CatalogDownloadCard productCount={products.length} />
      </ScrollReveal>

      <ScrollReveal className="mt-16" delay={0.12}>
        <div id="quote" className="mx-auto max-w-3xl scroll-mt-28">
          <BulkQuoteForm />
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-16" delay={0.14}>
        <PageCta
          title="Distributor or OEM?"
          description="For territorial distribution (200+ MOQ) or private label manufacturing, explore our dedicated programmes."
          primaryLabel="Distributor Programme"
          primaryHref={ROUTES.distributor}
          secondaryLabel="OEM / Private Label"
          secondaryHref={ROUTES.oem}
          whatsappMessage="Hello JFF, I would like a wholesale / bulk order quote."
        />
      </ScrollReveal>

      <ScrollReveal className="mt-24">
        <ScrollStory>
          <QualityCommitment showHeading />
        </ScrollStory>
      </ScrollReveal>
    </PageShell>
  );
}
