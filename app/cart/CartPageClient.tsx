"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import ButtonLink from "@/components/ui/ButtonLink";
import { OrderSummary, PricingBreakdown } from "@/components/pricing";
import { useCart } from "@/context/CartContext";
import { calculateOrderSummary } from "@/lib/pricing";
import { GLASS_CARD, GLASS_CARD_INNER } from "@/lib/checkout-styles";
import { ROUTES } from "@/lib/constants";
import { PRICING_CONFIG } from "@/lib/pricing-config";

export default function CartPageClient() {
  const { items, itemCount, updateQuantity, removeItem } = useCart();
  const summary = calculateOrderSummary(items);

  return (
    <PageShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: ROUTES.cart },
        ]}
      />

      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brand-accent">Shopping Cart</p>
          <h1 className="heading-page mt-2 text-brand-black">Your Cart</h1>
          <p className="mt-2 text-sm text-brand-muted">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </p>
        </div>
        {items.length > 0 && (
          <ButtonLink href={ROUTES.products} variant="outline">
            Continue Shopping
          </ButtonLink>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mx-auto max-w-md py-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100">
            <ShoppingBag className="h-9 w-9 text-brand-muted" aria-hidden />
          </div>
          <p className="text-lg font-medium text-brand-black">Your cart is empty</p>
          <p className="mt-2 text-sm text-brand-muted">
            Discover premium slippers and add your favourites.
          </p>
          <div className="mt-8">
            <ButtonLink href={ROUTES.products}>Browse Products</ButtonLink>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
          <div className="lg:col-span-3">
            <div className={GLASS_CARD}>
              <div className={GLASS_CARD_INNER}>
                <h2 className="mb-6 font-display text-xl font-bold">Cart Items</h2>
                <OrderSummary
                  items={items}
                  editable
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start lg:col-span-2">
            <div className={GLASS_CARD}>
              <div className={GLASS_CARD_INNER}>
                <h2 className="mb-6 font-display text-xl font-bold">Order Summary</h2>
                <PricingBreakdown summary={summary} />
                <p className="mt-4 text-xs text-brand-muted">
                  {PRICING_CONFIG.taxNote}. Delivery is free on orders over{" "}
                  {new Intl.NumberFormat(PRICING_CONFIG.locale, {
                    style: "currency",
                    currency: PRICING_CONFIG.currency,
                    maximumFractionDigits: 0,
                  }).format(PRICING_CONFIG.fees.freeDeliveryThreshold)}
                  .
                </p>
                <div className="mt-6">
                  <ButtonLink href={ROUTES.checkout} size="lg" className="w-full justify-center">
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </ButtonLink>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </PageShell>
  );
}
