import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero, DealerForm } from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { COMPANY } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Become a Dealer",
  description:
    "Register as a JFF Footwear dealer. Partner with an Indian slipper manufacturer based in Rayachoty, Andhra Pradesh.",
  path: "/dealer",
});

export default function DealerPage() {
  return (
    <PageShell ambient="light">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Become a Dealer", path: "/dealer" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Become a Dealer", href: "/dealer" },
        ]}
      />

      <PageHero
        eyebrow="Dealer Programme"
        title="Become a Dealer"
        description={`Partner with ${COMPANY.fullName} to supply comfortable, durable slippers to your customers. Complete the form below and our team will review your application.`}
        className="mb-14"
      />

      <div className="mx-auto max-w-3xl">
        <ScrollReveal>
          <DealerForm />
        </ScrollReveal>
      </div>
    </PageShell>
  );
}
