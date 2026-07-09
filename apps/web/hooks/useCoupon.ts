"use client";

import { useCallback, useEffect, useState } from "react";
import { PRICING_CONFIG } from "@/lib/pricing-config";
import {
  getCouponLabel,
  isValidCouponCode,
  resolveCouponDiscount,
} from "@/lib/pricing";
import { readStorage, writeStorage } from "@/lib/storage";

const COUPON_STORAGE_KEY = "jff-coupon";

export function useCoupon(cartSellingTotal = 0) {
  const [input, setInput] = useState("");
  const [appliedCode, setAppliedCode] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage<string>(COUPON_STORAGE_KEY, "");
    if (stored && isValidCouponCode(stored)) {
      setAppliedCode(stored.toUpperCase());
      setInput(stored.toUpperCase());
      setIsSuccess(true);
      setMessage(`${getCouponLabel(stored)} applied`);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(COUPON_STORAGE_KEY, appliedCode);
  }, [appliedCode, hydrated]);

  const apply = useCallback(() => {
    const code = input.trim().toUpperCase();
    if (!code) {
      setAppliedCode("");
      setMessage("");
      setIsSuccess(false);
      return;
    }

    if (!isValidCouponCode(code)) {
      setAppliedCode("");
      setMessage("Invalid coupon code. Try JFF20 or WELCOME10.");
      setIsSuccess(false);
      return;
    }

    const label = getCouponLabel(code);
    setAppliedCode(code);
    setIsSuccess(true);
    setMessage(`${label} applied successfully!`);
  }, [input]);

  const remove = useCallback(() => {
    setInput("");
    setAppliedCode("");
    setMessage("Coupon removed.");
    setIsSuccess(false);
  }, []);

  const syncAppliedCode = useCallback(
    (code: string) => {
      const normalized = code.trim().toUpperCase();
      if (!normalized) {
        remove();
        return;
      }
      if (!isValidCouponCode(normalized)) return;
      setInput(normalized);
      setAppliedCode(normalized);
      setIsSuccess(true);
      setMessage(`${getCouponLabel(normalized)} applied successfully!`);
    },
    [remove]
  );

  const discount = appliedCode
    ? resolveCouponDiscount(appliedCode, cartSellingTotal)
    : 0;

  return {
    input,
    setInput,
    appliedCode,
    applied: isSuccess && !!appliedCode,
    message,
    isSuccess,
    isError: !!message && !isSuccess,
    discount,
    apply,
    remove,
    syncAppliedCode,
    enabled: PRICING_CONFIG.coupon.enabled,
    hydrated,
  };
}
