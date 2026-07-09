"use client";

import { useMemo, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import CouponCard from "./CouponCard";
import FreeDeliveryProgress from "./FreeDeliveryProgress";
import SavingsCard from "./SavingsCard";
import TrustBadges from "./TrustBadges";
import PriceBreakdown from "./PriceBreakdown";
import PaymentSection from "./PaymentSection";
import { calculateOrderSummary } from "@/lib/pricing";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { SHIPPING_CONFIG } from "@/config/shipping";
import {
  CHECKOUT_DIVIDER,
  CHECKOUT_EYEBROW,
  CHECKOUT_SECTION_TITLE,
  GLASS_CARD,
  GLASS_CARD_INNER,
} from "@/lib/checkout-styles";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";
import type {
  CartItem,
  CodAvailability,
  DeliveryAvailability,
  DeliveryEstimate,
} from "@/types";

interface CheckoutSummaryProps {
  items: CartItem[];
  couponCode?: string;
  onCouponChange?: (code: string) => void;
  onPlaceOrder: () => void;
  isSubmitting?: boolean;
  submitError?: string;
  delivery?: DeliveryAvailability;
  cod?: CodAvailability;
  estimate?: DeliveryEstimate;
  checkoutDisabled?: boolean;
  className?: string;
}

export default function CheckoutSummary({
  items,
  couponCode = "",
  onCouponChange,
  onPlaceOrder,
  isSubmitting = false,
  submitError,
  delivery,
  cod,
  estimate,
  checkoutDisabled = false,
  className,
}: CheckoutSummaryProps) {
  const reduced = useReducedMotion();
  const [localCoupon, setLocalCoupon] = useState(couponCode);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);

  useEffect(() => {
    setLocalCoupon(couponCode);
    if (couponCode) {
      setCouponSuccess(true);
    }
  }, [couponCode]);

  const summary = useMemo(
    () => calculateOrderSummary(items, localCoupon),
    [items, localCoupon]
  );

  const handleApplyCoupon = () => {
    const code = localCoupon.trim().toUpperCase();
    if (!code) {
      setCouponMessage("");
      setCouponSuccess(false);
      onCouponChange?.("");
      return;
    }

    const valid = PRICING_CONFIG.coupon.codes[code];
    if (!valid) {
      setCouponMessage("Invalid coupon code. Please try again.");
      setCouponSuccess(false);
      onCouponChange?.("");
      return;
    }

    setCouponMessage(`${valid.label} applied successfully!`);
    setCouponSuccess(true);
    onCouponChange?.(code);
  };

  const handleRemoveCoupon = () => {
    setLocalCoupon("");
    setCouponMessage("Coupon removed.");
    setCouponSuccess(false);
    onCouponChange?.("");
  };

  const couponApplied =
    couponSuccess && localCoupon.trim().length > 0;

  const cannotCheckout = Boolean(
    checkoutDisabled ||
      items.length === 0 ||
      (delivery?.checked && !delivery.available)
  );

  return (
    <motion.aside
      {...checkoutPanelReveal(reduced, 0.08)}
      className={cn(
        "lg:sticky lg:top-[5.5rem] lg:max-h-[calc(100vh-6.5rem)] lg:self-start lg:overflow-y-auto",
        CHECKOUT_MOTION_GPU,
        className
      )}
      aria-label="Order summary"
    >
      <div className={cn(GLASS_CARD, "overflow-hidden")}>
        <div className={GLASS_CARD_INNER}>
          <header className="mb-6">
            <p className={CHECKOUT_EYEBROW}>Bag Summary</p>
            <h2 className={cn(CHECKOUT_SECTION_TITLE, "mt-2 text-2xl sm:text-[1.75rem]")}>
              Order Summary
            </h2>
            <p className="mt-2 text-sm text-brand-muted">
              {items.length} {items.length === 1 ? "item" : "items"} in your bag
            </p>
          </header>

          <FreeDeliveryProgress
            cartSellingTotal={summary.cartSellingTotal}
            isFreeDelivery={summary.isFreeDelivery}
            className="mb-6"
          />

          <div className={cn(CHECKOUT_DIVIDER, "mb-6")} />

          {PRICING_CONFIG.coupon.enabled && items.length > 0 && (
            <CouponCard
              value={localCoupon}
              onChange={(v) => {
                setLocalCoupon(v);
                setCouponMessage("");
                setCouponSuccess(false);
              }}
              onApply={handleApplyCoupon}
              onRemove={handleRemoveCoupon}
              applied={couponApplied}
              message={couponMessage}
              isSuccess={couponSuccess}
              isError={!!couponMessage && !couponSuccess}
              className="mb-6"
            />
          )}

          <div className="mb-6">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-muted">
              Price Details
            </p>
            <PriceBreakdown summary={summary} />
          </div>

          <SavingsCard totalSavings={summary.totalSavings} className="mb-6" />

          <TrustBadges
            className="mb-6"
            showCod={cod?.available ?? true}
            showFastDelivery={estimate?.tier !== "other"}
          />

          {delivery?.checked && !delivery.available && (
            <p
              className="mb-5 rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {SHIPPING_CONFIG.messages.deliveryUnavailable}
            </p>
          )}

          <PaymentSection
            disabled={cannotCheckout}
            isSubmitting={isSubmitting}
            onPlaceOrder={onPlaceOrder}
            submitError={submitError}
          />
        </div>
      </div>
    </motion.aside>
  );
}
