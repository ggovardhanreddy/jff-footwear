"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowserClient, type Profile } from "@jff/api";

export default function AdminCustomersClient() {
  const [rows, setRows] = useState<Profile[]>([]);

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    void client
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => setRows((data as Profile[]) || []));
  }, []);

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Customers</h1>
      <ul className="mt-6 space-y-2">
        {rows.map((p) => (
          <li
            key={p.id}
            className="rounded-2xl border border-black/[0.06] bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"
          >
            <p className="font-medium">{p.full_name || p.email || p.id}</p>
            <p className="text-xs text-brand-muted">
              {p.email} · role {p.role || "customer"}
              {p.is_wholesale ? " · wholesale" : ""}
            </p>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
