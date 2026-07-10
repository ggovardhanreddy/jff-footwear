"use client";

import { useState, useEffect, useId, useRef, useCallback } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Heart, Bell, User, MapPin, Coins, Search } from "lucide-react";
import { COMPANY, ROUTES, SPOTLIGHT_NAV } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "@/context/LocationContext";
import { ThemeSwitcher } from "@/components/features";
import NavSearch from "@/components/nav/NavSearch";
import { SpotlightNavbar } from "@/components/premium";
import { formatCoins } from "@jff/api/coins";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [locationDraft, setLocationDraft] = useState("");
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { coinBalance, unreadNotifications, user } = useAuth();
  const { location, detecting, setLocation, detectLocation } = useLocation();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

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
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href.split("?")[0]}`);
  };

  return (
    <SpotlightNavbar
      hideOnScroll
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
                className="fixed inset-0 z-40 overflow-y-auto bg-white/95 pt-20 backdrop-blur-2xl dark:bg-brand-charcoal/95 xl:hidden"
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
                      href={ROUTES.accountRewards}
                      className="flex items-center gap-1.5 rounded-full bg-brand-accent/15 px-3 py-2 text-xs font-semibold"
                    >
                      <Coins className="h-3.5 w-3.5" />
                      {formatCoins(coinBalance)} Coins
                    </Link>
                  </div>
                  {SPOTLIGHT_NAV.map((link, i) => (
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
          </AnimatePresence>
        </>
      }
    >
      <div
        className={cn(
          "container-custom flex items-center justify-between gap-3 transition-[height] duration-500",
          scrolled ? "h-14 md:h-16" : "h-16 md:h-[4.5rem]"
        )}
      >
        <div className="flex min-w-0 items-center gap-3 md:gap-5">
          <Link
            href="/"
            className="focus-ring relative z-10 flex shrink-0 items-center gap-2 rounded-lg"
          >
            <BrandLogo
              alt={COMPANY.fullName}
              width={52}
              height={52}
              priority
              className={cn(scrolled ? "h-11 w-11 md:h-12 md:w-12" : "h-12 w-12 md:h-14 md:w-14")}
            />
          </Link>

          <div className="hidden min-w-0 items-center gap-2 lg:flex">
            <button
              type="button"
              onClick={() => {
                setLocationDraft(location);
                setEditingLocation(true);
              }}
              className="focus-ring flex max-w-[200px] items-center gap-1.5 rounded-full border border-black/[0.06] bg-white/60 px-3 py-1.5 text-left backdrop-blur dark:border-white/10 dark:bg-white/5"
              aria-label="Change delivery location"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 text-brand-accent" />
              <span className="truncate text-[11px] font-medium text-brand-black dark:text-white">
                {detecting ? "Detecting…" : location}
              </span>
            </button>

            <Link
              href={ROUTES.accountRewards}
              className="focus-ring flex items-center gap-1.5 rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1.5 text-[11px] font-semibold text-brand-black dark:text-brand-accent"
            >
              <Coins className="h-3.5 w-3.5" />
              {formatCoins(coinBalance)} Coins
            </Link>
          </div>
        </div>

        <nav className="hidden items-center gap-3 xl:flex xl:gap-4" aria-label="Primary navigation">
          {SPOTLIGHT_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "link-underline rounded-sm text-[10px] font-semibold uppercase tracking-widest transition-colors 2xl:text-xs",
                isActive(link.href)
                  ? "text-brand-accent"
                  : "text-brand-black hover:text-brand-accent dark:text-white/90"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <div className="hidden md:block">
            <NavSearch showSolid />
          </div>
          <Link
            href={ROUTES.search}
            className="focus-ring rounded-lg p-2.5 text-brand-black dark:text-white md:hidden"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Link>

          <div className="hidden md:flex">
            <ThemeSwitcher compact />
          </div>

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
            href={ROUTES.notifications}
            className="focus-ring relative rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white"
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
            className="focus-ring relative rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white"
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
            className="focus-ring rounded-lg p-2.5 text-brand-black transition-colors hover:text-brand-accent dark:text-white"
            aria-label={user ? "Account" : "Sign in"}
          >
            <User className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="focus-ring relative z-10 flex items-center gap-1.5 rounded-lg border border-black/10 px-2.5 py-2 text-brand-black dark:border-white/20 dark:text-white xl:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls={menuId}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </SpotlightNavbar>
  );
}
