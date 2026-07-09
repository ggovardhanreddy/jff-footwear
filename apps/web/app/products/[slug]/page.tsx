import { notFound } from "next/navigation";
import ProductExperience from "@/components/products/ProductExperience";
import ProductPageSections from "@/components/features/product/ProductPageSections";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import PageShell from "@/components/ui/PageShell";
import { products } from "@/data";
import {
  getProductBySlug,
  getColorVariants,
  getProductMainImage,
} from "@/lib/utils";
import {
  createMetadata,
  createProductJsonLd,
  createBreadcrumbJsonLd,
} from "@/lib/seo";
import { ROUTES } from "@/lib/constants";
import { breadcrumbTrail, toBreadcrumbItems } from "@/lib/breadcrumbs";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(products, slug);
  if (!product) return {};

  return createMetadata({
    title: product.name,
    description: product.description,
    path: `/products/${product.slug}`,
    image: getProductMainImage(product),
    keywords: [
      product.category,
      product.material,
      product.gender,
      product.color,
    ],
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(products, slug);

  if (!product) notFound();

  const colorVariants = getColorVariants(products, product);
  const crumbs = breadcrumbTrail(
    { name: "Products", path: ROUTES.products },
    { name: product.name, path: ROUTES.product(product.slug) }
  );
  const jsonLd = createProductJsonLd(product);
  const breadcrumbLd = createBreadcrumbJsonLd(crumbs);

  return (
    <PageShell fullWidth>
      <JsonLd data={[jsonLd, breadcrumbLd]} />

      <div className="container-custom section-padding">
        <Breadcrumb
          items={toBreadcrumbItems(crumbs)}
        />

        <ProductExperience
          product={product}
          colorVariants={colorVariants}
          catalog={products}
        />

        <ProductPageSections product={product} />
      </div>
    </PageShell>
  );
}
