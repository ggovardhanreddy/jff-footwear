"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Grid3X3, Heart } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: ROUTES.home, label: "Home", icon: Home },
  { href: ROUTES.products, label: "Shop", icon: Grid3X3 },
  { href: ROUTES.cart, label: "Cart", icon: ShoppingBag, badge: "cart" as const },
  { href: ROUTES.wishlist, label: "Wishlist", icon: Heart, badge: "wishlist" as const },
];

export default function MobileShopNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const hideOnCheckout = pathname === ROUTES.checkout;
  if (hideOnCheckout) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      aria-label="Shop navigation"
    >
      <ul className="grid grid-cols-4">
        {LINKS.map(({ href, label, icon: Icon, badge }) => {
          const active =
            pathname === href ||
            (href === ROUTES.products && pathname.startsWith("/products"));
          const count =
            badge === "cart" ? itemCount : badge === "wishlist" ? wishlistCount : 0;

          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-1 px-2 py-3 text-[10px] font-semibold uppercase tracking-wider transition-colors",
                  active ? "text-brand-accent" : "text-brand-muted"
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {label}
                {count > 0 && (
                  <span className="absolute right-1/4 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[9px] font-bold text-white">
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
