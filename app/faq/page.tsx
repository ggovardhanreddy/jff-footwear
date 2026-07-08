import FAQAccordion from "@/components/shared/FAQAccordion";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import { PageHero } from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createFaqJsonLd, createBreadcrumbJsonLd } from "@/lib/seo";
import { faqs } from "@/data/content";
import JsonLd from "@/components/seo/JsonLd";

export const metadata = createMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about JFF Footwear — products, wholesale, delivery, COD, customization, and support.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <PageShell ambient="light">
      <JsonLd data={createFaqJsonLd(faqs)} />
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ]}
      />

      <PageHero
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        description="Answers about our slippers, wholesale programme, delivery, payments, and customer support."
        className="mb-14"
      />

      <ScrollReveal>
        <FAQAccordion faqs={faqs} showHeading={false} />
      </ScrollReveal>
    </PageShell>
  );
}
