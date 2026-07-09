"use client";

import { useEffect } from "react";
import DeliveryEstimator from "@/components/checkout/DeliveryEstimator";
import { usePincodeLookup } from "@/hooks/usePincodeLookup";
import { useDeliveryEstimate } from "@/hooks/useDeliveryEstimate";
import { checkDeliveryAvailability } from "@/lib/delivery";
import type { ProductCustomization } from "@/types/customizer";

interface CustomizerDeliveryStepProps {
  config: ProductCustomization;
  onUpdate: (partial: Partial<ProductCustomization>) => void;
}

export default function CustomizerDeliveryStep({
  config,
  onUpdate,
}: CustomizerDeliveryStepProps) {
  const pincode = config.deliveryPincode;
  const lookup = usePincodeLookup(pincode);
  const state = lookup.data?.state ?? config.deliveryState;
  const estimate = useDeliveryEstimate(state);

  useEffect(() => {
    if (!lookup.data?.state) return;
    if (
      lookup.data.state === config.deliveryState &&
      estimate.deliveryBy === config.deliveryBy
    ) {
      return;
    }
    onUpdate({
      deliveryState: lookup.data.state,
      deliveryBy: estimate.deliveryBy,
    });
  }, [
    lookup.data?.state,
    estimate.deliveryBy,
    config.deliveryState,
    config.deliveryBy,
    onUpdate,
  ]);

  const deliveryCheck =
    pincode.length === 6 ? checkDeliveryAvailability(pincode) : null;

  return (
    <div className="max-w-md space-y-6">
      <div>
        <label htmlFor="customizer-pincode" className="eyebrow mb-2 block text-brand-muted">
          Delivery PIN Code
        </label>
        <input
          id="customizer-pincode"
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={pincode}
          onChange={(e) =>
            onUpdate({
              deliveryPincode: e.target.value.replace(/\D/g, "").slice(0, 6),
              deliveryState: "",
              deliveryBy: "",
            })
          }
          placeholder="6-digit PIN"
          className="input-field w-full text-lg tracking-widest"
          autoComplete="postal-code"
        />
        {lookup.isLoading && (
          <p className="mt-2 text-sm text-brand-muted">Looking up PIN code…</p>
        )}
        {lookup.data && (
          <p className="mt-2 text-sm text-brand-muted">
            {lookup.data.city}, {lookup.data.state}
          </p>
        )}
        {lookup.errorMessage && !lookup.isLoading && (
          <p className="mt-2 text-sm text-amber-700">{lookup.errorMessage}</p>
        )}
      </div>

      {deliveryCheck?.checked && !deliveryCheck.available && (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Delivery may not be available to this PIN. You can still place the order
          on WhatsApp — our team will confirm options.
        </p>
      )}

      {estimate.deliveryBy && (
        <DeliveryEstimator estimate={estimate} />
      )}

      <p className="text-xs text-brand-muted">
        Delivery estimate is based on dispatch from our Rayachoty warehouse. Final
        timeline confirmed on WhatsApp.
      </p>
    </div>
  );
}
