"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md";
}

export default function WishlistButton({
  product,
  className,
  size = "md",
}: WishlistButtonProps) {
  const { isWishlisted, toggle } = useWishlist();
  const { show } = useToast();
  const reduced = useReducedMotion();
  const active = isWishlisted(product.slug);

  const handleClick = () => {
    toggle(product);
    show(
      active ? "Removed from wishlist" : "Saved to wishlist ❤️",
      "success"
    );
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      whileTap={reduced ? undefined : { scale: 0.9 }}
      className={cn(
        "rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
        active
          ? "border-red-200 bg-red-50 text-red-500"
          : "border-black/10 bg-white/90 text-brand-muted hover:border-red-200 hover:text-red-500 dark:border-white/10 dark:bg-brand-dark",
        size === "sm" ? "p-2" : "p-2.5",
        className
      )}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
    >
      <Heart
        className={cn(size === "sm" ? "h-4 w-4" : "h-5 w-5", active && "fill-current")}
      />
    </motion.button>
  );
}
