import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import {
  PageHero,
  WholesaleCardGrid,
  PageCta,
  QualityCommitment,
} from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { COMPANY, ROUTES } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Wholesale & Bulk Orders",
  description:
    "Bulk orders, retail supply, wholesale supply, dealer support, and distributor enquiries — partner with JFF Footwear in Rayachoty, Andhra Pradesh.",
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

      <ScrollReveal className="mt-16" delay={0.1}>
        <PageCta
          title="Request a Bulk Quote"
          description="Share your style, quantity, and delivery requirements. Our team will respond with competitive pricing and availability."
          primaryLabel="Request Bulk Quote"
          primaryHref={`${ROUTES.contact}?type=bulk`}
          whatsappLabel="WhatsApp Wholesale"
          whatsappMessage="Hello JFF, I would like a wholesale / bulk order quote."
        />
      </ScrollReveal>

      <ScrollReveal className="mt-24">
        <QualityCommitment showHeading />
      </ScrollReveal>
    </PageShell>
  );
}
