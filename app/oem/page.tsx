import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero, OEMCardGrid, PageCta } from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { ROUTES } from "@/lib/constants";
import { OEM_INTRO } from "@/data/pages";

export const metadata = createMetadata({
  title: "Private Label & OEM Manufacturing",
  description:
    "JFF Footwear offers private label and OEM manufacturing — custom branding, logo printing, packaging, and bulk production for your brand.",
  path: "/oem",
});

export default function OEMPage() {
  return (
    <PageShell ambient="cream">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "OEM / Private Label", path: "/oem" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "OEM / Private Label", href: "/oem" },
        ]}
      />

      <PageHero
        eyebrow="Manufacturing Partners"
        title="Private Label & OEM"
        description={OEM_INTRO}
        className="mb-14"
      />

      <ScrollReveal>
        <OEMCardGrid />
      </ScrollReveal>

      <ScrollReveal className="mt-16" delay={0.1}>
        <PageCta
          title="Start Your Private Label Programme"
          description="Tell us about your brand, target quantities, and customization needs. We will guide you through samples, production, and fulfilment."
          primaryLabel="Request OEM Quote"
          primaryHref={`${ROUTES.contact}?type=private-label`}
          whatsappMessage="Hello JFF, I am interested in private label / OEM manufacturing."
        />
      </ScrollReveal>
    </PageShell>
  );
}
