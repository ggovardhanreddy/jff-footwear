"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, ShoppingBag, Heart, Scale } from "lucide-react";
import { NAV_LINKS, COMPANY, WHATSAPP_NUMBER, ROUTES } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { ThemeSwitcher } from "@/components/features";
import MegaMenu from "@/components/nav/MegaMenu";
import NavSearch from "@/components/nav/NavSearch";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  /** Always use solid header for readable nav on every page and during cinematic load. */
  const showSolid = true;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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
    <motion.header
      animate={scrolled ? "shrunk" : "expanded"}
      variants={{
        expanded: { height: "auto" },
        shrunk: {},
      }}
      className={cn(
        "fixed top-0 z-50 w-full border-b border-black/[0.06] bg-white/90 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.08)] backdrop-blur-xl backdrop-saturate-150 transition-[box-shadow,padding] duration-500 dark:border-white/10 dark:bg-brand-charcoal/80 dark:shadow-glass",
        scrolled && "md:shadow-[0_4px_24px_-8px_rgba(0,0,0,0.08)]"
      )}
    >
      <div
        className={cn(
          "container-custom flex items-center justify-between transition-[height] duration-500",
          scrolled ? "h-14 md:h-16" : "h-16 md:h-[4.5rem]"
        )}
      >
        <Link
          href="/"
          className="focus-ring relative z-10 flex items-center gap-2 rounded-lg"
        >
          <BrandLogo
            alt={COMPANY.fullName}
            width={80}
            height={30}
            priority
            className={cn(scrolled ? "md:h-7" : "md:h-8")}
          />
        </Link>

        <nav
          className="hidden items-center gap-4 md:flex md:gap-5 lg:gap-6"
          aria-label="Primary navigation"
        >
          <MegaMenu showSolid={showSolid} />
          {NAV_LINKS.filter((l) => l.href !== "/products").map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-underline rounded-sm text-xs font-semibold uppercase tracking-widest transition-colors",
                pathname === link.href
                  ? "text-brand-accent"
                  : "text-brand-black hover:text-brand-accent dark:text-white/90"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <NavSearch showSolid={showSolid} />
          <div className="hidden md:flex">
            <ThemeSwitcher compact />
          </div>

          <Link
            href={ROUTES.customize}
            className="focus-ring hidden rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white md:inline-flex"
            aria-label="Customize slippers"
          >
            <span className="text-[10px] font-bold uppercase tracking-widest">Custom</span>
          </Link>

          <Link
            href={ROUTES.compare}
            className="focus-ring relative hidden rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white sm:inline-flex"
            aria-label="Compare products"
          >
            <Scale className="h-5 w-5" />
          </Link>

          <Link
            href={ROUTES.wishlist}
            className="focus-ring relative rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link
            href={ROUTES.cart}
            className="focus-ring relative rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white"
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
            className="focus-ring relative z-10 flex items-center gap-1.5 rounded-lg border border-black/10 px-2.5 py-2 text-brand-black dark:border-white/20 dark:text-white md:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls={menuId}
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {isOpen ? "Close" : "Menu"}
            </span>
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
            className="fixed inset-0 z-40 overflow-y-auto bg-white pt-20 md:hidden"
          >
            <nav
              className="container-custom flex flex-col gap-2 py-8"
              aria-label="Mobile navigation"
            >
              <Link
                href={ROUTES.search}
                className="focus-ring block rounded-xl px-2 py-3 font-display text-2xl font-bold uppercase tracking-wider text-brand-black"
              >
                Search
              </Link>
              <Link
                href={ROUTES.collections}
                className="focus-ring block rounded-xl px-2 py-3 font-display text-2xl font-bold uppercase tracking-wider text-brand-black"
              >
                Collections
              </Link>
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
                href={ROUTES.wishlist}
                className="focus-ring flex items-center gap-2 rounded-xl px-2 py-3 font-display text-2xl font-bold uppercase tracking-wider text-brand-black"
              >
                <Heart className="h-6 w-6" />
                Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
              </Link>
              <Link
                href={ROUTES.cart}
                className="focus-ring flex items-center gap-2 rounded-xl px-2 py-3 font-display text-2xl font-bold uppercase tracking-wider text-brand-black"
              >
                <ShoppingBag className="h-6 w-6" />
                Cart{itemCount > 0 ? ` (${itemCount})` : ""}
              </Link>
              <div className="mt-4 flex flex-wrap items-center gap-3 px-2">
                <ThemeSwitcher />
              </div>
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
    </motion.header>
  );
}
