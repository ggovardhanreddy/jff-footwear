import { SHIPPING_CONFIG } from "@jff/config/shipping";
import { isValidPincode } from "@jff/utils/pincode";
import type { CodAvailability, DeliveryAvailability, DeliveryEstimate } from "@jff/types";

function normalizeState(state: string): string {
  return state.trim().toLowerCase();
}

function isNeighbouringState(origin: string, destination: string): boolean {
  const key = Object.keys(SHIPPING_CONFIG.neighbouringStates).find(
    (s) => normalizeState(s) === normalizeState(origin)
  );
  if (!key) return false;
  return SHIPPING_CONFIG.neighbouringStates[key].some(
    (s) => normalizeState(s) === normalizeState(destination)
  );
}

function isPincodeInList(pincode: string, list: string[]): boolean {
  if (list.length === 0) return false;
  return list.includes(pincode);
}

/** Check if delivery is available for a PIN code */
export function checkDeliveryAvailability(pincode: string): DeliveryAvailability {
  if (!isValidPincode(pincode)) {
    return {
      available: false,
      checked: false,
      message: "",
    };
  }

  const { SUPPORTED_DELIVERY_PINCODES, ALLOW_ALL_DELIVERY_WHEN_LIST_EMPTY } =
    SHIPPING_CONFIG;

  if (
    SUPPORTED_DELIVERY_PINCODES.length === 0 &&
    ALLOW_ALL_DELIVERY_WHEN_LIST_EMPTY
  ) {
    return {
      available: true,
      checked: true,
      message: SHIPPING_CONFIG.messages.deliveryAvailable,
    };
  }

  const available = isPincodeInList(pincode, SUPPORTED_DELIVERY_PINCODES);

  return {
    available,
    checked: true,
    message: available
      ? SHIPPING_CONFIG.messages.deliveryAvailable
      : SHIPPING_CONFIG.messages.deliveryUnavailable,
  };
}

/** Check COD availability for a PIN code */
export function checkCodAvailability(
  pincode: string,
  deliveryAvailable: boolean
): CodAvailability {
  if (!isValidPincode(pincode) || !deliveryAvailable) {
    return {
      available: false,
      checked: false,
      message: SHIPPING_CONFIG.messages.codUnavailable,
    };
  }

  const { SUPPORTED_COD_PINCODES, ALLOW_COD_WHEN_LIST_EMPTY } = SHIPPING_CONFIG;

  if (SUPPORTED_COD_PINCODES.length === 0 && ALLOW_COD_WHEN_LIST_EMPTY) {
    return {
      available: true,
      checked: true,
      message: SHIPPING_CONFIG.messages.codAvailable,
    };
  }

  const available = isPincodeInList(pincode, [...SUPPORTED_COD_PINCODES]);

  return {
    available,
    checked: true,
    message: available
      ? SHIPPING_CONFIG.messages.codAvailable
      : SHIPPING_CONFIG.messages.codUnavailable,
  };
}

function addBusinessDays(from: Date, days: number): Date {
  const result = new Date(from);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

function formatDeliveryDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

/** Estimate delivery window from warehouse to destination state */
export function estimateDelivery(destinationState: string): DeliveryEstimate {
  const origin = SHIPPING_CONFIG.WAREHOUSE_STATE;
  const dest = destinationState.trim();

  let tier: DeliveryEstimate["tier"] = "other";
  let range: { minDays: number; maxDays: number; label: string } =
    SHIPPING_CONFIG.deliveryEstimate.other;

  if (!dest) {
    return {
      tier: "other",
      minDays: range.minDays,
      maxDays: range.maxDays,
      label: range.label,
      deliveryBy: "",
    };
  }

  if (normalizeState(dest) === normalizeState(origin)) {
    tier = "same_state";
    range = SHIPPING_CONFIG.deliveryEstimate.sameState;
  } else if (
    isNeighbouringState(origin, dest) ||
    isNeighbouringState(dest, origin)
  ) {
    tier = "neighbouring";
    range = SHIPPING_CONFIG.deliveryEstimate.neighbouring;
  }

  const deliveryBy = formatDeliveryDate(
    addBusinessDays(new Date(), range.maxDays)
  );

  return {
    tier,
    minDays: range.minDays,
    maxDays: range.maxDays,
    label: range.label,
    deliveryBy,
  };
}
