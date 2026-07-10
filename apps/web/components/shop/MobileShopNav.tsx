"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Grid3X3, Coins, User } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: ROUTES.home, label: "Home", icon: Home },
  { href: ROUTES.categories, label: "Categories", icon: Grid3X3 },
  { href: ROUTES.accountRewards, label: "Rewards", icon: Coins },
  { href: ROUTES.cart, label: "Cart", icon: ShoppingBag, badge: "cart" as const },
  { href: ROUTES.account, label: "Account", icon: User },
];

export default function MobileShopNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  if (pathname === ROUTES.checkout) return null;

  return (
    <nav
      className="fixed inset-x-3 bottom-3 z-40 rounded-2xl border border-white/40 bg-white/75 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] backdrop-blur-2xl dark:border-white/10 dark:bg-brand-charcoal/80 lg:hidden"
      style={{ paddingBottom: "max(0.25rem, env(safe-area-inset-bottom))" }}
      aria-label="Shop navigation"
    >
      <ul className="grid grid-cols-5">
        {LINKS.map(({ href, label, icon: Icon, badge }) => {
          const active =
            pathname === href ||
            (href === ROUTES.categories && pathname.startsWith("/categories")) ||
            (href === ROUTES.accountRewards && pathname.startsWith("/account/rewards")) ||
            (href === ROUTES.account &&
              pathname.startsWith("/account") &&
              !pathname.startsWith("/account/rewards"));
          const count = badge === "cart" ? itemCount : 0;

          return (
            <li key={href} className="relative">
              <Link
                href={href}
                className={cn(
                  "relative flex min-h-[3.25rem] flex-col items-center justify-center gap-1 px-1 py-2.5 text-[9px] font-semibold uppercase tracking-wider transition-all",
                  active ? "text-brand-accent" : "text-brand-muted"
                )}
                aria-current={active ? "page" : undefined}
              >
                {active ? (
                  <motion.span
                    layoutId="mobile-nav-indicator"
                    className="absolute inset-x-3 top-1 h-0.5 rounded-full bg-brand-accent shadow-[0_0_12px_rgba(200,169,110,0.8)]"
                    transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  />
                ) : null}
                <Icon className="h-5 w-5" aria-hidden />
                {label}
                {count > 0 && (
                  <span className="absolute right-1/4 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[9px] font-bold text-brand-black">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
