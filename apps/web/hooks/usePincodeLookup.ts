"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PINCODE_CONFIG } from "@/lib/pincode-config";
import {
  isValidPincode,
  lookupPincode,
  PincodeLookupError,
  type PincodeLookupResult,
} from "@/lib/pincode";

export type PincodeLookupStatus =
  | "idle"
  | "loading"
  | "success"
  | "invalid"
  | "not_found"
  | "network_error";

export interface UsePincodeLookupResult {
  status: PincodeLookupStatus;
  data: PincodeLookupResult | null;
  errorMessage: string;
  isLoading: boolean;
  manualOverride: boolean;
  enableManualOverride: () => void;
  reset: () => void;
}

export function usePincodeLookup(pincode: string): UsePincodeLookupResult {
  const [status, setStatus] = useState<PincodeLookupStatus>("idle");
  const [data, setData] = useState<PincodeLookupResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [manualOverride, setManualOverride] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const reset = useCallback(() => {
    setStatus("idle");
    setData(null);
    setErrorMessage("");
    setManualOverride(false);
  }, []);

  const enableManualOverride = useCallback(() => {
    setManualOverride(true);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const digits = pincode.replace(/\D/g, "").slice(0, 6);

    if (digits.length === 0) {
      reset();
      return;
    }

    if (digits.length < 6) {
      setStatus("idle");
      setData(null);
      setErrorMessage("");
      setManualOverride(false);
      return;
    }

    if (!isValidPincode(digits)) {
      setStatus("invalid");
      setData(null);
      setErrorMessage(PINCODE_CONFIG.messages.invalid);
      return;
    }

    setStatus("loading");
    setErrorMessage(PINCODE_CONFIG.messages.loading);
    setManualOverride(false);

    debounceRef.current = setTimeout(() => {
      const requestId = ++requestIdRef.current;

      lookupPincode(digits)
        .then((result) => {
          if (requestId !== requestIdRef.current) return;
          setData(result);
          setStatus("success");
          setErrorMessage("");
        })
        .catch((error: unknown) => {
          if (requestId !== requestIdRef.current) return;
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setData(null);

          if (error instanceof PincodeLookupError) {
            setStatus(error.code);
            setErrorMessage(
              error.code === "not_found"
                ? PINCODE_CONFIG.messages.manualFallback
                : error.message
            );
            if (error.code === "not_found") {
              setManualOverride(true);
            }
            return;
          }

          setStatus("network_error");
          setErrorMessage(PINCODE_CONFIG.messages.manualFallback);
          setManualOverride(true);
        });
    }, PINCODE_CONFIG.debounceMs);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pincode, reset]);

  return {
    status,
    data,
    errorMessage,
    isLoading: status === "loading",
    manualOverride,
    enableManualOverride,
    reset,
  };
}
