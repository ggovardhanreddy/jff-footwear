"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient, type AddressRow } from "@jff/api";
import { ROUTES } from "@/lib/constants";

export default function AddressesPageClient() {
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState<AddressRow[]>([]);

  useEffect(() => {
    if (!user) return;
    const client = getSupabaseBrowserClient();
    if (!client) return;
    void client
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setAddresses((data as AddressRow[]) || []));
  }, [user]);

  if (loading) {
    return (
      <div className="page-shell container-custom py-16">
        <div className="h-32 animate-pulse rounded-[2rem] bg-black/5" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell container-custom max-w-lg py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">Addresses</h1>
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
      <div className="container-custom space-y-6 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-3xl font-semibold">Saved Addresses</h1>
          <Link
            href={ROUTES.checkout}
            className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest dark:border-white/15"
          >
            Add at checkout
          </Link>
        </div>
        {addresses.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-black/10 p-8 text-sm text-brand-muted dark:border-white/15">
            No saved addresses yet. Addresses you use at checkout will appear here when signed in.
          </p>
        ) : (
          <ul className="grid gap-3 md:grid-cols-2">
            {addresses.map((a) => (
              <li
                key={a.id}
                className="rounded-2xl border border-black/[0.06] bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">
                  {a.label || "Address"}
                  {a.is_default ? " · Default" : ""}
                </p>
                <p className="mt-2 font-medium">{a.full_name}</p>
                <p className="text-sm text-brand-muted">
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ""}
                  <br />
                  {a.city}, {a.state} {a.pincode}
                  <br />
                  {a.phone}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
