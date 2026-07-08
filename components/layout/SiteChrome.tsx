"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { COMPANY } from "@/lib/constants";

export default function SiteChrome() {
  const pathname = usePathname();
  const isCinematicHome = pathname === "/";

  if (isCinematicHome) {
    return (
      <>
        <footer className="border-t border-black/5 bg-brand-cream py-6">
          <div className="container-custom flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <p className="text-xs text-brand-muted">
              &copy; {new Date().getFullYear()} {COMPANY.fullName}
            </p>
            <nav aria-label="Legal" className="flex flex-wrap justify-center gap-4">
              <Link
                href="/privacy-policy"
                className="text-xs text-brand-muted transition-colors hover:text-brand-black"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-brand-muted transition-colors hover:text-brand-black"
              >
                Terms
              </Link>
              <Link
                href="/contact"
                className="text-xs text-brand-muted transition-colors hover:text-brand-black"
              >
                Contact
              </Link>
            </nav>
          </div>
        </footer>
        <WhatsAppButton variant="floating" />
      </>
    );
  }

  return (
    <>
      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
