import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import {
  PageHero,
  QualityCommitment,
  BusinessPagesGrid,
  PageCta,
} from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { ROUTES } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Quality Commitment",
  description:
    "JFF Footwear quality standards — carefully selected materials, durable manufacturing, comfort-focused design, and inspection before dispatch.",
  path: "/quality-commitment",
});

export default function QualityCommitmentPage() {
  return (
    <PageShell ambient="light">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Quality Commitment", path: "/quality-commitment" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Quality Commitment", href: "/quality-commitment" },
        ]}
      />

      <PageHero
        eyebrow="Our Promise"
        title="Quality Commitment"
        description="Every pair from JFF Footwear reflects our dedication to comfort, durability, and consistent standards — from material selection to final inspection at our Rayachoty facility."
        className="mb-14"
      />

      <ScrollReveal>
        <QualityCommitment showHeading={false} />
      </ScrollReveal>

      <ScrollReveal className="mt-16" delay={0.08}>
        <PageCta
          title="Partner With a Manufacturer You Can Trust"
          description="Whether you are ordering for your store or exploring OEM manufacturing, our quality processes are built for long-term partnerships."
          primaryLabel="Wholesale Enquiry"
          primaryHref={ROUTES.wholesale}
          secondaryLabel="About JFF"
          secondaryHref={ROUTES.about}
          whatsappMessage="Hello JFF, I would like to know more about your quality standards and manufacturing."
        />
      </ScrollReveal>

      <ScrollReveal className="mt-20">
        <BusinessPagesGrid excludeHref={ROUTES.qualityCommitment} compact />
      </ScrollReveal>
    </PageShell>
  );
}
