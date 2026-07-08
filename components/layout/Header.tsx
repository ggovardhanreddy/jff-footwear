"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, ShoppingBag } from "lucide-react";
import { NAV_LINKS, COMPANY, WHATSAPP_NUMBER, ROUTES } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";
  const showSolid = scrolled || !isHome;

  useEffect(() => {
    if (!isHome) return;

    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  useEffect(() => {
    if (isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleMenuKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!isOpen || event.key !== "Tab" || !menuRef.current) return;

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [isOpen]
  );

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    const first = menuRef.current.querySelector<HTMLElement>("a[href], button");
    first?.focus();
  }, [isOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-[background-color,box-shadow,border-color] duration-500",
        showSolid
          ? "border-b border-black/[0.04] bg-white/80 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)] backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent backdrop-blur-none"
      )}
    >
      <div className="container-custom flex h-16 items-center justify-between md:h-[4.5rem]">
        <Link
          href="/"
          className="focus-ring relative z-10 flex items-center gap-2 rounded-lg"
        >
          <AssetImage
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
                pathname === link.href ||
                  (link.href === "/products" && pathname.startsWith("/products"))
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
          <Link
            href={ROUTES.cart}
            className={cn(
              "focus-ring relative rounded-lg p-2.5 transition-colors",
              !showSolid && !isOpen && "text-white hover:text-brand-accent",
              showSolid && "text-brand-black hover:text-brand-accent"
            )}
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

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
            ref={menuRef}
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
            onKeyDown={handleMenuKeyDown}
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
                      pathname === link.href ||
                        (link.href === "/products" &&
                          pathname.startsWith("/products"))
                        ? "text-brand-accent"
                        : "text-brand-black"
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href={ROUTES.cart}
                className="focus-ring flex items-center gap-2 rounded-xl px-2 py-3 font-display text-2xl font-bold uppercase tracking-wider text-brand-black"
              >
                <ShoppingBag className="h-6 w-6" />
                Cart{itemCount > 0 ? ` (${itemCount})` : ""}
              </Link>
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
