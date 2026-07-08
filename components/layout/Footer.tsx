import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { NAV_LINKS, COMPANY, WHATSAPP_NUMBER, ROUTES } from "@/lib/constants";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

const SUPPORT_LINKS = [
  { href: ROUTES.sizeGuide, label: "Size Guide" },
  { href: ROUTES.careInstructions, label: "Care Instructions" },
  { href: ROUTES.shipping, label: "Shipping & Delivery" },
  { href: ROUTES.returns, label: "Returns & Exchanges" },
  { href: ROUTES.dealer, label: "Become a Dealer" },
  { href: ROUTES.oem, label: "OEM / Private Label" },
] as const;

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="container-custom section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <AssetImage
              src="/images/logo.svg"
              alt={COMPANY.fullName}
              width={80}
              height={30}
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="text-sm leading-relaxed text-gray-400">
              {COMPANY.description}
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-xl border border-gray-700 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:border-brand-accent hover:text-white"
            >
              <MessageCircle className="h-4 w-4 text-brand-accent" aria-hidden />
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring link-underline text-sm text-gray-400 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
              Support
            </h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="focus-ring text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={ROUTES.privacy}
                  className="focus-ring text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.terms}
                  className="focus-ring text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
              Contact
            </h3>
            <ul className="space-y-4">
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

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 md:flex-row">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {COMPANY.fullName}. All rights
            reserved.
          </p>
          <p className="text-xs text-gray-500">
            Founded {COMPANY.foundedYear} · Made in India
          </p>
        </div>
      </div>
    </footer>
  );
}
