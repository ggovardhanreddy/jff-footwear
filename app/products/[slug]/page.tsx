import { notFound } from "next/navigation";
import ProductGalleryTabs from "@/components/products/ProductGalleryTabs";
import ProductDetails from "@/components/products/ProductDetails";
import ProductPageSections from "@/components/features/product/ProductPageSections";
import Breadcrumb from "@/components/Breadcrumb";
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
  const jsonLd = createProductJsonLd(product);
  const breadcrumbLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  return (
    <div className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="container-custom section-padding">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", href: "/products" },
            { label: product.name, href: `/products/${product.slug}` },
          ]}
        />

        <div className="grid gap-12 bg-white lg:grid-cols-2 lg:gap-16">
          <ProductGalleryTabs images={product.images} productName={product.name} />
          <ProductDetails
            product={product}
            colorVariants={colorVariants}
          />
        </div>

        <ProductPageSections product={product} />
      </div>
    </div>
  );
}
