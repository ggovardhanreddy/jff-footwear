"use client";

import { useMemo } from "react";
import { estimateDelivery } from "@/lib/delivery";
import type { DeliveryEstimate } from "@/types";

export function useDeliveryEstimate(destinationState: string): DeliveryEstimate {
  return useMemo(
    () => estimateDelivery(destinationState),
    [destinationState]
  );
}
