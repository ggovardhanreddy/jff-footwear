"use client";

import { MapPin, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CurrentLocationButtonProps {
  onResolve: () => void;
  isLoading?: boolean;
  error?: string;
  className?: string;
}

export default function CurrentLocationButton({
  onResolve,
  isLoading = false,
  error,
  className,
}: CurrentLocationButtonProps) {
  const reduced = useReducedMotion();

  return (
    <div className={cn("space-y-2", className)}>
      <motion.button
        type="button"
        onClick={onResolve}
        disabled={isLoading}
        whileTap={reduced ? undefined : { scale: 0.97 }}
        aria-busy={isLoading}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-brand-accent/30",
          "bg-brand-accent/5 px-5 py-3 text-sm font-semibold text-brand-black transition-colors",
          "hover:border-brand-accent hover:bg-brand-accent/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent",
          "disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <span aria-hidden>📍</span>
        )}
        Use Current Location
      </motion.button>
      {error && (
        <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
