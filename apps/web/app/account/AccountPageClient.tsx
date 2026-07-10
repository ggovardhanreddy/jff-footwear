"use client";

import Link from "next/link";
import {
  Bell,
  Coins,
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  Moon,
  Package,
  RotateCcw,
  Settings,
  Languages,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { ROUTES } from "@/lib/constants";
import { formatCoins, getCoinLevel } from "@jff/api/coins";

const LINKS = [
  { href: ROUTES.accountOrders, label: "Orders", icon: Package },
  { href: ROUTES.accountRewards, label: "Rewards", icon: Coins },
  { href: ROUTES.wishlist, label: "Wishlist", icon: Heart },
  { href: ROUTES.accountAddresses, label: "Saved Addresses", icon: MapPin },
  { href: ROUTES.notifications, label: "Notifications", icon: Bell },
  { href: ROUTES.returns, label: "Returns", icon: RotateCcw },
  { href: ROUTES.contact, label: "Support", icon: HelpCircle },
  { href: ROUTES.faq, label: "Help Center", icon: Settings },
] as const;

export default function AccountPageClient() {
  const { user, profile, coinBalance, signOut, loading, configured } = useAuth();
  const { theme, setTheme } = useTheme();
  const { locale, setLocale } = useLanguage();
  const level = getCoinLevel(coinBalance);

  if (loading) {
    return (
      <div className="page-shell container-custom py-16">
        <div className="h-40 animate-pulse rounded-[2rem] bg-black/5 dark:bg-white/5" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell">
        <div className="container-custom max-w-lg py-16 text-center">
          <h1 className="font-display text-3xl font-semibold">Your JFF Account</h1>
          <p className="mt-3 text-brand-muted">
            Sign in to view orders, redeem JFF Coins, and sync your wishlist.
          </p>
          <Link
            href={ROUTES.login}
            className="mt-8 inline-flex rounded-full bg-brand-accent px-7 py-3.5 text-sm font-semibold text-brand-black"
          >
            Sign in
          </Link>
          {!configured && (
            <p className="mt-4 text-xs text-brand-muted">
              Sign-in is temporarily unavailable. You can still shop and order via WhatsApp.
            </p>
          )}
        </div>
      </div>
    );
  }

  const name = profile?.full_name || user.email;

  return (
    <div className="page-shell">
      <div className="container-custom space-y-8 py-10 md:py-14">
        <div className="rounded-[2rem] border border-white/50 bg-gradient-to-br from-brand-black to-zinc-800 p-8 text-white shadow-xl dark:border-white/10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            {level.name} member
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Hi, {name}</h1>
          <p className="mt-3 flex items-center gap-2 text-brand-accent">
            <Coins className="h-5 w-5" />
            {formatCoins(coinBalance)} JFF Coins
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white/70 px-5 py-4 backdrop-blur transition hover:-translate-y-0.5 hover:border-brand-accent/40 dark:border-white/10 dark:bg-white/5"
            >
              <Icon className="h-5 w-5 text-brand-accent" />
              <span className="font-medium">{label}</span>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5 text-brand-accent" />
              <span className="font-medium">Language</span>
            </div>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as "en" | "hi" | "te")}
              className="input-field !w-auto !py-2 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
            </select>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.05] pt-4 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-brand-accent" />
              <span className="font-medium">Appearance</span>
            </div>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                    theme === t
                      ? "bg-brand-black text-white dark:bg-white dark:text-brand-black"
                      : "border border-black/10 dark:border-white/15"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void signOut()}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-3.5 text-sm font-semibold text-red-600 dark:border-red-900/50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
