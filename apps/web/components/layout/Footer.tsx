import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { COMPANY, WHATSAPP_NUMBER, ROUTES, getConfiguredSocialLinks } from "@/lib/constants";
import { SocialFlipButton } from "@/components/premium";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

const socialLinks = getConfiguredSocialLinks({
  includeGithub: process.env.NODE_ENV === "development",
});

const SHOP_LINKS = [
  { href: "/products?gender=Men", label: "Men" },
  { href: "/products?gender=Women", label: "Women" },
  { href: "/products?gender=Kids", label: "Kids" },
  { href: "/products?new=1", label: "New Arrivals" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
] as const;

const SERVICE_LINKS = [
  { href: ROUTES.contact, label: "Contact" },
  { href: ROUTES.shipping, label: "Shipping" },
  { href: ROUTES.returns, label: "Returns" },
  { href: ROUTES.faq, label: "FAQs" },
] as const;

const COMPANY_LINKS = [
  { href: ROUTES.about, label: "About JFF" },
  { href: ROUTES.wholesale, label: "Wholesale" },
  {
    href: `mailto:${COMPANY.email}?subject=${encodeURIComponent("Careers at JFF")}`,
    label: "Careers",
    external: true,
  },
] as const;

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
        {title}
      </h3>
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a
                href={link.href}
                className="focus-ring inline-flex min-h-11 items-center text-sm text-gray-400 hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="focus-ring link-underline inline-flex min-h-11 items-center text-sm text-gray-400 hover:text-white"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="container-custom section-padding">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-6 sm:col-span-2 lg:col-span-1">
            <BrandLogo
              alt={COMPANY.fullName}
              width={56}
              height={56}
              variant="dark"
              className="h-14 w-14"
            />
            <p className="text-sm leading-relaxed text-gray-400">{COMPANY.description}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-xl border border-gray-700 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:border-brand-accent hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-brand-accent" aria-hidden />
              Chat on WhatsApp
            </a>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Customer Service" links={SERVICE_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
              Social
            </h3>
            {socialLinks.length > 0 ? (
              <SocialFlipButton links={socialLinks} size="md" />
            ) : (
              <p className="text-sm text-gray-400">
                WhatsApp and email are the live contact channels.
              </p>
            )}
            <ul className="mt-6 space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
                {COMPANY.address}
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-4 w-4 shrink-0 text-brand-accent" />
                <a href={`tel:${COMPANY.phone}`} className="focus-ring rounded-sm hover:text-white">
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-brand-accent" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="focus-ring rounded-sm hover:text-white"
                >
                  {COMPANY.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-800 pt-8 text-xs text-gray-500">
          <p>UPI · Cards · Net banking · Cash on delivery</p>
          <p className="hidden sm:inline" aria-hidden>
            ·
          </p>
          <p>Secure checkout · Made in Rayachoty</p>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {COMPANY.fullName}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
            <Link href={ROUTES.privacy} className="focus-ring hover:text-white">
              Privacy
            </Link>
            <Link href={ROUTES.terms} className="focus-ring hover:text-white">
              Terms
            </Link>
            <Link href={ROUTES.sizeGuide} className="focus-ring hover:text-white">
              Size guide
            </Link>
            <p>Founded {COMPANY.foundedYear}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
