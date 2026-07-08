"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import SplitText from "@/components/cinematic/primitives/SplitText";
import MagneticButton from "@/components/cinematic/primitives/MagneticButton";
import { COMPANY, WHATSAPP_NUMBER, NAV_LINKS } from "@/lib/constants";
import { scaleReveal } from "@/lib/motion";

export default function ContactSection() {
  const reduced = useReducedMotion();

  return (
    <SnapSection id="contact" className="justify-between pt-16">
      <CinematicBackground variant="cream" intensity="medium" />

      <div className="container-custom relative z-10 flex min-h-0 flex-1 flex-col justify-center py-10">
        <motion.div {...scaleReveal(reduced)} className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Get in Touch</p>
          <SplitText
            text="Contact JFF Footwear"
            className="heading-section mx-auto mt-3"
          />
          <p className="text-body mx-auto mt-4 max-w-xl">
            Retail, wholesale, dealer registration, or bulk manufacturing —
            our team is ready to assist with pricing and availability.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              variant="primary"
              external
            >
              <MessageCircle className="inline h-4 w-4" />
              WhatsApp Inquiry
            </MagneticButton>
            <MagneticButton href="/contact" variant="ghost">
              Contact Form
            </MagneticButton>
          </div>

          <div className="mt-14 grid gap-6 text-left sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Phone,
                label: "Phone",
                value: COMPANY.phone,
                href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
              },
              {
                icon: MessageCircle,
                label: "WhatsApp",
                value: COMPANY.phone,
                href: `https://wa.me/${WHATSAPP_NUMBER}`,
              },
              {
                icon: Mail,
                label: "Email",
                value: COMPANY.email,
                href: `mailto:${COMPANY.email}`,
              },
              {
                icon: Clock,
                label: "Business Hours",
                value: COMPANY.businessHours,
              },
              {
                icon: MapPin,
                label: "Location",
                value: COMPANY.locationShort,
                href: "/contact",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-black/5 bg-white/60 p-5 backdrop-blur-sm"
              >
                <item.icon className="h-5 w-5 text-brand-accent" aria-hidden />
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    className="link-underline mt-1 block text-sm font-medium"
                    {...(item.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-medium">{item.value}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <footer className="relative z-10 border-t border-black/5 bg-white/40 backdrop-blur-md">
        <div className="container-custom flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
          <p className="font-display text-lg tracking-wide">
            {COMPANY.fullName}
          </p>
          <nav className="flex flex-wrap justify-center gap-6" aria-label="Footer">
            {NAV_LINKS.slice(1, 6).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="link-underline text-xs font-semibold uppercase tracking-widest text-brand-muted"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-brand-muted">
            &copy; {new Date().getFullYear()} · Founded {COMPANY.foundedYear}
          </p>
        </div>
      </footer>
    </SnapSection>
  );
}
