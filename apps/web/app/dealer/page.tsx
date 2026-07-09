import BusinessPageScaffold from "@/components/layout/BusinessPageScaffold";
import { PageHero, DealerForm } from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata } from "@/lib/seo";
import { COMPANY, ROUTES } from "@/lib/constants";
import { breadcrumbTrail } from "@/lib/breadcrumbs";

export const metadata = createMetadata({
  title: "Become a Dealer",
  description:
    "Register as a JFF Footwear dealer. Partner with an Indian slipper manufacturer based in Rayachoty, Andhra Pradesh.",
  path: "/dealer",
});

export default function DealerPage() {
  return (
    <BusinessPageScaffold
      breadcrumb={breadcrumbTrail({
        name: "Become a Dealer",
        path: ROUTES.dealer,
      })}
      ambient="light"
    >
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
    </BusinessPageScaffold>
  );
}
