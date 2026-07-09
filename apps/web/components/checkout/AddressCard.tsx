"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MapPin, Phone, Pencil, Trash2, Plus } from "lucide-react";
import { PREMIUM_ADDRESS_CARD, CHECKOUT_EYEBROW } from "@/lib/checkout-styles";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { hoverLift } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { DeliveryAddress } from "@/types";

interface AddressCardProps {
  address: DeliveryAddress;
  onEdit?: () => void;
  onDelete?: () => void;
  onAddNew?: () => void;
  className?: string;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onAddNew,
  className,
}: AddressCardProps) {
  const reduced = useReducedMotion();

  if (!address.fullName && !address.pincode) return null;

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
      {...hoverLift(reduced)}
      className={cn(PREMIUM_ADDRESS_CARD, CHECKOUT_MOTION_GPU, className)}
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-accent/10 blur-3xl"
        aria-hidden
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className={CHECKOUT_EYEBROW}>Delivery Address</p>
        <div className="flex flex-wrap gap-2">
          {address.isDefault && (
            <span className="rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent">
              Default Address
            </span>
          )}
          <span className="rounded-full border border-neutral-200 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-muted">
            {address.addressType}
          </span>
        </div>
      </div>

      <p className="mt-4 font-display text-2xl font-bold tracking-tight text-brand-black">
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
          <p className="font-semibold text-brand-black">{address.mobile}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50/50 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-red-600 transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden />
              Delete
            </button>
          )}
          {onAddNew && (
            <button
              type="button"
              onClick={onAddNew}
              className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-neutral-300 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors hover:border-brand-accent hover:text-brand-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Add New
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
