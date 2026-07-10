"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowserClient } from "@jff/api";
import { ROUTES } from "@/lib/constants";
import { formatINR } from "@/lib/pricing";

export default function AdminDashboardClient() {
  const [stats, setStats] = useState({
    orders: 0,
    products: 0,
    customers: 0,
    revenue: 0,
  });

  useEffect(() => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    void (async () => {
      const [orders, products, customers] = await Promise.all([
        client.from("orders").select("grand_total", { count: "exact" }),
        client.from("catalog_products").select("id", { count: "exact", head: true }),
        client.from("profiles").select("id", { count: "exact", head: true }),
      ]);
      const revenue = (orders.data || []).reduce((s, o) => s + Number(o.grand_total || 0), 0);
      setStats({
        orders: orders.count ?? 0,
        products: products.count ?? 0,
        customers: customers.count ?? 0,
        revenue,
      });
    })();
  }, []);

  const cards = [
    { label: "Orders", value: String(stats.orders), href: ROUTES.adminOrders },
    {
      label: "Revenue",
      value: formatINR(stats.revenue),
      href: ROUTES.adminOrders,
    },
    {
      label: "Products",
      value: String(stats.products),
      href: ROUTES.adminProducts,
    },
    {
      label: "Customers",
      value: String(stats.customers),
      href: ROUTES.adminCustomers,
    },
  ];

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-brand-muted">Manage JFF catalog, orders, and rewards.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-[1.5rem] border border-black/[0.06] bg-white/70 p-5 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
              {c.label}
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">{c.value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-8 rounded-[1.5rem] border border-dashed border-black/10 p-6 text-sm text-brand-muted dark:border-white/15">
        Tip: After running migration <code>002_catalog_admin.sql</code>, promote your user with SQL:{" "}
        <code className="text-xs">
          update profiles set role = &apos;admin&apos; where email = &apos;you@email.com&apos;;
        </code>
      </div>
    </AdminShell>
  );
}
