import { notFound } from "next/navigation";
import ProductGallery from "@/components/products/ProductGallery";
import ProductDetails from "@/components/products/ProductDetails";
import ProductCard from "@/components/products/ProductCard";
import Breadcrumb from "@/components/Breadcrumb";
import { products } from "@/data";
import {
  getProductBySlug,
  getRelatedProducts,
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

  const related = getRelatedProducts(products, product);
  const colorVariants = getColorVariants(products, product);
  const jsonLd = createProductJsonLd(product);
  const breadcrumbLd = createBreadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: product.name, path: `/products/${product.slug}` },
  ]);

  return (
    <div className="pt-20">
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

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />
          <ProductDetails
            product={product}
            colorVariants={colorVariants}
          />
        </div>

        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="heading-section mb-8 text-brand-black">
              Related Products
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
