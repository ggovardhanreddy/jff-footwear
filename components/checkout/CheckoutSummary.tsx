"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Truck } from "lucide-react";
import Button from "@/components/ui/Button";
import OrderSummary from "@/components/pricing/OrderSummary";
import PricingBreakdown from "@/components/pricing/PricingBreakdown";
import { calculateOrderSummary } from "@/lib/pricing";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { GLASS_CARD, GLASS_CARD_INNER } from "@/lib/checkout-styles";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

interface CheckoutSummaryProps {
  items: CartItem[];
  couponCode?: string;
  onCouponChange?: (code: string) => void;
  onPlaceOrder: () => void;
  isSubmitting?: boolean;
  submitError?: string;
  className?: string;
}

export default function CheckoutSummary({
  items,
  couponCode = "",
  onCouponChange,
  onPlaceOrder,
  isSubmitting = false,
  submitError,
  className,
}: CheckoutSummaryProps) {
  const [localCoupon, setLocalCoupon] = useState(couponCode);
  const [couponMessage, setCouponMessage] = useState("");

  const summary = useMemo(
    () => calculateOrderSummary(items, localCoupon),
    [items, localCoupon]
  );

  const handleApplyCoupon = () => {
    const code = localCoupon.trim().toUpperCase();
    if (!code) {
      setCouponMessage("");
      onCouponChange?.("");
      return;
    }

    const valid = PRICING_CONFIG.coupon.codes[code];
    if (!valid) {
      setCouponMessage("Invalid coupon code");
      onCouponChange?.("");
      return;
    }

    setCouponMessage(`Applied: ${valid.label}`);
    onCouponChange?.(code);
  };

  return (
    <aside className={cn("lg:sticky lg:top-24 lg:self-start", className)}>
      <div className={cn(GLASS_CARD, "overflow-hidden")}>
        <div className={GLASS_CARD_INNER}>
          <div className="mb-6">
            <p className="eyebrow text-brand-accent">Your Order</p>
            <h2 className="font-display text-2xl font-bold text-brand-black">
              Order Summary
            </h2>
          </div>

          <OrderSummary items={items} className="mb-6 max-h-[280px] overflow-y-auto pr-1" />

          {PRICING_CONFIG.coupon.enabled && items.length > 0 && (
            <div className="mb-6 space-y-2">
              <label
                htmlFor="checkout-coupon"
                className="text-xs font-semibold uppercase tracking-widest text-brand-muted"
              >
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  id="checkout-coupon"
                  type="text"
                  value={localCoupon}
                  onChange={(e) => {
                    setLocalCoupon(e.target.value.toUpperCase());
                    setCouponMessage("");
                  }}
                  placeholder="e.g. JFF20"
                  className="input-field flex-1 py-2.5 text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyCoupon}
                  className="shrink-0"
                >
                  Apply
                </Button>
              </div>
              {couponMessage && (
                <p
                  className={cn(
                    "text-xs",
                    couponMessage.startsWith("Applied")
                      ? "text-emerald-600"
                      : "text-red-600"
                  )}
                  role="status"
                >
                  {couponMessage}
                </p>
              )}
            </div>
          )}

          <div className="mb-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-muted">
              Price Details
            </p>
            <PricingBreakdown summary={summary} />
          </div>

          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4">
            <Truck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-brand-black">
                Estimated Delivery
              </p>
              <p className="text-sm text-brand-muted">
                {summary.estimatedDelivery}
              </p>
              {summary.isFreeDelivery && (
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  Free delivery on orders over{" "}
                  {new Intl.NumberFormat(PRICING_CONFIG.locale, {
                    style: "currency",
                    currency: PRICING_CONFIG.currency,
                    maximumFractionDigits: 0,
                  }).format(PRICING_CONFIG.fees.freeDeliveryThreshold)}
                </p>
              )}
            </div>
          </div>

          {submitError && (
            <p className="mb-4 text-sm text-red-600" role="alert">
              {submitError}
            </p>
          )}

          <Button
            type="button"
            variant="whatsapp"
            size="lg"
            className="w-full"
            disabled={items.length === 0 || isSubmitting}
            onClick={onPlaceOrder}
          >
            <MessageCircle className="h-5 w-5" />
            Proceed to WhatsApp Order
          </Button>

          <p className="mt-4 text-center text-xs text-brand-muted">
            Place order via WhatsApp — our team will confirm availability
          </p>
        </div>
      </div>
    </aside>
  );
}
