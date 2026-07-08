import { createMetadata } from "@/lib/seo";
import TermsLayout from "@/components/site/TermsLayout";
import JsonLd from "@/components/seo/JsonLd";
import { createBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Terms & Conditions",
  description:
    "Terms and Conditions for using the JFF Footwear website and ordering services.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Terms & Conditions", path: "/terms" },
        ])}
      />
      <TermsLayout
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Terms & Conditions", href: "/terms" },
        ]}
      />
    </>
  );
}
