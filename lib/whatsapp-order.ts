import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatINR } from "@/lib/pricing";
import type {
  CartItem,
  CodAvailability,
  DeliveryAddress,
  DeliveryEstimate,
  OrderSummaryBreakdown,
} from "@/types";

interface BuildOrderWhatsAppParams {
  items: CartItem[];
  address: DeliveryAddress;
  summary: OrderSummaryBreakdown;
  couponCode?: string;
  estimate?: DeliveryEstimate;
  cod?: CodAvailability;
  specialNotes?: string;
}

export function buildOrderWhatsAppMessage({
  items,
  address,
  summary,
  couponCode,
  estimate,
  cod,
  specialNotes,
}: BuildOrderWhatsAppParams): string {
  const lines: string[] = ["Hello JFF,", "", "I would like to order:", ""];

  items.forEach((item, index) => {
    if (items.length > 1) {
      lines.push(`— Item ${index + 1} —`);
    }
    lines.push(
      "Product:",
      item.name,
      "",
      "Size:",
      String(item.size),
      "",
      "Color:",
      item.color,
      "",
      "Quantity:",
      String(item.quantity),
      "",
      "MRP:",
      formatINR(item.pricing.mrp),
      "",
      "Discount:",
      formatINR(item.pricing.discount),
      "",
      "Selling Price:",
      formatINR(item.pricing.sellingPrice),
      ""
    );
  });

  lines.push(
    "Delivery Address",
    "",
    "Name:",
    address.fullName,
    "",
    "Phone:",
    address.mobile
  );

  if (address.alternativeMobile) {
    lines.push("", "Alternative Phone:", address.alternativeMobile);
  }

  lines.push(
    "",
    "Flat/House:",
    address.flatHouse,
    "",
    "Area:",
    address.area,
    ""
  );

  if (address.landmark) {
    lines.push("Landmark:", address.landmark, "");
  }

  lines.push(
    "PIN Code:",
    address.pincode,
    "",
    "City:",
    address.city,
    "",
    "District:",
    address.district,
    "",
    "State:",
    address.state,
    "",
    "Country:",
    address.country || "India"
  );

  if (address.postOffice) {
    lines.push("", "Post Office:", address.postOffice);
  }

  lines.push("", "Address Type:", address.addressType, "", "Order Summary", "");

  lines.push(
    "MRP (Total):",
    formatINR(summary.subtotal),
    "",
    "Discount:",
    formatINR(summary.productDiscount),
    "",
    "Selling Price:",
    formatINR(summary.cartSellingTotal),
    "",
    "Platform Fee:",
    formatINR(summary.platformFee),
    "",
    "Delivery:",
    summary.deliveryCharge === 0 ? "FREE" : formatINR(summary.deliveryCharge)
  );

  if (summary.couponDiscount > 0) {
    lines.push(
      "",
      "Coupon Discount:",
      formatINR(summary.couponDiscount),
      couponCode ? `(Code: ${couponCode.trim().toUpperCase()})` : ""
    );
  }

  lines.push(
    "",
    "Grand Total:",
    formatINR(summary.grandTotal),
    "",
    `You Saved ${formatINR(summary.totalSavings)}`
  );

  if (estimate?.deliveryBy) {
    lines.push("", "Estimated Delivery Date:", estimate.deliveryBy);
  }

  if (cod?.checked) {
    lines.push(
      "",
      "COD Status:",
      cod.available ? "Available" : "Not Available"
    );
  }

  if (specialNotes?.trim()) {
    lines.push("", "Special Notes:", specialNotes.trim());
  }

  lines.push("", "Please confirm my order.");

  return lines.join("\n");
}

export function buildOrderWhatsAppUrl(
  params: BuildOrderWhatsAppParams
): string {
  const message = buildOrderWhatsAppMessage(params);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
