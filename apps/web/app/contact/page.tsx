import JsonLd from "@/components/seo/JsonLd";
import { createMetadata, createLocalBusinessJsonLd, createBreadcrumbJsonLd } from "@/lib/seo";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with JFF Footwear for product inquiries, bulk orders, and wholesale partnerships.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          createLocalBusinessJsonLd(),
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Contact Us", path: "/contact" },
          ]),
        ]}
      />
      <ContactPageClient />
    </>
  );
}
