import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductGrid from "@/components/products/ProductGrid";
import JsonLd from "@/components/seo/JsonLd";
import EmptyState from "@/components/ui/EmptyState";
import { ShoppingBag } from "lucide-react";
import { products } from "@/data";
import {
  getAllCollections,
  getCollectionBySlug,
  getCollectionProducts,
} from "@/lib/collections";
import { createMetadata, createBreadcrumbJsonLd, createItemListJsonLd } from "@/lib/seo";
import { ROUTES } from "@/lib/constants";
import { getProductMainImage } from "@/lib/utils";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};

  return createMetadata({
    title: collection.title,
    description: collection.description,
    path: `/collections/${collection.slug}`,
    image: collection.image,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const collectionProducts = getCollectionProducts(collection, products);
  const itemListLd = createItemListJsonLd(
    collectionProducts.map((product) => ({
      name: product.name,
      url: `/products/${product.slug}`,
      image: getProductMainImage(product),
    })),
    `${collection.title} — JFF Footwear`
  );

  return (
    <PageShell>
      <JsonLd
        data={[
          createBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Collections", path: "/collections" },
            { name: collection.name, path: `/collections/${collection.slug}` },
          ]),
          itemListLd,
        ]}
      />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections" },
          { label: collection.name, href: `/collections/${collection.slug}` },
        ]}
      />
      <SectionHeading
        subtitle="Collection"
        title={collection.title}
        titleAs="h1"
        description={collection.description}
      />

      {collectionProducts.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products in this collection yet"
          description="Check back soon or browse our full catalogue."
          actionLabel="Shop All Products"
          actionHref={ROUTES.products}
        />
      ) : (
        <>
          <p className="mb-8 text-sm text-brand-muted">
            {collectionProducts.length}{" "}
            {collectionProducts.length === 1 ? "style" : "styles"}
          </p>
          <ProductGrid products={collectionProducts} />
        </>
      )}
    </PageShell>
  );
}
