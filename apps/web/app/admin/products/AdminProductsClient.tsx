"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowserClient } from "@jff/api";
import { formatINR } from "@/lib/pricing";
import Button from "@/components/ui/Button";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  selling_price: number;
  mrp: number;
  stock_total: number;
  active: boolean;
};

export default function AdminProductsClient() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState("120");
  const [message, setMessage] = useState("");

  const load = async () => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const { data } = await client
      .from("catalog_products")
      .select("id,slug,name,selling_price,mrp,stock_total,active")
      .order("created_at", { ascending: false })
      .limit(100);
    setRows((data as ProductRow[]) || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const createProduct = async () => {
    const client = getSupabaseBrowserClient();
    if (!client || !name.trim() || !slug.trim()) return;
    const { error } = await client.from("catalog_products").insert({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      selling_price: Number(price) || 120,
      mrp: Math.max(Number(price) || 120, 299),
      stock_total: 50,
      active: true,
    });
    if (error) setMessage(error.message);
    else {
      setMessage("Product created");
      setName("");
      setSlug("");
      await load();
    }
  };

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Products</h1>
      <p className="mt-1 text-sm text-brand-muted">
        Manage catalog products in Supabase (storefront still uses generated JSON as fallback).
      </p>

      <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-black/[0.06] bg-white/70 p-5 dark:border-white/10 dark:bg-white/5 md:grid-cols-4">
        <input
          className="input-field"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Button type="button" onClick={() => void createProduct()}>
          Add product
        </Button>
      </div>
      {message && <p className="mt-2 text-sm text-brand-muted">{message}</p>}

      <ul className="mt-6 space-y-2">
        {rows.length === 0 && (
          <li className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-brand-muted dark:border-white/15">
            No catalog products yet. Run migration 002, then add products here.
          </li>
        )}
        {rows.map((p) => (
          <li
            key={p.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-brand-muted">
                {p.slug} · stock {p.stock_total} · {p.active ? "active" : "hidden"}
              </p>
            </div>
            <p className="font-semibold">{formatINR(Number(p.selling_price))}</p>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
