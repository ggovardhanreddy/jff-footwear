"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, MessageCircle, ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";
import SuccessBurst from "@/components/motion/SuccessBurst";
import ColorSelector from "./ColorSelector";
import SizeSelector from "./SizeSelector";
import QuantitySelector from "@/components/QuantitySelector";
import PriceCard from "@/components/pricing/PriceCard";
import {
  WishlistButton,
  ProductActions,
  StickyProductBar,
} from "@/components/features";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { ROUTES } from "@/lib/constants";
import { getProductPricing } from "@/lib/pricing";
import {
  buildWhatsAppUrl,
  getProductFeatures,
  getProductSpecifications,
} from "@/lib/utils";
import type { Product, ColorVariant } from "@/types";

interface ProductDetailsProps {
  product: Product;
  colorVariants: ColorVariant[];
  onColorSelect?: (variant: ColorVariant) => void;
}

export default function ProductDetails({
  product,
  colorVariants,
  onColorSelect,
}: ProductDetailsProps) {
  const { addItem, itemCount } = useCart();
  const { show } = useToast();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const pricing = getProductPricing(product);
  const features = getProductFeatures(product);
  const specifications = getProductSpecifications(product);

  const handleColorSelect = (variant: ColorVariant) => {
    if (onColorSelect) {
      onColorSelect(variant);
      return;
    }
    if (variant.slug !== product.slug) {
      window.location.href = `/products/${variant.slug}`;
    }
  };

  const requireSize = (): boolean => {
    if (!selectedSize) {
      setSizeError("Please select a size before continuing.");
      return false;
    }
    setSizeError("");
    return true;
  };

  const handleAddToCart = () => {
    if (!requireSize()) return;
    addItem({ product, size: selectedSize!, quantity });
    show("Added to cart!", "success");
    setShowSuccess(true);
    window.setTimeout(() => setShowSuccess(false), 1200);
  };

  const handleInquiry = () => {
    if (!requireSize()) return;
    const url = buildWhatsAppUrl({
      productName: product.name,
      gender: product.gender,
      category: product.category,
      material: product.material,
      color: product.color !== "Standard" ? product.color : "Any",
      size: selectedSize!,
      quantity,
    });
    window.open(url, "_blank");
  };

  return (
    <>
      <SuccessBurst show={showSuccess} label="Added to cart!" />
      <div className="space-y-10 md:space-y-12" id="product-info">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow">
              {product.category} · {product.material}
            </p>
            <h1 className="heading-page mt-3 text-brand-black dark:text-white">
              {product.name}
            </h1>
            <p className="mt-3 text-sm text-brand-muted">
              {product.gender} ·{" "}
              {product.color !== "Standard" ? product.color : "All Colors"}
            </p>
          </div>
          <WishlistButton product={product} />
        </div>

        <PriceCard pricing={pricing} />

        <p className="text-body leading-relaxed">{product.description}</p>

        <ProductActions product={product} />

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

        <div className="grid grid-cols-1 gap-4 border-y border-gray-100 py-6 dark:border-white/10 sm:grid-cols-3">
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
            onSelect={(size) => {
              setSelectedSize(size);
              setSizeError("");
            }}
          />
          {sizeError && (
            <p className="mt-3 text-sm text-red-600" role="alert">
              {sizeError}
            </p>
          )}
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Quantity
          </p>
          <QuantitySelector value={quantity} onChange={setQuantity} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="primary"
            size="lg"
            magnetic
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-5 w-5" />
            Add to Cart
          </Button>
          <Button
            variant="whatsapp"
            size="lg"
            className="flex-1"
            onClick={handleInquiry}
          >
            <MessageCircle className="h-5 w-5" />
            Quick Inquiry
          </Button>
        </div>

        {itemCount > 0 && (
          <div className="flex flex-wrap justify-center gap-4 text-center text-sm">
            <Link
              href={ROUTES.cart}
              className="font-semibold text-brand-accent hover:underline"
            >
              View Cart ({itemCount})
            </Link>
            <span className="text-brand-muted">·</span>
            <Link
              href={ROUTES.checkout}
              className="font-semibold text-brand-black hover:text-brand-accent dark:text-white"
            >
              Checkout →
            </Link>
          </div>
        )}

        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand-muted">
            Specifications
          </h2>
          <dl className="divide-y divide-gray-100 border border-gray-100 dark:divide-white/10 dark:border-white/10">
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

      <StickyProductBar
        productName={product.name}
        pricing={pricing}
        onAddToCart={handleAddToCart}
        onWhatsApp={handleInquiry}
        disabled={!selectedSize}
      />
    </>
  );
}
