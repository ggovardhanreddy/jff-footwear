import { ROUTES } from "./constants";

export type BusinessPageCategory = "company" | "b2b" | "support" | "legal";

export type BusinessPage = {
  href: string;
  label: string;
  description: string;
  icon: string;
  category: BusinessPageCategory;
};

/** Canonical list of JFF business / support pages (Phase 10). */
export const BUSINESS_PAGES: readonly BusinessPage[] = [
  {
    href: ROUTES.about,
    label: "About Us",
    description: "Our story, mission, and manufacturing roots in Rayachoty.",
    icon: "Building2",
    category: "company",
  },
  {
    href: ROUTES.qualityCommitment,
    label: "Quality Commitment",
    description: "Materials, inspection, and standards behind every pair.",
    icon: "ShieldCheck",
    category: "company",
  },
  {
    href: ROUTES.wholesale,
    label: "Wholesale",
    description: "Bulk pricing, MOQ tiers, and retail supply programmes.",
    icon: "Package",
    category: "b2b",
  },
  {
    href: ROUTES.oem,
    label: "OEM",
    description: "Private label manufacturing and custom branding.",
    icon: "Factory",
    category: "b2b",
  },
  {
    href: ROUTES.dealer,
    label: "Become a Dealer",
    description: "Partner with JFF to stock slippers in your region.",
    icon: "Store",
    category: "b2b",
  },
  {
    href: ROUTES.distributor,
    label: "Distributor Enquiry",
    description: "Regional distribution and partnership opportunities.",
    icon: "Building2",
    category: "b2b",
  },
  {
    href: ROUTES.catalog,
    label: "Product Catalog",
    description: "Download the full JFF slipper catalog (CSV).",
    icon: "Package",
    category: "b2b",
  },
  {
    href: ROUTES.customize,
    label: "Customize",
    description: "Configure materials, branding, and packaging with live pricing.",
    icon: "SlidersHorizontal",
    category: "b2b",
  },
  {
    href: ROUTES.sizeGuide,
    label: "Size Guide",
    description: "How to measure and find the right slipper size.",
    icon: "Ruler",
    category: "support",
  },
  {
    href: ROUTES.careInstructions,
    label: "Care Instructions",
    description: "Keep your footwear clean, comfortable, and lasting longer.",
    icon: "Sparkles",
    category: "support",
  },
  {
    href: ROUTES.shipping,
    label: "Shipping",
    description: "Delivery timelines, charges, and dispatch from Andhra Pradesh.",
    icon: "Truck",
    category: "support",
  },
  {
    href: ROUTES.returns,
    label: "Returns",
    description: "Return eligibility, exchanges, and damaged product support.",
    icon: "RotateCcw",
    category: "support",
  },
  {
    href: ROUTES.privacy,
    label: "Privacy Policy",
    description: "How we collect, use, and protect your information.",
    icon: "Lock",
    category: "legal",
  },
  {
    href: ROUTES.terms,
    label: "Terms & Conditions",
    description: "Website usage, orders, and business terms.",
    icon: "FileText",
    category: "legal",
  },
  {
    href: ROUTES.faq,
    label: "FAQs",
    description: "Answers on products, wholesale, delivery, and support.",
    icon: "HelpCircle",
    category: "support",
  },
  {
    href: ROUTES.contact,
    label: "Contact Us",
    description: "Reach our team by form, phone, email, or WhatsApp.",
    icon: "MessageCircle",
    category: "support",
  },
] as const;

export function getBusinessPagesByCategory(
  category: BusinessPageCategory
): readonly BusinessPage[] {
  return BUSINESS_PAGES.filter((page) => page.category === category);
}
