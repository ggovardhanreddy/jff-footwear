"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Ticket,
  Users,
  Image as ImageIcon,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { COMPANY, ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const NAV = [
  { href: ROUTES.admin, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.adminProducts, label: "Products", icon: Package },
  { href: ROUTES.adminOrders, label: "Orders", icon: ShoppingBag },
  { href: ROUTES.adminCoupons, label: "Coupons", icon: Ticket },
  { href: ROUTES.adminCustomers, label: "Customers", icon: Users },
  { href: ROUTES.adminBanners, label: "Banners", icon: ImageIcon },
] as const;

const PROMOTE_SQL = `update public.profiles
set role = 'admin'
where email = '${COMPANY.email}';`;

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = profile?.role === "admin";
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`${ROUTES.login}?next=${encodeURIComponent(ROUTES.admin)}`);
    }
  }, [loading, user, router]);

  const copyPromote = async () => {
    try {
      await navigator.clipboard.writeText(PROMOTE_SQL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  if (loading || !user) {
    return (
      <div className="page-shell container-custom py-16">
        <div className="h-40 animate-pulse rounded-[2rem] bg-black/5 dark:bg-white/5" />
        <p className="mt-4 text-center text-sm text-brand-muted">Checking admin access…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="page-shell container-custom max-w-xl py-16">
        <h1 className="font-display text-3xl font-semibold">Admin access needed</h1>
        <p className="mt-3 text-sm text-brand-muted">
          Signed in as{" "}
          <span className="font-medium text-brand-black dark:text-white">{user.email}</span>, but
          this account is not an admin yet. Run this once in the Supabase SQL Editor, then refresh:
        </p>
        <pre className="mt-4 overflow-x-auto rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-xs dark:border-white/10 dark:bg-white/5">
          {PROMOTE_SQL}
        </pre>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyPromote()}
            className="inline-flex items-center gap-2 rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-black"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy SQL"}
          </button>
          <a
            href="https://supabase.com/dashboard/project/paklcbkldoocuaxuavxn/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold dark:border-white/15"
          >
            Open SQL Editor
          </a>
          <Link
            href={ROUTES.account}
            className="inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-brand-muted"
          >
            Back to account
          </Link>
        </div>
        <p className="mt-4 text-xs text-brand-muted">
          Use the same email you signed in with. After Run succeeds, reload this page.
        </p>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container-custom grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-[1.5rem] border border-black/[0.06] bg-white/70 p-4 backdrop-blur dark:border-white/10 dark:bg-white/5">
          <p className="px-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            JFF Admin
          </p>
          <nav className="mt-4 space-y-1" aria-label="Admin">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active =
                href === ROUTES.admin
                  ? pathname === href || pathname === `${href}/`
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "bg-brand-black text-white dark:bg-white dark:text-brand-black"
                      : "text-brand-muted hover:bg-black/5 dark:hover:bg-white/5"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <Link
            href={ROUTES.home}
            className="mt-6 flex items-center gap-2 px-3 text-xs font-semibold text-brand-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to store
          </Link>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
