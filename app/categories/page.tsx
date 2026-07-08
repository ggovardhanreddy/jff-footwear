import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { categories } from "@/data/content";
import { getProductCountByCategory } from "@/data";
import { MATERIALS } from "@/lib/constants";

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
        description="Find the perfect slipper collection for your needs."
      />

      <div className="mb-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categoriesWithCount.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${encodeURIComponent(category.name)}`}
            className="focus-ring group relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-soft transition-shadow duration-500 hover:shadow-premium"
          >
            <AssetImage
              src={category.image}
              alt={category.name}
              fill
              loading="lazy"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="font-display text-2xl font-bold text-white">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-gray-300">
                {category.productCount} Products
              </p>
              <p className="mt-2 text-sm text-gray-400 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

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
