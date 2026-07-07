import FeaturesGrid from "@/components/shared/FeaturesGrid";
import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import { createMetadata } from "@/lib/seo";
import { features } from "@/data/content";

export const metadata = createMetadata({
  title: "Features",
  description:
    "Discover what makes JFF slippers exceptional — premium materials, ergonomic design, anti-slip soles, and more.",
  path: "/features",
});

export default function FeaturesPage() {
  return (
    <PageShell ambient="light">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Features", href: "/features" },
        ]}
      />
      <FeaturesGrid features={features} />
    </PageShell>
  );
}
