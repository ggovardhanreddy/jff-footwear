"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import Button from "@/components/ui/Button";
import ShippingInfo from "./ShippingInfo";
import SavingsCard from "./SavingsCard";
import AnimatedPrice from "./AnimatedPrice";
import { formatINR, formatINRSigned } from "@/lib/pricing";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import { checkoutSuccessSpring } from "@/lib/checkout-motion";
import { buttonMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type {
  CodAvailability,
  DeliveryAddress,
  DeliveryEstimate,
  OrderSummaryBreakdown,
} from "@/types";

interface OrderConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  address: DeliveryAddress;
  summary: OrderSummaryBreakdown;
  estimate?: DeliveryEstimate;
  cod?: CodAvailability;
  couponCode?: string;
  specialNotes?: string;
  onSpecialNotesChange?: (notes: string) => void;
  isSubmitting?: boolean;
}

export default function OrderConfirmationModal({
  open,
  onClose,
  onConfirm,
  address,
  summary,
  estimate,
  cod,
  couponCode,
  specialNotes = "",
  onSpecialNotesChange,
  isSubmitting = false,
}: OrderConfirmationModalProps) {
  const reduced = useReducedMotion();
  const { whileHover, whileTap, transition } = buttonMotion(reduced);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-brand-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-order-title"
          onClick={onClose}
        >
          <motion.div
            {...checkoutSuccessSpring}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[32px] border border-white/20 bg-white shadow-2xl sm:rounded-[32px]"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-black/[0.06] bg-white/95 px-6 py-4 backdrop-blur-md">
              <h2
                id="confirm-order-title"
                className="font-display text-xl font-bold text-brand-black"
              >
                Review Order
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-brand-muted transition-colors hover:bg-neutral-100 hover:text-brand-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <ShippingInfo
                address={address}
                estimate={estimate}
                cod={cod}
              />

              <div className="rounded-[22px] bg-neutral-50/80 p-4">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-muted">
                  Price Summary
                </p>
                <dl className="space-y-2 text-sm">
                  <PriceLine label="MRP" value={formatINR(summary.subtotal)} strike />
                  <PriceLine
                    label="Discount"
                    value={formatINRSigned(-summary.productDiscount)}
                    green
                  />
                  <PriceLine
                    label="Platform Fee"
                    value={formatINR(summary.platformFee)}
                  />
                  <PriceLine
                    label="Delivery Charge"
                    value={
                      summary.deliveryCharge === 0
                        ? "FREE"
                        : formatINR(summary.deliveryCharge)
                    }
                    green={summary.deliveryCharge === 0}
                  />
                  {summary.couponDiscount > 0 && (
                    <PriceLine
                      label={`Coupon${couponCode ? ` (${couponCode})` : ""}`}
                      value={formatINRSigned(-summary.couponDiscount)}
                      green
                    />
                  )}
                </dl>
                <div className="mt-4 flex items-end justify-between border-t border-black/[0.08] pt-4">
                  <span className="font-display text-lg font-bold">Grand Total</span>
                  <AnimatedPrice
                    value={summary.grandTotal}
                    className="font-display text-3xl font-bold text-brand-black"
                  />
                </div>
              </div>

              <SavingsCard totalSavings={summary.totalSavings} />

              {estimate?.deliveryBy && (
                <p className="text-center text-sm text-brand-muted">
                  🚚 Delivery by{" "}
                  <span className="font-semibold text-emerald-600">
                    {estimate.deliveryBy}
                  </span>
                </p>
              )}

              <div>
                <label
                  htmlFor="special-notes"
                  className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-muted"
                >
                  Special Notes (Optional)
                </label>
                <textarea
                  id="special-notes"
                  rows={3}
                  value={specialNotes}
                  onChange={(e) => onSpecialNotesChange?.(e.target.value)}
                  placeholder="Gift wrap, delivery instructions, etc."
                  className="input-field mt-2 w-full resize-none rounded-2xl py-3 text-sm"
                />
              </div>

              <motion.div
                whileHover={whileHover}
                whileTap={whileTap}
                transition={transition}
              >
                <Button
                  type="button"
                  variant="whatsapp"
                  size="lg"
                  className="w-full !py-4 text-base"
                  disabled={isSubmitting}
                  onClick={onConfirm}
                >
                  <MessageCircle className="h-5 w-5" />
                  Place Order
                </Button>
              </motion.div>

              <p className="text-center text-[11px] text-brand-muted">
                {PRICING_CONFIG.taxNote}. Order will open in WhatsApp.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PriceLine({
  label,
  value,
  strike,
  green,
}: {
  label: string;
  value: string;
  strike?: boolean;
  green?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-brand-muted">{label}</dt>
      <dd
        className={cn(
          "font-medium tabular-nums",
          strike && "line-through text-brand-muted",
          green && "font-semibold text-emerald-600"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
