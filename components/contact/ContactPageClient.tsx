"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import { COMPANY } from "@/lib/constants";

export default function ContactPageClient() {
  return (
    <PageShell ambient="cream">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact" },
        ]}
      />

      <SectionHeading
        subtitle="Get in Touch"
        title="Contact Us"
        description="Have questions about our products or want to place a bulk order? We'd love to hear from you."
      />

      <div className="grid gap-12 lg:grid-cols-2">
        <div className="space-y-8">
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: "Address",
                content: COMPANY.address,
              },
              {
                icon: Phone,
                title: "Phone",
                content: COMPANY.phone,
                href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
              },
              {
                icon: Mail,
                title: "Email",
                content: COMPANY.email,
                href: `mailto:${COMPANY.email}`,
              },
              {
                icon: Clock,
                title: "Business Hours",
                content: "Mon - Sat: 9:00 AM - 6:00 PM IST",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-black text-brand-accent">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="link-underline text-sm text-brand-muted"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-sm text-brand-muted">{item.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <WhatsAppButton />
        </div>

        <ContactForm />
      </div>

      <div className="mt-16 overflow-hidden rounded-[28px] border border-gray-200">
        <div className="flex aspect-[21/9] items-center justify-center bg-brand-light">
          <div className="px-4 text-center">
            <MapPin className="mx-auto h-8 w-8 text-brand-accent" aria-hidden />
            <p className="mt-3 text-sm font-medium text-brand-black">
              Visit Our Facility
            </p>
            <p className="mt-1 text-xs text-brand-muted">{COMPANY.address}</p>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-3 inline-block text-xs text-brand-accent"
            >
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
