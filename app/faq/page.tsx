import FAQAccordion from "@/components/shared/FAQAccordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import { createMetadata, createFaqJsonLd, createBreadcrumbJsonLd } from "@/lib/seo";
import { faqs } from "@/data/content";

export const metadata = createMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about JFF Footwear products, wholesale ordering, materials, sizing, and shipping.",
  path: "/faq",
});

export default function FAQPage() {
  const faqJsonLd = createFaqJsonLd(faqs);
  const breadcrumbLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ]}
      />
      <SectionHeading
        subtitle="Help Center"
        title="Frequently Asked Questions"
        titleAs="h1"
        description="Everything you need to know about our products and ordering process."
      />
      <FAQAccordion faqs={faqs} showHeading={false} />
    </PageShell>
  );
}
