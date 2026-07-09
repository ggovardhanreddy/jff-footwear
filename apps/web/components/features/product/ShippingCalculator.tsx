"use client";

import { useState } from "react";
import { MapPin, Truck, Banknote } from "lucide-react";
import { useDeliveryAvailability } from "@/hooks/useDeliveryAvailability";
import { useCodAvailability } from "@/hooks/useCodAvailability";
import { useDeliveryEstimate } from "@/hooks/useDeliveryEstimate";
import { usePincodeLookup } from "@/hooks/usePincodeLookup";
import { SHIPPING_CONFIG } from "@/config/shipping";
import { cn } from "@/lib/utils";

interface ShippingCalculatorProps {
  className?: string;
}

export default function ShippingCalculator({ className }: ShippingCalculatorProps) {
  const [pincode, setPincode] = useState("");

  const lookup = usePincodeLookup(pincode);
  const state = lookup.data?.state ?? "";
  const delivery = useDeliveryAvailability(pincode);
  const cod = useCodAvailability(pincode, delivery.available);
  const estimate = useDeliveryEstimate(state);

  return (
    <div
      className={cn(
        "rounded-[24px] border border-black/5 bg-white/60 p-5 dark:border-white/10 dark:bg-white/5 dark:glass-card",
        className
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-muted">
        Shipping Calculator
      </p>
      <h3 className="mt-2 font-display text-lg font-bold">
        Estimated Delivery by PIN Code
      </h3>
      <div className="mt-4 flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={pincode}
            onChange={(e) =>
              setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter 6-digit PIN"
            className="input-field w-full rounded-2xl py-3 pl-10"
            aria-label="PIN code"
          />
        </div>
      </div>

      {lookup.isLoading && pincode.length === 6 && (
        <p className="mt-3 text-sm text-brand-muted">Looking up PIN code…</p>
      )}

      {lookup.data && (
        <p className="mt-3 text-sm text-brand-muted">
          {lookup.data.city}, {lookup.data.district}, {lookup.data.state}
        </p>
      )}

      {pincode.length === 6 && delivery.checked && (
        <div className="mt-4 space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-brand-blue dark:text-brand-blue-dark" />
            {delivery.available
              ? "Delivery available"
              : SHIPPING_CONFIG.messages.deliveryUnavailable}
          </p>
          {estimate.deliveryBy && delivery.available && (
            <p className="font-medium text-emerald-600">
              Estimated delivery by {estimate.deliveryBy}
            </p>
          )}
          {cod.checked && (
            <p className="flex items-center gap-2">
              <Banknote className="h-4 w-4" />
              COD: {cod.available ? "Available" : "Not available"}
            </p>
          )}
          <p className="text-brand-muted">
            Delivery charge: ₹{SHIPPING_CONFIG.DELIVERY_CHARGE} (FREE above ₹
            {SHIPPING_CONFIG.FREE_DELIVERY_THRESHOLD})
          </p>
        </div>
      )}
    </div>
  );
}
