"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  MapPin,
  Calendar,
  Truck,
  Zap,
  Banknote,
} from "lucide-react";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { cn } from "@/lib/utils";
import type {
  CodAvailability,
  DeliveryAddress,
  DeliveryEstimate,
} from "@/types";

interface ShippingInfoProps {
  address: DeliveryAddress;
  estimate?: DeliveryEstimate;
  cod?: CodAvailability;
  className?: string;
}

export default function ShippingInfo({
  address,
  estimate,
  cod,
  className,
}: ShippingInfoProps) {
  const reduced = useReducedMotion();

  if (!address.fullName && !address.pincode) return null;

  const cityLine = [address.city, address.district, address.state, address.country || "India"]
    .filter(Boolean)
    .join(", ");
  const isExpress = estimate?.tier === "same_state";

  return (
    <motion.div
      {...checkoutPanelReveal(reduced)}
      className={cn(
        "space-y-4 rounded-[24px] border border-white/80 bg-gradient-to-br from-white via-white to-brand-cream/20 p-5 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)] sm:p-6",
        CHECKOUT_MOTION_GPU,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 text-lg">
          📍
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-muted">
            Delivering to
          </p>
          <p className="mt-1 font-display text-xl font-bold text-brand-black">
            {address.fullName}
          </p>
          <p className="mt-0.5 text-sm text-brand-muted">
            {cityLine || address.district}
          </p>
          {address.pincode && (
            <p className="text-sm font-semibold tabular-nums text-brand-black">
              {address.pincode}
            </p>
          )}
        </div>
      </div>

      {estimate?.deliveryBy && (
        <InfoRow
          icon={Calendar}
          label="Estimated Delivery"
          value={estimate.deliveryBy}
          highlight
        />
      )}

      <InfoRow
        icon={Truck}
        label="Delivery Type"
        value={isExpress ? "Express" : "Standard"}
        subValue={estimate?.label}
      />

      {cod?.checked && (
        <InfoRow
          icon={Banknote}
          label="Cash on Delivery"
          value={cod.available ? "Available" : "Not Available"}
          highlight={cod.available}
          negative={!cod.available}
        />
      )}

      {isExpress && (
        <div className="flex items-center gap-2 rounded-xl bg-blue-50/80 px-3 py-2 text-xs font-semibold text-blue-800">
          <Zap className="h-3.5 w-3.5" aria-hidden />
          Express delivery eligible for your region
        </div>
      )}
    </motion.div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  subValue,
  highlight = false,
  negative = false,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
  subValue?: string;
  highlight?: boolean;
  negative?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 border-t border-black/[0.05] pt-4">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-muted">
          {label}
        </p>
        <p
          className={cn(
            "mt-0.5 font-semibold",
            highlight && !negative && "text-emerald-600",
            negative && "text-brand-muted",
            !highlight && !negative && "text-brand-black"
          )}
        >
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-brand-muted">{subValue}</p>
        )}
      </div>
    </div>
  );
}
