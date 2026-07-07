import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
} from "lucide-react";
import { NAV_LINKS, COMPANY, PRODUCT_CATEGORIES, WHATSAPP_NUMBER } from "@/lib/constants";

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white">
      <div className="container-custom section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Image
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
                    className="link-underline text-sm text-gray-400 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/categories"
                  className="link-underline text-sm text-gray-400 hover:text-white"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
              Categories
            </h3>
            <ul className="space-y-3">
              {PRODUCT_CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
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
                <a href={`tel:${COMPANY.phone}`} className="hover:text-white">
                  {COMPANY.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-4 w-4 shrink-0 text-brand-accent" />
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="hover:text-white"
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
            Crafted with precision since {COMPANY.founded}
          </p>
        </div>
      </div>
    </footer>
  );
}
