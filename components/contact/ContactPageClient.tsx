"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ContactForm from "@/components/ContactForm";
import {
  PageHero,
  ContactCard,
  MapSection,
  BusinessHours,
} from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";

const SUBJECT_BY_TYPE: Record<string, string> = {
  bulk: "Bulk Order Enquiry",
  wholesale: "Wholesale Enquiry",
  dealer: "Dealer Registration",
  distributor: "Distributor Enquiry",
  retail: "Retail Supply Enquiry",
  "private-label": "Private Label / OEM Enquiry",
  oem: "OEM Manufacturing Enquiry",
  callback: "Request Callback",
  factory: "Manufacturing Enquiry",
};

function ContactPageContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") ?? "";
  const defaultSubject = SUBJECT_BY_TYPE[type] ?? "";

  return (
    <PageShell ambient="cream">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <PageHero
        eyebrow="Get in Touch"
        title="Contact Us"
        description="Questions about products, wholesale pricing, dealer registration, or OEM manufacturing? We are here to help."
        className="mb-14"
      />

      <div className="grid gap-12 lg:grid-cols-2">
        <ScrollReveal variant="slideLeft">
          <div className="space-y-6">
            <ContactCard />
            <BusinessHours />
          </div>
        </ScrollReveal>

        <ScrollReveal variant="slideRight" delay={0.08}>
          <ContactForm defaultSubject={defaultSubject} />
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-16">
        <MapSection />
      </ScrollReveal>
    </PageShell>
  );
}

export default function ContactPageClient() {
  return (
    <Suspense fallback={null}>
      <ContactPageContent />
    </Suspense>
  );
}
