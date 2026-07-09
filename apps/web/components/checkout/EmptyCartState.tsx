"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import { checkoutPanelReveal } from "@/lib/checkout-motion";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface EmptyCartStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function EmptyCartState({
  title = "Your cart is empty",
  description = "Discover our premium collection and find your perfect pair.",
  className,
}: EmptyCartStateProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      {...checkoutPanelReveal(reduced)}
      className={cn(
        "mx-auto max-w-md py-16 text-center",
        className
      )}
    >
      <div className="relative mx-auto mb-8 h-40 w-40">
        <motion.div
          animate={reduced ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-[40px] bg-gradient-to-br from-brand-cream to-brand-accent/20 shadow-inner"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">
            <ShoppingBag className="h-9 w-9 text-brand-accent" aria-hidden />
          </div>
        </div>
        <motion.span
          className="absolute -right-2 top-4 text-2xl"
          animate={reduced ? undefined : { rotate: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          aria-hidden
        >
          ✨
        </motion.span>
      </div>

      <h2 className="font-display text-2xl font-bold tracking-tight text-brand-black">
        {title}
      </h2>
      <p className="mt-3 text-[15px] leading-relaxed text-brand-muted">
        {description}
      </p>
      <div className="mt-8">
        <ButtonLink href={ROUTES.products} size="lg">
          Explore Collection
        </ButtonLink>
      </div>
    </motion.div>
  );
}
