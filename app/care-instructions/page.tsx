import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero, CareInstructionsGrid } from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Care Instructions",
  description:
    "How to care for your JFF Footwear slippers — cleaning, storage, and maintenance tips for lasting comfort and durability.",
  path: "/care-instructions",
});

export default function CareInstructionsPage() {
  return (
    <PageShell ambient="light">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Care Instructions", path: "/care-instructions" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Care Instructions", href: "/care-instructions" },
        ]}
      />

      <PageHero
        eyebrow="Product Care"
        title="Care Instructions"
        description="Simple steps to keep your slippers clean, comfortable, and in great condition for everyday wear."
        className="mb-14"
      />

      <ScrollReveal>
        <CareInstructionsGrid />
      </ScrollReveal>
    </PageShell>
  );
}
