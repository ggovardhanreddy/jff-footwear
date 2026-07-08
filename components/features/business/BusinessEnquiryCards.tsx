"use client";

import Link from "next/link";
import {
  Package,
  Users,
  Building2,
  Store,
  Factory,
  Tag,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { WHOLESALE_SERVICES } from "@/data/company";
import { cn } from "@/lib/utils";

const ICONS = [Package, Users, Building2, Store, Factory, Tag] as const;

const ENQUIRY_HREFS = [
  `${ROUTES.contact}?type=wholesale`,
  ROUTES.dealer,
  `${ROUTES.contact}?type=distributor`,
  `${ROUTES.contact}?type=retail`,
  `${ROUTES.contact}?type=bulk`,
  ROUTES.oem,
] as const;

interface BusinessEnquiryCardsProps {
  className?: string;
}

export default function BusinessEnquiryCards({
  className,
}: BusinessEnquiryCardsProps) {
  return (
    <section
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
      aria-label="Business enquiries"
    >
      {WHOLESALE_SERVICES.map((service, index) => {
        const Icon = ICONS[index] ?? Package;
        const href = ENQUIRY_HREFS[index] ?? ROUTES.contact;
        return (
          <Link
            key={service.title}
            href={href}
            className="group flex gap-4 rounded-2xl border border-black/5 bg-white/60 p-5 transition-all hover:border-brand-accent/30 hover:shadow-md dark:border-white/10 dark:bg-brand-dark"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 transition-colors group-hover:bg-brand-accent/20">
              <Icon className="h-5 w-5 text-brand-accent" />
            </div>
            <div>
              <p className="font-semibold text-brand-black dark:text-white">
                {service.title}
              </p>
              <p className="mt-0.5 text-sm text-brand-muted">
                {service.description}
              </p>
            </div>
          </Link>
        );
      })}
    </section>
  );
}
