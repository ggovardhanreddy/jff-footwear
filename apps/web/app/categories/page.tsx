import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import CategoriesAnimatedGrid from "@/components/shop/CategoriesAnimatedGrid";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { categories } from "@/data/content";
import { getProductCountByCategory } from "@/data";
import { MATERIALS, ROUTES } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Categories",
  description:
    "Explore JFF slipper categories — Men, Women, Kids, Orthopedic, Fashion, Outdoor, and more.",
  path: "/categories",
});

export default function CategoriesPage() {
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    productCount: getProductCountByCategory(cat.name),
  }));

  return (
    <PageShell>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Categories", href: "/categories" },
        ]}
      />
      <SectionHeading
        subtitle="Explore"
        title="Shop by Category"
        titleAs="h1"
        description="Find the perfect JFF slipper collection — Men, Women, Kids, Slides, Comfort, Premium, and more."
      />

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[
          { name: "New Arrivals", href: `${ROUTES.products}?new=1` },
          { name: "Best Sellers", href: `${ROUTES.products}?featured=1` },
          { name: "Offers", href: ROUTES.products },
          { name: "Premium Collection", href: ROUTES.collections },
        ].map((tile) => (
          <Link
            key={tile.name}
            href={tile.href}
            className="group flex min-h-[100px] flex-col justify-end rounded-[1.5rem] border border-black/[0.06] bg-gradient-to-br from-brand-black to-zinc-800 p-5 text-white transition hover:-translate-y-1 hover:shadow-[0_20px_40px_-20px_rgba(200,169,110,0.5)] dark:border-white/10"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-accent">
              JFF
            </span>
            <span className="mt-1 font-display text-xl font-semibold">{tile.name}</span>
          </Link>
        ))}
      </div>

      <CategoriesAnimatedGrid categories={categoriesWithCount} />

      <SectionHeading
        subtitle="Materials"
        title="Shop by Material"
        description="Each material offers unique benefits for different use cases."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MATERIALS.map((material) => (
          <Link
            key={material}
            href={`/products?material=${encodeURIComponent(material)}`}
            className="focus-ring group flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-accent hover:shadow-premium"
          >
            <span className="font-display font-semibold">{material}</span>
            <ArrowRight
              className="h-4 w-4 text-brand-muted transition-transform group-hover:translate-x-1 group-hover:text-brand-accent"
              aria-hidden
            />
          </Link>
        ))}
      </div>
    </PageShell>
  );
}
