"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CHECKOUT_EYEBROW,
  PREMIUM_ADDRESS_CARD,
} from "@/lib/checkout-styles";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import type { DeliveryAddress } from "@/types";

interface SavedAddressCardProps {
  address: DeliveryAddress;
  className?: string;
}

export default function SavedAddressCard({
  address,
  className,
}: SavedAddressCardProps) {
  const reduced = useReducedMotion();

  if (!address.fullName || !address.pincode) return null;

  const lines = [
    address.flatHouse,
    address.area,
    address.landmark,
    [address.city, address.district, address.state].filter(Boolean).join(", "),
    address.country || "India",
    address.pincode,
  ].filter(Boolean);

  return (
    <motion.div
      {...checkoutPanelReveal(reduced)}
      className={cn(PREMIUM_ADDRESS_CARD, CHECKOUT_MOTION_GPU, className)}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand-accent/10 blur-2xl"
        aria-hidden
      />

      <p className={CHECKOUT_EYEBROW}>Deliver To</p>

      <p className="mt-3 font-display text-2xl font-bold tracking-tight text-brand-black sm:text-[1.65rem]">
        {address.fullName}
      </p>

      <div className="mt-5 flex gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10">
          <MapPin className="h-4 w-4 text-brand-accent" aria-hidden />
        </div>
        <div className="space-y-1 text-sm leading-relaxed text-brand-muted">
          {lines.map((line) => (
            <p key={line} className="text-[15px]">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-black/[0.06] pt-5">
        <div className="flex items-center gap-2.5">
          <Phone className="h-4 w-4 text-brand-accent" aria-hidden />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
              Mobile
            </p>
            <p className="font-semibold text-brand-black">{address.mobile}</p>
          </div>
        </div>
        <span className="rounded-full border border-brand-accent/20 bg-brand-accent/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-brand-accent">
          {address.addressType}
        </span>
      </div>
    </motion.div>
  );
}
