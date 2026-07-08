import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import {
  PageHero,
  ShippingTimeline,
  ShippingDetailsGrid,
} from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { SHIPPING_CONFIG } from "@/config/shipping";

export const metadata = createMetadata({
  title: "Shipping & Delivery",
  description:
    "Delivery across India, PIN code estimates, processing timelines, delivery charges, and free delivery threshold — JFF Footwear shipping information.",
  path: "/shipping",
});

export default function ShippingPage() {
  return (
    <PageShell ambient="cream">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Shipping & Delivery", path: "/shipping" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shipping & Delivery", href: "/shipping" },
        ]}
      />

      <PageHero
        eyebrow="Delivery"
        title="Shipping & Delivery"
        description="We deliver across India. Enter your PIN code at checkout for estimated timelines. Standard delivery charges apply; free delivery on orders above ₹499."
        className="mb-14"
      />

      <ScrollReveal>
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              label: "Free Delivery",
              value: `Orders above ₹${SHIPPING_CONFIG.FREE_DELIVERY_THRESHOLD}`,
            },
            {
              label: "Standard Charge",
              value: `₹${SHIPPING_CONFIG.DELIVERY_CHARGE}`,
            },
            {
              label: "Dispatch From",
              value: SHIPPING_CONFIG.WAREHOUSE_STATE,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[24px] border border-black/[0.06] bg-white/80 p-6 text-center shadow-soft backdrop-blur-sm"
            >
              <p className="font-display text-xl font-bold text-brand-black">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-brand-muted">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-12">
        <h2 className="font-display mb-8 text-2xl font-bold">How Delivery Works</h2>
        <ShippingTimeline />
      </ScrollReveal>

      <ScrollReveal className="mt-16">
        <ShippingDetailsGrid />
      </ScrollReveal>
    </PageShell>
  );
}
