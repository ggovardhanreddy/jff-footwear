import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero, PageCta } from "@/components/site";
import {
  DistributorEnquiryForm,
  WholesalePricingPanel,
} from "@/components/business";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { COMPANY, ROUTES } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Distributor Enquiry",
  description:
    "Partner with JFF Footwear as a regional distributor. Volume pricing, MOQ support, and dedicated wholesale account management.",
  path: "/distributor",
});

export default function DistributorPage() {
  return (
    <PageShell ambient="light">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Distributor", path: "/distributor" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Distributor", href: "/distributor" },
        ]}
      />

      <PageHero
        eyebrow="Distribution Partners"
        title="Become a Distributor"
        description={`${COMPANY.fullName} works with established distributors across India. Apply below for territorial pricing, MOQ terms, and logistics support from our Rayachoty facility.`}
        className="mb-14"
      />

      <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
        <ScrollReveal variant="slideLeft">
          <WholesalePricingPanel />
        </ScrollReveal>
        <ScrollReveal variant="slideRight" delay={0.08}>
          <DistributorEnquiryForm />
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-16" delay={0.1}>
        <PageCta
          title="Prefer Wholesale Instead?"
          description="For smaller bulk orders (50+ pairs), explore our wholesale programme or request a custom quote."
          primaryLabel="Wholesale Programme"
          primaryHref={ROUTES.wholesale}
          whatsappMessage="Hello JFF, I would like to discuss distributor / wholesale partnership."
        />
      </ScrollReveal>
    </PageShell>
  );
}
