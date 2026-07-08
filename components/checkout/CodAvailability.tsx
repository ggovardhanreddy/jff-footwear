"use client";

import { Banknote, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CodAvailability } from "@/types";

interface CodAvailabilityProps {
  availability: CodAvailability;
  className?: string;
}

export default function CodAvailabilityBadge({
  availability,
  className,
}: CodAvailabilityProps) {
  if (!availability.checked) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-4",
        availability.available
          ? "border-emerald-200/80 bg-white/80"
          : "border-gray-200 bg-white/60",
        className
      )}
      role="status"
    >
      <Banknote
        className={cn(
          "h-5 w-5 shrink-0",
          availability.available ? "text-emerald-600" : "text-brand-muted"
        )}
        aria-hidden
      />
      <div className="flex items-center gap-2">
        {availability.available ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
        ) : (
          <XCircle className="h-4 w-4 text-brand-muted" aria-hidden />
        )}
        <p
          className={cn(
            "text-sm font-medium",
            availability.available ? "text-emerald-700" : "text-brand-muted"
          )}
        >
          {availability.available ? "✅ " : "❌ "}
          {availability.message}
        </p>
      </div>
    </div>
  );
}
