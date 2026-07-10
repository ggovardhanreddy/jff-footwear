"use client";

import type { ReactNode } from "react";
import type {
  AiConfidenceMap,
  AiProductAnalysis,
  ProductSeo,
  ProductSpecifications,
} from "@jff/api";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ProductFormState = {
  name: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  sellingPrice: string;
  mrp: string;
  stock: string;
  gender: string;
  color: string;
  material: string;
  active: boolean;
  featured: boolean;
  newArrival: boolean;
  featuresText: string;
  tagsText: string;
  specifications: ProductSpecifications;
  seo: ProductSeo;
  confidence: AiConfidenceMap;
  needsReview: boolean;
  flagged: string[];
};

export function emptyProductForm(): ProductFormState {
  return {
    name: "",
    slug: "",
    shortDescription: "",
    longDescription: "",
    sellingPrice: "120",
    mrp: "299",
    stock: "50",
    gender: "",
    color: "",
    material: "",
    active: true,
    featured: false,
    newArrival: true,
    featuresText: "",
    tagsText: "",
    specifications: {
      productType: "",
      category: "",
      color: "",
      secondaryColor: "",
      pattern: "",
      texture: "",
      material: "",
      soleMaterial: "",
      upperMaterial: "",
      strapMaterial: "",
      closure: "",
      toeStyle: "",
      heelType: "",
      weight: "",
      waterResistant: "",
      washable: "",
      grip: "",
      comfortLevel: "",
      usage: "",
      suitableFor: [],
      season: "",
      gender: "",
      finish: "",
    },
    seo: {
      title: "",
      description: "",
      keywords: "",
      metaDescription: "",
      searchTags: [],
    },
    confidence: {
      color: 0,
      material: 0,
      pattern: 0,
      productType: 0,
      comfortCategory: 0,
      sole: 0,
      gender: 0,
      usage: 0,
    },
    needsReview: false,
    flagged: [],
  };
}

export function formFromAnalysis(
  analysis: AiProductAnalysis,
  needsReview: boolean,
  flagged: string[],
  slugify: (text: string) => string
): ProductFormState {
  const specs = {
    ...emptyProductForm().specifications,
    ...(analysis.specifications || {}),
    suitableFor: Array.isArray(analysis.specifications?.suitableFor)
      ? analysis.specifications.suitableFor
      : [],
  };
  const seo = {
    ...emptyProductForm().seo,
    ...(analysis.seo || {}),
    searchTags: Array.isArray(analysis.seo?.searchTags) ? analysis.seo.searchTags : [],
  };
  const name = analysis.productName || "";
  return {
    ...emptyProductForm(),
    name,
    slug: slugify(name),
    shortDescription: analysis.shortDescription || "",
    longDescription: analysis.longDescription || "",
    gender: String(specs.gender || ""),
    color: String(specs.color || ""),
    material: String(specs.material || ""),
    featuresText: (analysis.features || []).join("\n"),
    tagsText: (analysis.tags || []).join(", "),
    specifications: specs,
    seo,
    confidence: {
      ...emptyProductForm().confidence,
      ...(analysis.confidence || {}),
    },
    needsReview,
    flagged,
  };
}

type Props = {
  value: ProductFormState;
  onChange: (next: ProductFormState) => void;
  onSave: () => void;
  saving: boolean;
  message?: string;
};

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-xs font-medium uppercase tracking-wide text-brand-muted">{label}</span>
      {children}
    </label>
  );
}

const SPEC_KEYS: Array<{ key: keyof ProductSpecifications; label: string }> = [
  { key: "productType", label: "Product type" },
  { key: "category", label: "Category" },
  { key: "color", label: "Color" },
  { key: "secondaryColor", label: "Secondary color" },
  { key: "pattern", label: "Pattern" },
  { key: "texture", label: "Texture" },
  { key: "material", label: "Material" },
  { key: "soleMaterial", label: "Sole material" },
  { key: "upperMaterial", label: "Upper material" },
  { key: "strapMaterial", label: "Strap material" },
  { key: "closure", label: "Closure" },
  { key: "toeStyle", label: "Toe style" },
  { key: "heelType", label: "Heel type" },
  { key: "weight", label: "Weight" },
  { key: "waterResistant", label: "Water resistant" },
  { key: "washable", label: "Washable" },
  { key: "grip", label: "Grip" },
  { key: "comfortLevel", label: "Comfort level" },
  { key: "usage", label: "Usage" },
  { key: "season", label: "Season" },
  { key: "gender", label: "Gender" },
  { key: "finish", label: "Finish" },
];

