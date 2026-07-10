"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowserClient, type OrderRow } from "@jff/api";
import { formatINR } from "@/lib/pricing";

const STATUSES = [
  "pending",
  "confirmed",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "whatsapp",
] as const;

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<OrderRow[]>([]);

  const load = async () => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const { data } = await client
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    setOrders((data as OrderRow[]) || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    await client
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    await client.from("order_events").insert({ order_id: id, status });
    await load();
  };

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Orders</h1>
      <ul className="mt-6 space-y-3">
        {orders.length === 0 && (
          <li className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-brand-muted dark:border-white/15">
            No orders yet.
          </li>
        )}
        {orders.map((o) => (
          <li
            key={o.id}
            className="rounded-2xl border border-black/[0.06] bg-white/70 p-4 dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">{o.order_number}</p>
                <p className="text-xs text-brand-muted">
                  {new Date(o.created_at).toLocaleString("en-IN")} · {o.payment_method}
                </p>
              </div>
              <p className="font-display text-xl font-semibold">
                {formatINR(Number(o.grand_total))}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => void updateStatus(o.id, s)}
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                    o.status === s
                      ? "bg-brand-accent text-brand-black"
                      : "border border-black/10 dark:border-white/15"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
