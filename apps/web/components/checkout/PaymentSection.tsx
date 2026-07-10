"use client";

import { MessageCircle, ShieldCheck, CreditCard, Wallet, Coins } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import { PAYMENT_SECTION } from "@/lib/checkout-styles";
import { buttonMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { formatCoins, coinsToInr, JFF_COINS } from "@jff/api/coins";
import { formatINR } from "@/lib/pricing";

export type CheckoutPaymentMethod =
  "whatsapp" | "razorpay" | "cod" | "upi" | "card" | "wallet" | "netbanking";

interface PaymentSectionProps {
  disabled: boolean;
  isSubmitting?: boolean;
  onPlaceOrder: () => void;
  submitError?: string;
  className?: string;
  paymentMethod: CheckoutPaymentMethod;
  onPaymentMethodChange: (method: CheckoutPaymentMethod) => void;
  coinBalance: number;
  coinsToRedeem: number;
  onCoinsToRedeemChange: (coins: number) => void;
  razorpayAvailable: boolean;
  signedIn: boolean;
}

const METHODS: {
  id: CheckoutPaymentMethod;
  label: string;
  hint: string;
}[] = [
  {
    id: "whatsapp",
    label: "WhatsApp / Pay later",
    hint: "Free — confirm on WhatsApp",
  },
  { id: "cod", label: "Cash on Delivery", hint: "Pay when delivered" },
  { id: "upi", label: "UPI", hint: "Via Razorpay" },
  { id: "card", label: "Cards", hint: "Via Razorpay" },
  { id: "wallet", label: "Wallet", hint: "Via Razorpay" },
  { id: "netbanking", label: "Net Banking", hint: "Via Razorpay" },
  { id: "razorpay", label: "Razorpay Checkout", hint: "All digital methods" },
];

export default function PaymentSection({
  disabled,
  isSubmitting = false,
  onPlaceOrder,
  submitError,
  className,
  paymentMethod,
  onPaymentMethodChange,
  coinBalance,
  coinsToRedeem,
  onCoinsToRedeemChange,
  razorpayAvailable,
  signedIn,
}: PaymentSectionProps) {
  const reduced = useReducedMotion();
  const { whileHover, whileTap, transition } = buttonMotion(reduced);
  const coinValue = coinsToInr(coinsToRedeem);
  const maxRedeem = Math.min(coinBalance, Math.max(0, Math.floor(coinBalance / 1)));
  const digital =
    paymentMethod === "razorpay" ||
    paymentMethod === "upi" ||
    paymentMethod === "card" ||
    paymentMethod === "wallet" ||
    paymentMethod === "netbanking";

  return (
    <div className={cn(PAYMENT_SECTION, "space-y-5", className)}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15">
          <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-black dark:text-white">Choose payment</p>
          <p className="mt-0.5 text-xs leading-relaxed text-brand-muted">
            WhatsApp checkout works with ₹0 setup. Razorpay unlocks when you add free test keys.
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {METHODS.map((m) => {
          const needsRazorpay = !["whatsapp", "cod"].includes(m.id);
          const locked = needsRazorpay && !razorpayAvailable;
          return (
            <button
              key={m.id}
              type="button"
              disabled={locked}
              onClick={() => onPaymentMethodChange(m.id)}
              className={cn(
                "rounded-2xl border px-4 py-3 text-left transition",
                paymentMethod === m.id
                  ? "border-brand-accent bg-brand-accent/10"
                  : "border-black/10 dark:border-white/10",
                locked && "cursor-not-allowed opacity-40"
              )}
            >
              <p className="text-sm font-semibold">{m.label}</p>
              <p className="text-[11px] text-brand-muted">
                {locked ? "Add Razorpay keys" : m.hint}
              </p>
            </button>
          );
        })}
      </div>

      {signedIn && coinBalance >= JFF_COINS.minRedeem && (
        <div className="rounded-2xl border border-brand-accent/30 bg-brand-accent/5 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Coins className="h-4 w-4 text-brand-accent" />
            Redeem JFF Coins ({formatCoins(coinBalance)} available)
          </div>
          <input
            type="range"
            min={0}
            max={maxRedeem}
            step={10}
            value={coinsToRedeem}
            onChange={(e) => onCoinsToRedeemChange(Number(e.target.value))}
            className="mt-3 w-full accent-[#c8a96e]"
          />
          <p className="mt-1 text-xs text-brand-muted">
            Redeeming {formatCoins(coinsToRedeem)} ≈ {formatINR(coinValue)} off
          </p>
        </div>
      )}

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
          variant={paymentMethod === "whatsapp" ? "whatsapp" : "primary"}
          size="lg"
          className="w-full !py-4 text-base"
          disabled={disabled || isSubmitting}
          onClick={onPlaceOrder}
        >
          {paymentMethod === "whatsapp" ? (
            <MessageCircle className="h-5 w-5" />
          ) : digital ? (
            <CreditCard className="h-5 w-5" />
          ) : (
            <Wallet className="h-5 w-5" />
          )}
          {isSubmitting
            ? "Processing…"
            : paymentMethod === "whatsapp"
              ? "Proceed to WhatsApp Order"
              : paymentMethod === "cod"
                ? "Place COD Order"
                : "Pay securely"}
        </Button>
      </motion.div>
    </div>
  );
}
