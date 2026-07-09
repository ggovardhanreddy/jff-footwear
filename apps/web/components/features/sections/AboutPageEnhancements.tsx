"use client";

import Newsletter from "@/components/Newsletter";
import { WhyChooseJFF } from "@/components/features/sections";
import BusinessEnquiryCards from "@/components/features/business/BusinessEnquiryCards";

export default function AboutPageEnhancements() {
  return (
    <div className="space-y-0">
      <section className="section-padding" id="why-jff">
        <div className="container-custom">
          <WhyChooseJFF />
        </div>
      </section>
      <section className="section-padding bg-brand-light dark:bg-brand-dark">
        <div className="container-custom space-y-8">
          <div>
            <p className="eyebrow text-brand-accent">Partner With Us</p>
            <h2 className="heading-section mt-2">Business Enquiries</h2>
            <p className="mt-3 max-w-2xl text-sm text-brand-muted">
              Retail supply, wholesale orders, dealer registration, and private
              label — reach out to discuss your requirements.
            </p>
          </div>
          <BusinessEnquiryCards />
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
