"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MessageCircle, Share2 } from "lucide-react";
import Button from "@/components/ui/Button";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "@/components/QuantitySelector";
import {
  buildWhatsAppUrl,
  getProductFeatures,
  getProductSpecifications,
  shareProduct,
} from "@/lib/utils";
import type { Product, ColorVariant } from "@/types";

interface ProductDetailsProps {
  product: Product;
  colorVariants: ColorVariant[];
}

export default function ProductDetails({
  product,
  colorVariants,
}: ProductDetailsProps) {
  const router = useRouter();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [shareMessage, setShareMessage] = useState("");

  const features = getProductFeatures(product);
  const specifications = getProductSpecifications(product);

  const handleColorSelect = (variant: ColorVariant) => {
    if (variant.slug !== product.slug) {
      router.push(`/products/${variant.slug}`);
    }
  };

  const handleInquiry = () => {
    if (!selectedSize) {
      alert("Please select a size before sending inquiry.");
      return;
    }

    const url = buildWhatsAppUrl({
      productName: product.name,
      gender: product.gender,
      category: product.category,
      material: product.material,
      color: product.color !== "Standard" ? product.color : "Any",
      size: selectedSize,
      quantity,
    });

    window.open(url, "_blank");
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/products/${product.slug}`;
    try {
      await shareProduct(product, url);
      setShareMessage("Link copied to clipboard!");
      setTimeout(() => setShareMessage(""), 2500);
    } catch {
      setShareMessage("Unable to share");
      setTimeout(() => setShareMessage(""), 2500);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
          {product.category} · {product.material}
        </p>
        <h1 className="heading-display mt-2 text-brand-black">{product.name}</h1>
        <p className="mt-2 text-sm text-brand-muted">
          {product.gender} ·{" "}
          {product.color !== "Standard" ? product.color : "All Colors"}
        </p>
      </div>

      <p className="text-body leading-relaxed">{product.description}</p>

      <div>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Features
        </h2>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-4 border-y border-gray-100 py-6 sm:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Gender
          </p>
          <p className="mt-1 font-medium">{product.gender}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Category
          </p>
          <p className="mt-1 font-medium">{product.category}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Material
          </p>
          <p className="mt-1 font-medium">{product.material}</p>
        </div>
      </div>

      {colorVariants.length > 0 && (
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Color — {product.color !== "Standard" ? product.color : "Select"}
          </p>
          <ColorSelector
            variants={colorVariants}
            selectedColor={product.color}
            onSelect={handleColorSelect}
          />
        </div>
      )}

      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Size {selectedSize ? `— ${selectedSize}` : ""}
        </p>
        <SizeSelector
          sizes={product.sizes}
          selected={selectedSize}
          onSelect={setSelectedSize}
        />
      </div>

      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Quantity
        </p>
        <QuantitySelector value={quantity} onChange={setQuantity} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="whatsapp"
          size="lg"
          className="flex-1"
          onClick={handleInquiry}
        >
          <MessageCircle className="h-5 w-5" />
          Send Inquiry
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleShare}
          aria-label="Share product"
        >
          <Share2 className="h-5 w-5" />
          Share
        </Button>
      </div>

      {shareMessage && (
        <p className="text-center text-xs text-brand-accent">{shareMessage}</p>
      )}

      <p className="text-center text-xs text-brand-muted">
        Inquire via WhatsApp for pricing, availability &amp; bulk orders
      </p>

      <div>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-muted">
          Specifications
        </h2>
        <dl className="divide-y divide-gray-100 border border-gray-100">
          {specifications.map((spec) => (
            <div
              key={spec.label}
              className="grid grid-cols-2 gap-4 px-4 py-3 text-sm"
            >
              <dt className="font-medium text-brand-muted">{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
