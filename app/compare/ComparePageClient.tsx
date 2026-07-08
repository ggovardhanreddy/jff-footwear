"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Scale, Trash2 } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import ButtonLink from "@/components/ui/ButtonLink";
import AssetImage from "@/components/ui/AssetImage";
import EmptyState from "@/components/ui/EmptyState";
import { useCompare } from "@/context/CompareContext";
import { products } from "@/data";
import { formatINR } from "@/lib/pricing";
import { getProductPricing } from "@/lib/pricing";
import { getProductMainImage } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

export default function ComparePageClient() {
  const { slugs, remove, clear } = useCompare();

  const compared = useMemo(
    () =>
      slugs
        .map((slug) => products.find((p) => p.slug === slug))
        .filter(Boolean) as typeof products,
    [slugs]
  );

  const attributes = [
    "category",
    "gender",
    "material",
    "color",
    "sizes",
  ] as const;

  return (
    <PageShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Compare", href: ROUTES.compare },
        ]}
      />
      <PageHeader
        eyebrow="Side by Side"
        title="Compare Products"
        description={
          compared.length > 0
            ? `${compared.length} of 4 products selected`
            : undefined
        }
        actions={
          compared.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="focus-ring text-sm font-semibold text-red-600 hover:underline"
            >
              Clear all
            </button>
          ) : undefined
        }
      />

      {compared.length === 0 ? (
        <EmptyState
          icon={Scale}
          title="No products to compare"
          description="Add products from any product page to compare features side by side."
          actionLabel="Browse Products"
          actionHref={ROUTES.products}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr>
                <th className="p-4 text-left font-semibold text-brand-muted">
                  Feature
                </th>
                {compared.map((product) => (
                  <th key={product.id} className="p-4 align-top">
                    <div className="relative mx-auto w-32">
                      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-cream">
                        <AssetImage
                          src={getProductMainImage(product)}
                          alt={product.name}
                          fill
                          className="object-contain p-2"
                          sizes="128px"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(product.slug)}
                        className="focus-ring absolute -right-2 -top-2 rounded-full bg-white p-1.5 shadow-md"
                        aria-label={`Remove ${product.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-red-500" />
                      </button>
                    </div>
                    <Link
                      href={ROUTES.product(product.slug)}
                      className="focus-ring mt-3 block font-display font-semibold hover:text-brand-accent"
                    >
                      {product.name}
                    </Link>
                    <p className="mt-1 font-bold text-brand-accent">
                      {formatINR(getProductPricing(product).sellingPrice)}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr} className="border-t border-black/[0.06]">
                  <td className="p-4 font-medium capitalize text-brand-muted">
                    {attr === "sizes" ? "Sizes" : attr}
                  </td>
                  {compared.map((product) => (
                    <td key={product.id} className="p-4 text-center">
                      {attr === "sizes"
                        ? product.sizes.join(", ")
                        : String(product[attr])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8">
            <ButtonLink href={ROUTES.products} variant="outline">
              Add More Products
            </ButtonLink>
          </div>
        </div>
      )}
    </PageShell>
  );
}
