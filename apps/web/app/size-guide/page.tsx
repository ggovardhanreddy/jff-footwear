import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero, SizeGuide } from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Size Guide",
  description:
    "Find your perfect JFF Footwear slipper size. Size charts for men, women, and kids with foot measurement instructions.",
  path: "/size-guide",
});

export default function SizeGuidePage() {
  return (
    <PageShell ambient="cream">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Size Guide", path: "/size-guide" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Size Guide", href: "/size-guide" },
        ]}
      />

      <PageHero
        eyebrow="Fit & Comfort"
        title="Size Guide"
        description="Measure your foot, compare with our charts, and choose the size that fits best for everyday comfort."
        className="mb-14"
      />

      <ScrollReveal>
        <SizeGuide />
      </ScrollReveal>
    </PageShell>
  );
}
