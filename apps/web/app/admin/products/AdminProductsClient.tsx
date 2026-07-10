"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ProductAiForm, {
  emptyProductForm,
  formFromAnalysis,
  type ProductFormState,
} from "@/components/admin/ProductAiForm";
import ProductImageUploader, {
  type UploadedProductImage,
} from "@/components/admin/ProductImageUploader";
import {
  getSupabaseBrowserClient,
  invokeEdgeFunction,
  type AnalyzeProductImagesResult,
  type AiProductAnalysis,
} from "@jff/api";
import { formatINR } from "@/lib/pricing";
import { slugify } from "@/lib/utils";
import { useRealtimeRefresh } from "@/lib/useRealtimeRefresh";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  selling_price: number;
  mrp: number;
  stock_total: number;
  active: boolean;
  ai_needs_review?: boolean | null;
};

function normalizeAnalysis(raw: AiProductAnalysis | Record<string, unknown>): AiProductAnalysis {
  const a = raw as AiProductAnalysis;
  const specsIn = (a.specifications || {}) as Partial<AiProductAnalysis["specifications"]>;
  const seoIn = (a.seo || {}) as Partial<AiProductAnalysis["seo"]>;
  const confIn = (a.confidence || {}) as Partial<AiProductAnalysis["confidence"]>;

  return {
    productName: String(a.productName || ""),
    shortDescription: String(a.shortDescription || ""),
    longDescription: String(a.longDescription || ""),
    specifications: {
      productType: String(specsIn.productType || ""),
      category: String(specsIn.category || ""),
      color: String(specsIn.color || ""),
      secondaryColor: String(specsIn.secondaryColor || ""),
      pattern: String(specsIn.pattern || ""),
      texture: String(specsIn.texture || ""),
      material: String(specsIn.material || ""),
      soleMaterial: String(specsIn.soleMaterial || ""),
      upperMaterial: String(specsIn.upperMaterial || ""),
      strapMaterial: String(specsIn.strapMaterial || ""),
      closure: String(specsIn.closure || ""),
      toeStyle: String(specsIn.toeStyle || ""),
      heelType: String(specsIn.heelType || ""),
      weight: String(specsIn.weight || ""),
      waterResistant: String(specsIn.waterResistant || ""),
      washable: String(specsIn.washable || ""),
      grip: String(specsIn.grip || ""),
      comfortLevel: String(specsIn.comfortLevel || ""),
      usage: String(specsIn.usage || ""),
      suitableFor: Array.isArray(specsIn.suitableFor) ? specsIn.suitableFor.map(String) : [],
      season: String(specsIn.season || ""),
      gender: String(specsIn.gender || ""),
      finish: String(specsIn.finish || ""),
    },
    features: Array.isArray(a.features) ? a.features.map(String) : [],
    seo: {
      title: String(seoIn.title || ""),
      description: String(seoIn.description || ""),
      keywords: String(seoIn.keywords || ""),
      metaDescription: String(seoIn.metaDescription || ""),
      searchTags: Array.isArray(seoIn.searchTags) ? seoIn.searchTags.map(String) : [],
    },
    tags: Array.isArray(a.tags) ? a.tags.map(String) : [],
    confidence: {
      color: Number(confIn.color || 0),
      material: Number(confIn.material || 0),
      pattern: Number(confIn.pattern || 0),
      productType: Number(confIn.productType || 0),
      comfortCategory: Number(confIn.comfortCategory || 0),
      sole: Number(confIn.sole || 0),
      gender: Number(confIn.gender || 0),
      usage: Number(confIn.usage || 0),
    },
  };
}

