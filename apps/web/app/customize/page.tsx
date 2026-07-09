import { createMetadata } from "@/lib/seo";
import BusinessPageScaffold from "@/components/layout/BusinessPageScaffold";
import PageHeader from "@/components/ui/PageHeader";
import ProductCustomizerWizard from "@/components/customizer/ProductCustomizerWizard";
import { ROUTES } from "@/lib/constants";
import { breadcrumbTrail } from "@/lib/breadcrumbs";

export const metadata = createMetadata({
  title: "Customize Your Slippers",
  description:
    "Design your perfect JFF slippers — category, material, sole, strap, color, size, branding, packaging, and live pricing. Order via WhatsApp.",
  path: "/customize",
});

export default function CustomizePage() {
  return (
    <BusinessPageScaffold
      breadcrumb={breadcrumbTrail({ name: "Customize", path: ROUTES.customize })}
      ambient="cream"
      fullWidth
    >
      <div className="container-custom pt-8">
        <PageHeader
          eyebrow="Signature JFF Experience"
          title="Customize Your Slippers"
          description="Configure every detail with live preview and pricing — from material and sole to branding, packaging, and delivery. Place your order on WhatsApp."
          className="mb-0"
        />
      </div>
      <ProductCustomizerWizard />
    </BusinessPageScaffold>
  );
}
