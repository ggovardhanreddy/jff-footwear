import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { PageHero } from "@/components/site";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { CatalogDownloadCard } from "@/components/business";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/data";
import { CATALOG_HEADERS } from "@/lib/catalog";
import { formatINR, getProductPricing } from "@/lib/pricing";
import { getWholesaleUnitPrice } from "@jff/utils/wholesale";
import { CATALOG_PATHS } from "@jff/config/wholesale-config";

export const metadata = createMetadata({
  title: "Product Catalog Download",
  description:
    "Download the JFF Footwear product catalog with SKU, pricing, sizes, and wholesale rates for retailers and distributors.",
  path: "/catalog",
});

export default function CatalogPage() {
  const preview = products.slice(0, 12);

  return (
    <PageShell ambient="cream">
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Catalog", path: "/catalog" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Catalog", href: "/catalog" },
        ]}
      />

      <PageHero
        eyebrow="B2B Resources"
        title="Product Catalog"
        description="Browse and download our full range with indicative wholesale and distributor pricing for business buyers."
        className="mb-14"
      />

      <ScrollReveal>
        <CatalogDownloadCard productCount={products.length} className="mb-16" />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <div className="overflow-x-auto rounded-[24px] border border-black/[0.06] bg-white shadow-soft dark:border-white/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.06] bg-black/[0.02]">
                {CATALOG_HEADERS.map((header) => (
                  <th key={header} className="px-4 py-3 font-semibold whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {preview.map((product) => {
                const pricing = getProductPricing(product);
                const wholesale = getWholesaleUnitPrice(pricing.sellingPrice, "wholesale");
                const distributor = getWholesaleUnitPrice(
                  pricing.sellingPrice,
                  "distributor"
                );
                return (
                  <tr
                    key={product.id}
                    className="border-b border-black/[0.04] last:border-0 dark:border-white/5"
                  >
                    <td className="px-4 py-3 font-mono text-xs">{product.slug}</td>
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.category}</td>
                    <td className="px-4 py-3">{product.gender}</td>
                    <td className="px-4 py-3">{product.material}</td>
                    <td className="px-4 py-3">{product.color}</td>
                    <td className="px-4 py-3 tabular-nums">{product.sizes.join(", ")}</td>
                    <td className="px-4 py-3 tabular-nums">{formatINR(pricing.mrp)}</td>
                    <td className="px-4 py-3 tabular-nums">
                      {formatINR(pricing.sellingPrice)}
                    </td>
                    <td className="px-4 py-3 tabular-nums">{formatINR(wholesale)}</td>
                    <td className="px-4 py-3 tabular-nums">{formatINR(distributor)}</td>
                    <td className="px-4 py-3">{product.featured ? "Yes" : "—"}</td>
                    <td className="px-4 py-3">{product.newArrival ? "Yes" : "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-brand-muted">
          Showing {preview.length} of {products.length} styles.{" "}
          <a
            href={CATALOG_PATHS.csv}
            download="jff-catalog.csv"
            className="font-medium text-brand-accent underline-offset-2 hover:underline"
          >
            Download full CSV
          </a>{" "}
          for the complete catalogue.
        </p>
      </ScrollReveal>
    </PageShell>
  );
}
