"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import type { NotificationRow } from "@jff/api";

const CATEGORIES = ["all", "offers", "orders", "rewards", "recommendations", "restock"] as const;

export default function NotificationsPageClient() {
  const { user, notifications, markNotificationRead, loading, refreshNotifications } = useAuth();
  const [filter, setFilter] = useState<(typeof CATEGORIES)[number]>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return notifications;
    return notifications.filter((n) => n.category === filter);
  }, [notifications, filter]);

  if (loading) {
    return (
      <div className="page-shell container-custom py-16">
        <div className="h-40 animate-pulse rounded-[2rem] bg-black/5" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell container-custom max-w-lg py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">Notifications</h1>
        <p className="mt-3 text-brand-muted">
          Sign in to see offers, order updates, and reward alerts.
        </p>
        <Link
          href={ROUTES.login}
          className="mt-6 inline-flex rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-black"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container-custom space-y-6 py-10 md:py-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold">Notifications</h1>
          <button
            type="button"
            onClick={() => void refreshNotifications()}
            className="text-xs font-semibold uppercase tracking-widest text-brand-accent"
          >
            Refresh
          </button>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold capitalize ${
                filter === cat
                  ? "bg-brand-black text-white dark:bg-white dark:text-brand-black"
                  : "border border-black/10 dark:border-white/15"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {filtered.length === 0 && (
            <li className="rounded-2xl border border-dashed border-black/10 p-8 text-sm text-brand-muted dark:border-white/15">
              You&apos;re all caught up.
            </li>
          )}
          {filtered.map((n: NotificationRow) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => void markNotificationRead(n.id)}
                className={`w-full rounded-2xl border px-5 py-4 text-left transition ${
                  n.read
                    ? "border-black/[0.04] bg-transparent opacity-70"
                    : "border-brand-accent/30 bg-brand-accent/5"
                }`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-accent">
                  {n.category}
                </p>
                <p className="mt-1 font-medium">{n.title}</p>
                <p className="mt-1 text-sm text-brand-muted">{n.body}</p>
                {n.href && (
                  <Link
                    href={n.href}
                    className="mt-2 inline-block text-xs font-semibold text-brand-accent"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open →
                  </Link>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
