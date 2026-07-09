"use client";

import { MessageCircle, ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import { PAYMENT_SECTION } from "@/lib/checkout-styles";
import { buttonMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PaymentSectionProps {
  disabled: boolean;
  isSubmitting?: boolean;
  onPlaceOrder: () => void;
  submitError?: string;
  className?: string;
}

export default function PaymentSection({
  disabled,
  isSubmitting = false,
  onPlaceOrder,
  submitError,
  className,
}: PaymentSectionProps) {
  const reduced = useReducedMotion();
  const { whileHover, whileTap, transition } = buttonMotion(reduced);

  return (
    <div className={cn(PAYMENT_SECTION, "space-y-4", className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
          <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-black">
            Secure WhatsApp Checkout
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-brand-muted">
            No online payment required. Confirm your order directly with JFF on
            WhatsApp — fast, personal, and secure.
          </p>
        </div>
      </div>

      {submitError && (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {submitError}
        </p>
      )}

      <motion.div
        whileHover={whileHover}
        whileTap={whileTap}
        transition={transition}
        className="hidden lg:block"
      >
        <Button
          type="button"
          variant="whatsapp"
          size="lg"
          className="w-full !py-4 text-base"
          disabled={disabled || isSubmitting}
          onClick={onPlaceOrder}
        >
          <MessageCircle className="h-5 w-5" />
          Proceed to WhatsApp Order
        </Button>
      </motion.div>

      <p className="hidden text-center text-[11px] leading-relaxed text-brand-muted lg:block">
        By placing your order, you agree to confirm availability and pricing on
        WhatsApp.
      </p>
    </div>
  );
}
