"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle } from "lucide-react";
import { NAV_LINKS, COMPANY, WHATSAPP_NUMBER } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const showSolid = scrolled || !isHome;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        showSolid
          ? "bg-white/95 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="container-custom flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="relative z-10 flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt={COMPANY.fullName}
            width={80}
            height={30}
            priority
            className={cn(
              "h-7 w-auto md:h-8 transition-all",
              !showSolid && "brightness-0 invert"
            )}
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-underline text-xs font-semibold uppercase tracking-widest transition-colors",
                pathname === link.href
                  ? "text-brand-accent"
                  : showSolid
                    ? "text-brand-black hover:text-brand-accent"
                    : "text-white/90 hover:text-brand-accent"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-2 bg-[#25D366] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#1da851] sm:flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "relative z-10 p-2 lg:hidden",
              !showSolid && !isOpen && "text-white"
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-white pt-20 lg:hidden"
          >
            <nav className="container-custom flex flex-col gap-6 py-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "text-2xl font-display font-bold uppercase tracking-wider",
                      pathname === link.href
                        ? "text-brand-accent"
                        : "text-brand-black"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 bg-[#25D366] px-6 py-4 text-sm font-semibold uppercase tracking-widest text-white"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp Inquiry
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