export default function ProductAiForm({ value, onChange, onSave, saving, message }: Props) {
  const set = <K extends keyof ProductFormState>(key: K, next: ProductFormState[K]) =>
    onChange({ ...value, [key]: next });

  const setSpec = (key: keyof ProductSpecifications, next: string) => {
    onChange({
      ...value,
      specifications: { ...value.specifications, [key]: next },
      ...(key === "color" ? { color: next } : {}),
      ...(key === "material" ? { material: next } : {}),
      ...(key === "gender" ? { gender: next } : {}),
    });
  };

  const confidenceEntries = Object.entries(value.confidence || {});

  return (
    <div className="space-y-6 rounded-[1.5rem] border border-black/[0.06] bg-white/70 p-5 dark:border-white/10 dark:bg-white/5">
      {(value.needsReview || value.flagged.length > 0) && (
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
          Some attributes need manual review
          {value.flagged.length > 0 ? `: ${value.flagged.join(", ")}` : ""}. Edit before saving.
        </div>
      )}

      {confidenceEntries.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold">AI confidence</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {confidenceEntries.map(([key, score]) => {
              const low = Number(score) < 70;
              return (
                <span
                  key={key}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    low
                      ? "bg-amber-500/20 text-amber-900 dark:text-amber-100"
                      : "bg-emerald-500/15 text-emerald-900 dark:text-emerald-100"
                  )}
                >
                  {key}: {low ? "Needs Manual Review" : `${score}%`}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Product name" className="md:col-span-2">
          <input
            className="input-field w-full"
            value={value.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Blue Wave Comfort Slide Slippers"
          />
        </Field>
        <Field label="Slug">
          <input
            className="input-field w-full"
            value={value.slug}
            onChange={(e) => set("slug", e.target.value)}
          />
        </Field>
        <Field label="Gender">
          <input
            className="input-field w-full"
            value={value.gender}
            onChange={(e) => set("gender", e.target.value)}
          />
        </Field>
        <Field label="Selling price (₹)">
          <input
            className="input-field w-full"
            value={value.sellingPrice}
            onChange={(e) => set("sellingPrice", e.target.value)}
          />
        </Field>
        <Field label="MRP (₹)">
          <input
            className="input-field w-full"
            value={value.mrp}
            onChange={(e) => set("mrp", e.target.value)}
          />
        </Field>
        <Field label="Stock">
          <input
            className="input-field w-full"
            value={value.stock}
            onChange={(e) => set("stock", e.target.value)}
          />
        </Field>
        <Field label="Color">
          <input
            className="input-field w-full"
            value={value.color}
            onChange={(e) => set("color", e.target.value)}
          />
        </Field>
        <Field label="Material">
          <input
            className="input-field w-full"
            value={value.material}
            onChange={(e) => set("material", e.target.value)}
          />
        </Field>
      </div>

      <Field label="Short description">
        <textarea
          className="input-field min-h-[88px] w-full resize-y"
          value={value.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
        />
      </Field>

      <Field label="Long description">
        <textarea
          className="input-field min-h-[180px] w-full resize-y"
          value={value.longDescription}
          onChange={(e) => set("longDescription", e.target.value)}
        />
      </Field>

      <div>
        <h3 className="mb-3 text-sm font-semibold">Specifications</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {SPEC_KEYS.map(({ key, label }) => {
            const raw = value.specifications[key];
            const display = Array.isArray(raw) ? raw.join(", ") : String(raw || "");
            const needsReview = display === "Needs Manual Review";
            return (
              <Field key={key} label={label}>
                <input
                  className={cn(
                    "input-field w-full",
                    needsReview && "border-amber-500/50 focus:border-amber-500"
                  )}
                  value={display}
                  onChange={(e) => setSpec(key, e.target.value)}
                />
              </Field>
            );
          })}
          <Field label="Suitable for (comma-separated)" className="md:col-span-2">
            <input
              className="input-field w-full"
              value={(value.specifications.suitableFor || []).join(", ")}
              onChange={(e) =>
                onChange({
                  ...value,
                  specifications: {
                    ...value.specifications,
                    suitableFor: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                })
              }
            />
          </Field>
        </div>
      </div>

      <Field label="Features (one per line)">
        <textarea
          className="input-field min-h-[140px] w-full resize-y"
          value={value.featuresText}
          onChange={(e) => set("featuresText", e.target.value)}
        />
      </Field>

      <div>
        <h3 className="mb-3 text-sm font-semibold">SEO</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="SEO title" className="md:col-span-2">
            <input
              className="input-field w-full"
              value={value.seo.title}
              onChange={(e) => set("seo", { ...value.seo, title: e.target.value })}
            />
          </Field>
          <Field label="SEO description" className="md:col-span-2">
            <textarea
              className="input-field min-h-[72px] w-full resize-y"
              value={value.seo.description}
              onChange={(e) => set("seo", { ...value.seo, description: e.target.value })}
            />
          </Field>
          <Field label="Meta description" className="md:col-span-2">
            <textarea
              className="input-field min-h-[72px] w-full resize-y"
              value={value.seo.metaDescription}
              onChange={(e) => set("seo", { ...value.seo, metaDescription: e.target.value })}
            />
          </Field>
          <Field label="Keywords">
            <input
              className="input-field w-full"
              value={value.seo.keywords}
              onChange={(e) => set("seo", { ...value.seo, keywords: e.target.value })}
            />
          </Field>
          <Field label="Search tags (comma-separated)">
            <input
              className="input-field w-full"
              value={(value.seo.searchTags || []).join(", ")}
              onChange={(e) =>
                set("seo", {
                  ...value.seo,
                  searchTags: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </Field>
        </div>
      </div>

      <Field label="Tags (comma-separated)">
        <input
          className="input-field w-full"
          value={value.tagsText}
          onChange={(e) => set("tagsText", e.target.value)}
        />
      </Field>

      <div className="flex flex-wrap gap-4 text-sm">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.active}
            onChange={(e) => set("active", e.target.checked)}
          />
          Active
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          Featured
        </label>
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={value.newArrival}
            onChange={(e) => set("newArrival", e.target.checked)}
          />
          New arrival
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          onClick={onSave}
          disabled={saving || !value.name.trim() || !value.slug.trim()}
        >
          {saving ? "Saving…" : "Save product"}
        </Button>
        {message && <p className="text-sm text-brand-muted">{message}</p>}
      </div>
    </div>
  );
}
