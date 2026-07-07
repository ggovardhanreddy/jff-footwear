import FAQAccordion from "@/components/shared/FAQAccordion";
import SectionHeading from "@/components/ui/SectionHeading";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import { createMetadata } from "@/lib/seo";
import { faqs } from "@/data/content";

export const metadata = createMetadata({
  title: "FAQ",
  description:
    "Frequently asked questions about JFF Footwear products, ordering, shipping, and quality.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <PageShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ]}
      />
      <SectionHeading
        subtitle="Help Center"
        title="Frequently Asked Questions"
        description="Everything you need to know about our products and ordering process."
      />
      <FAQAccordion faqs={faqs} showHeading={false} />
    </PageShell>
  );
}
