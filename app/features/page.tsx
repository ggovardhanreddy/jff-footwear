import FeaturesGrid from "@/components/shared/FeaturesGrid";
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
    <div className="pt-20">
      <div className="container-custom section-padding">
        <FeaturesGrid features={features} />
      </div>
    </div>
  );
}
