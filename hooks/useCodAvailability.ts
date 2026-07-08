"use client";

import { useEffect, useMemo, useState } from "react";
import { checkCodAvailability } from "@/lib/delivery";
import { isValidPincode } from "@/lib/pincode";
import type { CodAvailability } from "@/types";

export function useCodAvailability(
  pincode: string,
  deliveryAvailable: boolean
): CodAvailability {
  const [result, setResult] = useState<CodAvailability>({
    available: false,
    checked: false,
    message: "",
  });

  useEffect(() => {
    if (!isValidPincode(pincode)) {
      setResult({ available: false, checked: false, message: "" });
      return;
    }

    const availability = checkCodAvailability(pincode, deliveryAvailable);
    setResult(availability);
  }, [pincode, deliveryAvailable]);

  return useMemo(() => result, [result]);
}
