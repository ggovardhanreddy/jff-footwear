import { createMetadata } from "@/lib/seo";
import PrivacyLayout from "@/components/site/PrivacyLayout";
import JsonLd from "@/components/seo/JsonLd";
import { createBreadcrumbJsonLd } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Privacy Policy for JFF Footwear — how we collect, use, and protect your information.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Privacy Policy", path: "/privacy-policy" },
        ])}
      />
      <PrivacyLayout
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy", href: "/privacy-policy" },
        ]}
      />
    </>
  );
}
