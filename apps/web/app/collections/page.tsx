import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import PageShell from "@/components/ui/PageShell";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import { products } from "@/data";
import { getAllCollections, getCollectionProductCount } from "@/lib/collections";
import { ROUTES } from "@/lib/constants";

export const metadata = createMetadata({
  title: "Collections",
  description:
    "Browse curated JFF Footwear collections — featured styles, new arrivals, orthopedic comfort, memory foam, and more.",
  path: "/collections",
});

export default function CollectionsPage() {
  const allCollections = getAllCollections();

  return (
    <PageShell>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Collections", path: "/collections" },
        ])}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections" },
        ]}
      />
      <SectionHeading
        subtitle="Curated"
        title="Shop Collections"
        titleAs="h1"
        description="Explore themed edits — from new arrivals and best sellers to orthopedic comfort and kids styles."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {allCollections.map((collection) => {
          const count = getCollectionProductCount(collection, products);
          return (
            <Link
              key={collection.id}
              href={ROUTES.collection(collection.slug)}
              className="focus-ring group relative aspect-[4/3] overflow-hidden rounded-[28px] shadow-soft transition-shadow duration-500 hover:shadow-premium"
            >
              <AssetImage
                src={collection.image}
                alt={collection.name}
                fill
                loading="lazy"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-black/90 via-brand-black/35 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h2 className="font-display text-2xl font-bold text-white">
                  {collection.name}
                </h2>
                <p className="mt-1 text-sm text-gray-300">
                  {count} {count === 1 ? "Product" : "Products"}
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-gray-400 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                  {collection.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-brand-accent">
                  Shop collection
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </PageShell>
  );
}
