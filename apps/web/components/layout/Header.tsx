"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Heart, Bell, User, MapPin, Coins } from "lucide-react";
import { COMPANY, ROUTES } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { ThemeSwitcher } from "@/components/features";
import CatalogSearch from "@/components/nav/CatalogSearch";
import { SpotlightNavbar } from "@/components/premium";
import { formatCoins } from "@jff/api/coins";
import { cn } from "@/lib/utils";

const DESKTOP_NAV = [
  { href: "/products?gender=Men", label: "Men" },
  { href: "/products?gender=Women", label: "Women" },
  { href: "/products?gender=Kids", label: "Kids" },
  { href: "/products?new=1", label: "New Arrivals" },
  { href: "/collections/best-sellers", label: "Best Sellers" },
  { href: "/#offers", label: "Offers" },
  { href: ROUTES.wholesale, label: "Wholesale" },
] as const;

const MOBILE_NAV = [
  ...DESKTOP_NAV,
  { href: ROUTES.about, label: "About JFF" },
  { href: ROUTES.contact, label: "Contact" },
] as const;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [locationDraft, setLocationDraft] = useState("");
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [portalReady, setPortalReady] = useState(false);
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { coinBalance, unreadNotifications, user } = useAuth();
  const { location, detecting, setLocation, detectLocation } = useLocation();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setQuery(window.location.search.replace(/^\?/, ""));
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
        "a[href], button:not([disabled])"
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

  const saveLocation = async () => {
    if (locationDraft.trim()) {
      await setLocation(locationDraft.trim());
    }
    setEditingLocation(false);
  };

  const isActive = (href: string) => {
    const [path, expectedQuery = ""] = href.split("?");
    if (path === "/") return pathname === "/";
    if (pathname !== path) return false;
    if (!expectedQuery) return true;
    const expected = new URLSearchParams(expectedQuery);
    const current = new URLSearchParams(query);
    for (const [key, value] of expected) {
      if (current.get(key) !== value) return false;
    }
    return true;
  };

  return (
    <SpotlightNavbar
      hideOnScroll={false}
      overlay={false}
      below={
        <>
          <AnimatePresence>
            {editingLocation && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="border-t border-black/[0.06] bg-white/95 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-brand-charcoal/95"
              >
                <div className="container-custom flex flex-wrap items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-accent" />
                  <input
                    value={locationDraft}
                    onChange={(e) => setLocationDraft(e.target.value)}
                    placeholder="City, State"
                    className="input-field min-w-[200px] flex-1 !py-2 text-sm"
                    aria-label="Delivery location"
                  />
                  <button
                    type="button"
                    onClick={() => void detectLocation()}
                    className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold dark:border-white/15"
                  >
                    Detect
                  </button>
                  <button
                    type="button"
                    onClick={() => void saveLocation()}
                    className="rounded-full bg-brand-black px-4 py-2 text-xs font-semibold text-white dark:bg-white dark:text-brand-black"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingLocation(false)}
                    className="text-xs text-brand-muted"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {portalReady
            ? createPortal(
                <AnimatePresence>
                  {isOpen && (
                    <motion.button
                      key="nav-backdrop"
                      type="button"
                      aria-label="Close menu"
                      className="fixed inset-0 z-40 bg-black/35 lg:hidden"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsOpen(false)}
                    />
                  )}
                  {isOpen && (
                    <motion.div
                      key="nav-panel"
                      ref={menuRef}
                      id={menuId}
                      role="dialog"
                      aria-modal="true"
                      aria-label="Mobile navigation menu"
                      onKeyDown={handleMenuKeyDown}
                      initial={{ x: "100%" }}
                      animate={{ x: 0 }}
                      exit={{ x: "100%" }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="fixed bottom-0 right-0 top-16 z-40 w-full max-w-md overflow-y-auto border-l border-black/10 bg-[#f6f3ee]/95 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#12100e]/95 lg:hidden"
                    >
                      <nav
                        className="container-custom flex flex-col gap-2 py-8"
                        aria-label="Mobile navigation"
                      >
                        <div className="mb-4 flex flex-wrap gap-2 px-2">
                          <button
                            type="button"
                            onClick={() => {
                              setLocationDraft(location);
                              setEditingLocation(true);
                              setIsOpen(false);
                            }}
                            className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-2 text-xs dark:border-white/15"
                          >
                            <MapPin className="h-3.5 w-3.5 text-brand-accent" />
                            {location}
                          </button>
                          <Link
                            href={ROUTES.notifications}
                            className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-2 text-xs dark:border-white/15"
                          >
                            <Bell className="h-3.5 w-3.5" />
                            Notifications
                          </Link>
                          <Link
                            href={ROUTES.accountRewards}
                            className="flex items-center gap-1.5 rounded-full bg-brand-accent/15 px-3 py-2 text-xs font-semibold"
                          >
                            <Coins className="h-3.5 w-3.5" />
                            {formatCoins(coinBalance)} Coins
                          </Link>
                        </div>
                        {MOBILE_NAV.map((link, i) => (
                          <motion.div
                            key={link.href}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                          >
                            <Link
                              href={link.href}
                              className="focus-ring block rounded-xl px-2 py-3 font-display text-2xl font-bold uppercase tracking-wider text-brand-black dark:text-white"
                            >
                              {link.label}
                            </Link>
                          </motion.div>
                        ))}
                        <div className="mt-4 px-2">
                          <ThemeSwitcher />
                        </div>
                      </nav>
                    </motion.div>
                  )}
                </AnimatePresence>,
                document.body
              )
            : null}
        </>
      }
    >
      <div
        className={cn(
          "container-custom flex items-center gap-2 transition-[height] duration-500 sm:gap-3",
          scrolled ? "h-14" : "h-16"
        )}
      >
        <Link
          href="/"
          className="focus-ring relative z-10 flex shrink-0 items-center gap-2 rounded-lg"
        >
          <BrandLogo
            alt=""
            width={52}
            height={52}
            priority
            className={cn(scrolled ? "h-10 w-10" : "h-11 w-11")}
          />
          <span className="font-display text-lg font-semibold tracking-[0.22em] text-brand-black dark:text-white">
            JFF
          </span>
        </Link>

        <CatalogSearch />

        <div className="flex shrink-0 items-center">
          <div className="hidden lg:flex">
            <ThemeSwitcher compact />
          </div>

          <Link
            href={ROUTES.wishlist}
            className="focus-ring relative hidden min-h-11 min-w-11 items-center justify-center rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white sm:inline-flex"
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
            href={ROUTES.notifications}
            className="focus-ring relative hidden min-h-11 min-w-11 items-center justify-center rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white md:inline-flex"
            aria-label={`Notifications, ${unreadNotifications} unread`}
          >
            <Bell className="h-5 w-5" />
            {unreadNotifications > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-brand-black">
                {unreadNotifications > 9 ? "9+" : unreadNotifications}
              </span>
            )}
          </Link>

          <Link
            href={ROUTES.cart}
            className="focus-ring relative inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white"
            aria-label={`Cart, ${itemCount} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] font-bold text-brand-black">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <Link
            href={user ? ROUTES.account : ROUTES.login}
            className="focus-ring hidden min-h-11 min-w-11 items-center justify-center rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white sm:inline-flex"
            aria-label={user ? "Account" : "Sign in"}
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="focus-ring relative z-10 inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg border border-black/10 px-2.5 text-brand-black dark:border-white/20 dark:text-white lg:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls={menuId}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <nav
        className="hidden border-t border-black/[0.05] dark:border-white/10 lg:block"
        aria-label="Shop categories"
      >
        <div className="container-custom flex h-11 items-center gap-5 overflow-x-auto">
          <button
            type="button"
            onClick={() => {
              setLocationDraft(location);
              setEditingLocation(true);
            }}
            className="focus-ring flex max-w-[180px] shrink-0 items-center gap-1.5 text-left text-[11px] font-medium"
            aria-label="Change delivery location"
          >
            <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-accent" />
            <span className="truncate">{detecting ? "Detecting…" : location}</span>
          </button>
          <Link
            href={ROUTES.accountRewards}
            className="focus-ring inline-flex shrink-0 items-center gap-1.5 text-[11px] font-semibold text-brand-black dark:text-brand-accent"
          >
            <Coins className="h-3.5 w-3.5" />
            {formatCoins(coinBalance)} Coins
          </Link>
          {DESKTOP_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "focus-ring shrink-0 rounded-sm text-[11px] font-semibold uppercase tracking-[0.14em]",
                isActive(link.href)
                  ? "text-brand-accent"
                  : "text-brand-black hover:text-brand-accent dark:text-white/90"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </SpotlightNavbar>
  );
}
