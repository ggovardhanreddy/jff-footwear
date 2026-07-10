"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowserClient } from "@jff/api";
import Button from "@/components/ui/Button";
import { useRealtimeRefresh } from "@/lib/useRealtimeRefresh";

type Coupon = {
  id: string;
  code: string;
  label: string;
  type: string;
  discount: number;
  active: boolean;
};

export default function AdminCouponsClient() {
  const [rows, setRows] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [label, setLabel] = useState("");
  const [discount, setDiscount] = useState("10");

  const load = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const { data } = await client
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as Coupon[]) || []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useRealtimeRefresh(["coupons"], load);

  const add = async () => {
    const client = getSupabaseBrowserClient();
    if (!client || !code.trim()) return;
    await client.from("coupons").insert({
      code: code.trim().toUpperCase(),
      label: label.trim() || code,
      type: "percent",
      discount: Number(discount) || 10,
      active: true,
    });
    setCode("");
    setLabel("");
    await load();
  };

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Coupons</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <input
          className="input-field"
          placeholder="CODE"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="% off"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
        <Button type="button" onClick={() => void add()}>
          Add coupon
        </Button>
      </div>
      <ul className="mt-6 space-y-2">
        {rows.map((c) => (
          <li
            key={c.id}
            className="rounded-2xl border border-black/[0.06] bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"
          >
            <span className="font-semibold">{c.code}</span> — {c.label} ({c.type} {c.discount})
            {!c.active && <span className="ml-2 text-xs text-brand-muted">inactive</span>}
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
