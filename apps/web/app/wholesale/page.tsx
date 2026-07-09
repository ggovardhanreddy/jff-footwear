import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import {
  PageHero,
  WholesaleCardGrid,
  PageCta,
  QualityCommitment,
} from "@/components/site";
import {
  BulkQuoteForm,
  CatalogDownloadCard,
  WholesalePricingPanel,
} from "@/components/business";
import { ScrollStory } from "@/components/motion";
import BulkDiscountCalculator from "@/components/features/business/BulkDiscountCalculator";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { COMPANY, ROUTES } from "@/lib/constants";
import { products } from "@/data";

export const metadata = createMetadata({
  title: "Wholesale & Bulk Orders",
  description:
    "Bulk orders, wholesale pricing, MOQ tiers, dealer support, and distributor enquiries — partner with JFF Footwear in Rayachoty, Andhra Pradesh.",
  path: "/wholesale",
});

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
        className="mb-14"
      />

      <ScrollReveal>
        <WholesaleCardGrid />
      </ScrollReveal>

      <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-start">
        <ScrollReveal variant="slideLeft" delay={0.05}>
          <div className="rounded-[24px] border border-black/[0.06] bg-white/80 p-6 shadow-soft backdrop-blur-md dark:border-white/10 dark:glass-card">
            <WholesalePricingPanel />
          </div>
        </ScrollReveal>
        <ScrollReveal variant="slideRight" delay={0.08}>
          <BulkDiscountCalculator />
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-16" delay={0.1}>
        <CatalogDownloadCard productCount={products.length} />
      </ScrollReveal>

      <ScrollReveal className="mt-16" delay={0.12}>
        <div className="mx-auto max-w-3xl">
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
