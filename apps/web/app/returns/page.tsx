import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero, ReturnPolicyCards, PageCta } from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { ROUTES } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Returns & Exchanges",
  description:
    "JFF Footwear return and exchange policy — eligibility, damaged product reporting, exchanges, and customer support.",
  path: "/returns",
});

export default function ReturnsPage() {
  return (
    <PageShell ambient="light">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Returns & Exchanges", path: "/returns" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Returns & Exchanges", href: "/returns" },
        ]}
      />

      <PageHero
        eyebrow="Customer Care"
        title="Return & Exchange Policy"
        description="We stand behind the quality of our footwear. If something is not right with your order, contact us and we will work to resolve it professionally."
        className="mb-14"
      />

      <ScrollReveal>
        <ReturnPolicyCards />
      </ScrollReveal>

      <ScrollReveal className="mt-16" delay={0.1}>
        <PageCta
          title="Need Help With a Return?"
          description="Contact our support team with your order details. We typically respond within one business day during operating hours."
          primaryLabel="Contact Support"
          primaryHref={ROUTES.contact}
          whatsappMessage="Hello JFF, I need help with a return or exchange."
        />
      </ScrollReveal>
    </PageShell>
  );
}
