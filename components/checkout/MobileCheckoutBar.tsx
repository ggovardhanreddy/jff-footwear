"use client";

import { MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import { formatINR } from "@/lib/pricing";
import { buttonMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MobileCheckoutBarProps {
  grandTotal: number;
  disabled: boolean;
  onPlaceOrder: () => void;
  label?: string;
}

export default function MobileCheckoutBar({
  grandTotal,
  disabled,
  onPlaceOrder,
  label = "Place Order",
}: MobileCheckoutBarProps) {
  const reduced = useReducedMotion();
  const { whileHover, whileTap, transition } = buttonMotion(reduced);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-black/[0.06] bg-white/90 p-4 backdrop-blur-xl lg:hidden",
        "pb-[max(1rem,env(safe-area-inset-bottom))]"
      )}
    >
      <div className="container-custom flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-muted">
            Grand Total
          </p>
          <p className="font-display text-2xl font-bold tabular-nums text-brand-black">
            {formatINR(grandTotal)}
          </p>
        </div>
        <motion.div
          className="shrink-0"
          whileHover={whileHover}
          whileTap={whileTap}
          transition={transition}
        >
          <Button
            type="button"
            variant="whatsapp"
            size="lg"
            disabled={disabled}
            onClick={onPlaceOrder}
            className="!px-6"
          >
            <MessageCircle className="h-5 w-5" />
            {label}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
