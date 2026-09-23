"use client";

import ProductCard from "@/components/products/ProductCard";
import SectionIntro from "./SectionIntro";
import type { Product } from "@/types";

export default function ProductShelf({
  id,
  eyebrow,
  title,
  description,
  href,
  cta,
  products,
  onQuickView,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  cta?: string;
  products: Product[];
  onQuickView?: (product: Product) => void;
}) {
  if (!products.length) return null;

  return (
    <section className="container-custom py-8 md:py-10" aria-labelledby={id}>
      <div id={id}>
        <SectionIntro
          eyebrow={eyebrow}
          title={title}
          description={description}
          href={href}
          cta={cta}
        />
      </div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard
            key={product.slug}
            product={product}
            index={index}
            onQuickView={onQuickView}
          />
        ))}
      </div>
    </section>
  );
}
