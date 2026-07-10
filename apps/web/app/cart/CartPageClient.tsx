"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import ButtonLink from "@/components/ui/ButtonLink";
import { OrderSummary, PricingBreakdown } from "@/components/pricing";
import CouponCard from "@/components/checkout/CouponCard";
import {
  EmptyCartState,
  FreeDeliveryProgress,
  RecommendedProducts,
  ShoppingExperience,
  TrustBadges,
} from "@/components/checkout";
import { useCart } from "@/context/CartContext";
import { useCoupon } from "@/hooks/useCoupon";
import { calculateOrderSummary } from "@/lib/pricing";
import { GLASS_CARD, GLASS_CARD_INNER } from "@/lib/checkout-styles";
import { ROUTES } from "@/lib/constants";
import { PRICING_CONFIG } from "@/lib/pricing-config";

export default function CartPageClient() {
  const router = useRouter();
  const { items, itemCount, updateQuantity, removeItem } = useCart();
  const baseSummary = useMemo(() => calculateOrderSummary(items), [items]);
  const coupon = useCoupon(baseSummary.cartSellingTotal);
  const summary = useMemo(
    () => calculateOrderSummary(items, coupon.appliedCode),
    [items, coupon.appliedCode]
  );

  const goCheckout = () => {
    router.push(ROUTES.checkout);
  };

  return (
    <PageShell className="pb-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: ROUTES.cart },
        ]}
      />

      <PageHeader
        eyebrow="Shopping Cart"
        title={items.length === 0 ? "Your Cart" : "Your Cart"}
        description={
          items.length === 0 ? undefined : `${itemCount} ${itemCount === 1 ? "item" : "items"}`
        }
        actions={
          items.length > 0 ? (
            <ButtonLink href={ROUTES.products} variant="outline">
              Continue Shopping
            </ButtonLink>
          ) : undefined
        }
      />

      {items.length > 0 && <ShoppingExperience className="mb-8" />}

      {items.length === 0 ? (
        <>
          <EmptyCartState />
          <RecommendedProducts className="mt-12" />
        </>
      ) : (
        <>
          <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
            <div className="lg:col-span-3">
              <div className={GLASS_CARD}>
                <div className={GLASS_CARD_INNER}>
                  <h2 className="mb-6 font-display text-xl font-bold">Cart Items</h2>
                  <OrderSummary
                    items={items}
                    editable
                    variant="premium"
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

                  <FreeDeliveryProgress
                    cartSellingTotal={summary.cartSellingTotal}
                    isFreeDelivery={summary.isFreeDelivery}
                    className="mb-6"
                  />

                  {coupon.enabled && (
                    <CouponCard
                      value={coupon.input}
                      onChange={coupon.setInput}
                      onApply={coupon.apply}
                      onRemove={coupon.remove}
                      applied={coupon.applied}
                      message={coupon.message}
                      isSuccess={coupon.isSuccess}
                      isError={coupon.isError}
                      className="mb-6"
                    />
                  )}

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

                  <TrustBadges className="mt-6" />

                  <div className="mt-6">
                    <Button
                      type="button"
                      size="lg"
                      magnetic
                      className="w-full justify-center"
                      onClick={goCheckout}
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <RecommendedProducts cartItems={items} className="mt-12" />
        </>
      )}
    </PageShell>
  );
}
