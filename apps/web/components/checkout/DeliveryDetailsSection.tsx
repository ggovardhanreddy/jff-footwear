"use client";

import DeliveryChecker from "./DeliveryChecker";
import CodAvailabilityBadge from "./CodAvailability";
import DeliveryEstimator from "./DeliveryEstimator";
import ShippingBadges from "./ShippingBadge";
import {
  CHECKOUT_EYEBROW,
  CHECKOUT_SECTION_TITLE,
} from "@/lib/checkout-styles";
import type {
  CodAvailability,
  DeliveryAvailability,
  DeliveryEstimate,
} from "@/types";

interface DeliveryDetailsSectionProps {
  delivery: DeliveryAvailability;
  cod: CodAvailability;
  estimate: DeliveryEstimate;
  isFreeDelivery: boolean;
  isPincodeLoading?: boolean;
}

export default function DeliveryDetailsSection({
  delivery,
  cod,
  estimate,
  isFreeDelivery,
  isPincodeLoading = false,
}: DeliveryDetailsSectionProps) {
  return (
    <div className="space-y-5">
      <header>
        <p className={CHECKOUT_EYEBROW}>Delivery</p>
        <h2 className={CHECKOUT_SECTION_TITLE}>Delivery Details</h2>
        <p className="mt-2 text-sm text-brand-muted">
          We&apos;ll confirm serviceability and estimated arrival for your PIN.
        </p>
      </header>

      <DeliveryChecker
        availability={delivery}
        isLoading={isPincodeLoading}
      />
      <DeliveryEstimator estimate={estimate} />
      <CodAvailabilityBadge availability={cod} />
      <ShippingBadges
        isFreeDelivery={isFreeDelivery}
        isFastDelivery={estimate.tier !== "other"}
        isCodAvailable={cod.available}
      />
    </div>
  );
}
