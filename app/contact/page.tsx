import { createMetadata } from "@/lib/seo";
import ContactPageClient from "@/components/contact/ContactPageClient";

export const metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with JFF Footwear for product inquiries, bulk orders, and wholesale partnerships.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageClient />;
}
