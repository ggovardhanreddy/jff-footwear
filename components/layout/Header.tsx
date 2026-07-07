"use client";

import { useState, useEffect, useId } from "react";
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
  const menuId = useId();
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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        showSolid
          ? "bg-white/95 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <div className="container-custom flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link
          href="/"
          className="focus-ring relative z-10 flex items-center gap-2 rounded-lg"
        >
          <Image
            src="/images/logo.svg"
            alt={COMPANY.fullName}
            width={80}
            height={30}
            priority
            className={cn(
              "h-7 w-auto transition-all md:h-8",
              !showSolid && "brightness-0 invert"
            )}
          />
        </Link>

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-underline rounded-sm text-xs font-semibold uppercase tracking-widest transition-colors",
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
            className="btn-whatsapp focus-ring hidden !px-5 !py-2.5 !text-xs sm:inline-flex"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              "focus-ring relative z-10 rounded-lg p-2.5 lg:hidden",
              !showSolid && !isOpen && "text-white"
            )}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls={menuId}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.28 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-white pt-20 lg:hidden"
          >
            <nav
              className="container-custom flex flex-col gap-2 py-8"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "focus-ring block rounded-xl px-2 py-3 font-display text-2xl font-bold uppercase tracking-wider",
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
                className="btn-whatsapp focus-ring mt-6 w-full"
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
