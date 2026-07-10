"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, RotateCcw, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getSupabaseBrowserClient, type OrderRow } from "@jff/api";
import { ROUTES } from "@/lib/constants";
import { formatINR } from "@/lib/pricing";

export default function OrdersPageClient() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");

  const load = async () => {
    if (!user) {
      setFetching(false);
      return;
    }
    const client = getSupabaseBrowserClient();
    if (!client) {
      setFetching(false);
      return;
    }
    const { data } = await client
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    setOrders((data as OrderRow[]) || []);
    setFetching(false);
  };

  useEffect(() => {
    void load();
  }, [user]);

  const cancelOrder = async (order: OrderRow) => {
    if (!["pending", "confirmed", "whatsapp"].includes(order.status)) {
      setMessage("This order can no longer be cancelled.");
      return;
    }
    const client = getSupabaseBrowserClient();
    if (!client) return;
    await client
      .from("orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", order.id);
    await client.from("order_events").insert({
      order_id: order.id,
      status: "cancelled",
      note: "Cancelled by customer",
    });
    setMessage(`Order ${order.order_number} cancelled.`);
    await load();
  };

  const downloadInvoice = (order: OrderRow) => {
    const html = `<!DOCTYPE html><html><head><title>Invoice ${order.order_number}</title>
      <style>body{font-family:system-ui;padding:40px;color:#0a0a0a}h1{font-size:24px}
      table{width:100%;border-collapse:collapse;margin-top:24px}td,th{border-bottom:1px solid #eee;padding:8px;text-align:left}</style></head>
      <body><h1>JFF Footwear — Invoice</h1>
      <p><strong>${order.order_number}</strong><br/>${new Date(order.created_at).toLocaleString("en-IN")}</p>
      <p>Status: ${order.status} · Payment: ${order.payment_method}</p>
      <table><tr><th>Description</th><th>Amount</th></tr>
      <tr><td>Subtotal</td><td>₹${order.subtotal}</td></tr>
      <tr><td>Discount</td><td>−₹${order.discount}</td></tr>
      <tr><td>Delivery</td><td>₹${order.delivery_charge}</td></tr>
      <tr><td>Platform fee</td><td>₹${order.platform_fee}</td></tr>
      <tr><td>Coins redeemed</td><td>${order.coins_redeemed}</td></tr>
      <tr><td><strong>Grand total</strong></td><td><strong>₹${order.grand_total}</strong></td></tr>
      </table><p style="margin-top:32px;color:#666">Thank you for shopping with JFF.</p></body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${order.order_number}-invoice.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading || fetching) {
    return (
      <div className="page-shell container-custom py-16">
        <div className="h-40 animate-pulse rounded-[2rem] bg-black/5" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell container-custom max-w-lg py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">Orders</h1>
        <p className="mt-3 text-brand-muted">Sign in to view order history.</p>
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
        <h1 className="font-display text-3xl font-semibold">Your Orders</h1>
        {message && <p className="text-sm text-brand-accent">{message}</p>}
        {orders.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-black/10 p-10 text-center dark:border-white/15">
            <p className="text-brand-muted">No orders yet.</p>
            <Link
              href={ROUTES.products}
              className="mt-4 inline-block text-sm font-semibold text-brand-accent"
            >
              Start shopping →
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-black/[0.06] bg-white/70 p-5 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{order.order_number}</p>
                    <p className="text-xs text-brand-muted">
                      {new Date(order.created_at).toLocaleString("en-IN")} ·{" "}
                      <span className="capitalize">{order.status}</span> · {order.payment_method}
                    </p>
                    <div className="mt-3 flex gap-1">
                      {["pending", "confirmed", "paid", "shipped", "delivered"].map((s, i, arr) => {
                        const idx = arr.indexOf(
                          ["cancelled", "whatsapp"].includes(order.status)
                            ? "pending"
                            : order.status
                        );
                        const done = i <= Math.max(0, idx);
                        return (
                          <span
                            key={s}
                            className={`h-1.5 flex-1 rounded-full ${
                              done ? "bg-brand-accent" : "bg-black/10 dark:bg-white/10"
                            }`}
                            title={s}
                          />
                        );
                      })}
                    </div>
                  </div>
                  <p className="font-display text-xl font-semibold">
                    {formatINR(Number(order.grand_total))}
                  </p>
                </div>
                {order.coins_earned > 0 && (
                  <p className="mt-2 text-xs text-brand-accent">
                    +{order.coins_earned} JFF Coins earned
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => downloadInvoice(order)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold dark:border-white/15"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Invoice
                  </button>
                  <Link
                    href={ROUTES.products}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold dark:border-white/15"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reorder
                  </Link>
                  {["pending", "confirmed", "whatsapp"].includes(order.status) && (
                    <button
                      type="button"
                      onClick={() => void cancelOrder(order)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 dark:border-red-900/40"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                  )}
                  <Link
                    href={ROUTES.returns}
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold dark:border-white/15"
                  >
                    Return request
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
