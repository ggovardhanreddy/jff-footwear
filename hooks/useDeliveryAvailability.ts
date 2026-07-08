"use client";

import { useEffect, useMemo, useState } from "react";
import { checkDeliveryAvailability } from "@/lib/delivery";
import { isValidPincode } from "@/lib/pincode";
import type { DeliveryAvailability } from "@/types";

export function useDeliveryAvailability(pincode: string): DeliveryAvailability {
  const [result, setResult] = useState<DeliveryAvailability>({
    available: false,
    checked: false,
    message: "",
  });

  useEffect(() => {
    if (!isValidPincode(pincode)) {
      setResult({ available: false, checked: false, message: "" });
      return;
    }

    const availability = checkDeliveryAvailability(pincode);
    setResult(availability);
  }, [pincode]);

  return useMemo(() => result, [result]);
}