export default function AdminProductsClient() {
  const [rows, setRows] = useState<ProductRow[]>([]);
  const [images, setImages] = useState<UploadedProductImage[]>([]);
  const [form, setForm] = useState<ProductFormState>(emptyProductForm);
  const [formVisible, setFormVisible] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [aiRaw, setAiRaw] = useState<unknown>(null);

  const sessionFolder = useMemo(
    () => `drafts/${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  const load = useCallback(async () => {
    const client = getSupabaseBrowserClient();
    if (!client) return;
    const { data } = await client
      .from("catalog_products")
      .select("id,slug,name,selling_price,mrp,stock_total,active,ai_needs_review")
      .order("created_at", { ascending: false })
      .limit(100);
    setRows((data as ProductRow[]) || []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useRealtimeRefresh(["catalog_products", "product_images"], load);

  const analyze = async () => {
    if (!images.length) return;
    setAnalyzing(true);
    setMessage("");

    // Analyze first 3 images only (keeps Gemini under Edge Function limits). All uploads still save.
    const forAi = images.slice(0, 3);
    const { data, error } = await invokeEdgeFunction<AnalyzeProductImagesResult>(
      "analyze-product-images",
      {
        images: forAi.map((i) => ({ mimeType: i.mimeType, data: i.base64 })),
        imageUrls: forAi.map((i) => i.publicUrl),
        hints: form.gender ? { gender: form.gender } : undefined,
      }
    );

    if (error || !data?.analysis) {
      setMessage(error || data?.error || "AI analysis failed");
      setAnalyzing(false);
      return;
    }

    const analysis = normalizeAnalysis(data.analysis);
    setAiRaw(data.raw ?? data.analysis);
    setForm(formFromAnalysis(analysis, Boolean(data.needsReview), data.flagged || [], slugify));
    setFormVisible(true);
    setMessage(
      data.needsReview
        ? "AI filled the form — review highlighted fields before saving."
        : "AI filled the form. Edit anything, then save."
    );
    setAnalyzing(false);
  };

  const saveProduct = async () => {
    const client = getSupabaseBrowserClient();
    if (!client || !form.name.trim() || !form.slug.trim()) return;

    setSaving(true);
    setMessage("");

    const features = form.featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const tags = form.tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const selling = Number(form.sellingPrice) || 120;
    const mrp = Math.max(Number(form.mrp) || selling, selling);

    const { data: product, error } = await client
      .from("catalog_products")
      .insert({
        name: form.name.trim(),
        slug: form.slug.trim().toLowerCase(),
        description: form.shortDescription.trim() || form.longDescription.trim() || null,
        short_description: form.shortDescription.trim() || null,
        long_description: form.longDescription.trim() || null,
        gender: form.gender.trim() || String(form.specifications.gender || "") || null,
        material: form.material.trim() || String(form.specifications.material || "") || null,
        color: form.color.trim() || String(form.specifications.color || "") || null,
        selling_price: selling,
        mrp,
        stock_total: Number(form.stock) || 0,
        active: form.active,
        featured: form.featured,
        new_arrival: form.newArrival,
        features,
        specifications: form.specifications,
        seo: form.seo,
        tags,
        ai_confidence: form.confidence,
        ai_needs_review: form.needsReview,
        ai_raw: aiRaw,
      })
      .select("id")
      .single();

    if (error || !product) {
      setMessage(error?.message || "Failed to save product");
      setSaving(false);
      return;
    }

    if (images.length) {
      const { error: imageError } = await client.from("product_images").insert(
        images.map((img, index) => ({
          product_id: product.id,
          url: img.publicUrl,
          alt: form.name.trim(),
          sort_order: index,
          is_primary: index === 0,
        }))
      );
      if (imageError) {
        setMessage(`Product saved, but images failed: ${imageError.message}`);
        setSaving(false);
        await load();
        return;
      }
    }

    setMessage("Product created");
    setForm(emptyProductForm());
    setFormVisible(false);
    setImages([]);
    setAiRaw(null);
    setSaving(false);
    await load();
  };

  return (
    <AdminShell>
      <h1 className="font-display text-3xl font-semibold">Products</h1>
      <p className="mt-1 text-sm text-brand-muted">
        Upload photos, let AI draft premium product copy, edit anything, then save to Supabase.
        Storefront still uses generated JSON as the public catalog fallback.
      </p>

      <section className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Create with AI</h2>
        <ProductImageUploader
          images={images}
          onChange={setImages}
          onAnalyze={() => void analyze()}
          analyzing={analyzing}
          sessionFolder={sessionFolder}
        />

        {!formVisible && (
          <div className="rounded-[1.5rem] border border-dashed border-black/10 p-5 dark:border-white/15">
            <p className="text-sm text-brand-muted">
              Or start a blank form without AI, then fill fields manually.
            </p>
            <button
              type="button"
              className="mt-3 text-sm font-medium text-brand-accent underline-offset-2 hover:underline"
              onClick={() => {
                setForm(emptyProductForm());
                setFormVisible(true);
              }}
            >
              Open blank product form
            </button>
          </div>
        )}

        {formVisible && (
          <ProductAiForm
            value={form}
            onChange={setForm}
            onSave={() => void saveProduct()}
            saving={saving}
            message={message}
          />
        )}

        {!formVisible && message && <p className="text-sm text-brand-muted">{message}</p>}
      </section>

      <h2 className="mt-10 text-lg font-semibold">Catalog products</h2>
      <ul className="mt-4 space-y-2">
        {rows.length === 0 && (
          <li className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-brand-muted dark:border-white/15">
            No catalog products yet. Run migration 004, deploy the analyze function, then create one
            above.
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
                {p.ai_needs_review ? " · needs review" : ""}
              </p>
            </div>
            <p className="font-semibold">{formatINR(Number(p.selling_price))}</p>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
