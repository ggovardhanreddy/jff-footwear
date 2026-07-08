"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PincodeLookupStatus } from "@/hooks/usePincodeLookup";

interface PincodeInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  status?: PincodeLookupStatus;
  statusMessage?: string;
  className?: string;
}

export default function PincodeInput({
  id,
  value,
  onChange,
  onBlur,
  error,
  status = "idle",
  statusMessage,
  className,
}: PincodeInputProps) {
  const isLoading = status === "loading";
  const describedBy: string[] = [];

  if (error) describedBy.push(`${id}-error`);
  if (statusMessage) describedBy.push(`${id}-status`);

  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="6-digit PIN code"
          value={value}
          maxLength={6}
          onChange={(e) =>
            onChange(e.target.value.replace(/\D/g, "").slice(0, 6))
          }
          onBlur={onBlur}
          aria-invalid={!!error || status === "invalid"}
          aria-describedby={
            describedBy.length > 0 ? describedBy.join(" ") : undefined
          }
          className={cn(
            "input-field pr-10",
            (error || status === "invalid") &&
              "border-red-400 focus:border-red-500"
          )}
        />
        {isLoading && (
          <span
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-brand-muted"
            aria-hidden
          >
            <Loader2 className="h-4 w-4 animate-spin" />
          </span>
        )}
      </div>

      {statusMessage && (
        <p
          id={`${id}-status`}
          className={cn(
            "mt-1.5 text-xs",
            status === "loading" && "text-brand-muted",
            status === "success" && "text-emerald-600",
            (status === "not_found" ||
              status === "network_error" ||
              status === "invalid") &&
              "text-amber-700"
          )}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </p>
      )}

      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
