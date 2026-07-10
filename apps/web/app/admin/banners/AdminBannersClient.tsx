"use client";

import { useEffect, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowserClient } from "@jff/api";
import Button from "@/components/ui/Button";

type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  href: string | null;
  active: boolean;
};

export default function AdminBannersClient() {
  const [rows, setRows] = useState<Banner[]>([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [href, setHref] = useState("/products/");

  const load = async () => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const { data } = await client.from("banners").select("*").order("sort_order");
    setRows((data as Banner[]) || []);
  };

  useEffect(() => {
    void load();
  }, []);

  const add = async () => {
    const client = getSupabaseBrowserClient();
    if (!client || !title.trim()) return;
    await client.from("banners").insert({
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      href: href.trim() || null,
      active: true,
    });
    setTitle("");
    setSubtitle("");
    await load();
  };

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Banners</h1>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <input
          className="input-field"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Link"
          value={href}
          onChange={(e) => setHref(e.target.value)}
        />
        <Button type="button" onClick={() => void add()}>
          Add banner
        </Button>
      </div>
      <ul className="mt-6 space-y-2">
        {rows.map((b) => (
          <li
            key={b.id}
            className="rounded-2xl border border-black/[0.06] bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"
          >
            <p className="font-medium">{b.title}</p>
            <p className="text-xs text-brand-muted">
              {b.subtitle} · {b.href}
            </p>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
