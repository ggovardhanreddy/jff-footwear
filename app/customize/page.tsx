import { createMetadata } from "@/lib/seo";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import ProductCustomizerWizard from "@/components/customizer/ProductCustomizerWizard";
import BulkDiscountCalculator from "@/components/features/business/BulkDiscountCalculator";

export const metadata = createMetadata({
  title: "Customize Your Slippers",
  description:
    "Design your perfect JFF slippers — choose category, material, color, size, branding, and packaging. Order via WhatsApp.",
  path: "/customize",
});

export default function CustomizePage() {
  return (
    <PageShell ambient="cream" fullWidth>
      <div className="container-custom pt-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Customize", href: "/customize" },
          ]}
        />
        <PageHeader
          eyebrow="Bespoke Footwear"
          title="Customize Your Slippers"
          description="Configure every detail — from material and sole to branding and packaging. Place your order on WhatsApp."
          className="mb-0"
        />
      </div>
      <ProductCustomizerWizard />
      <div className="container-custom pb-16">
        <div className="mx-auto max-w-md">
          <BulkDiscountCalculator />
        </div>
      </div>
    </PageShell>
  );
}
