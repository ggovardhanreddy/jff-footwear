import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatINR } from "@/lib/pricing";
import type {
  CartItem,
  DeliveryAddress,
  OrderSummaryBreakdown,
} from "@/types";

interface BuildOrderWhatsAppParams {
  items: CartItem[];
  address: DeliveryAddress;
  summary: OrderSummaryBreakdown;
  couponCode?: string;
}

export function buildOrderWhatsAppUrl({
  items,
  address,
  summary,
  couponCode,
}: BuildOrderWhatsAppParams): string {
  const message = buildOrderWhatsAppMessage({
    items,
    address,
    summary,
    couponCode,
  });
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function buildOrderWhatsAppMessage({
  items,
  address,
  summary,
  couponCode,
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
      "Quantity:",
      String(item.quantity),
      "",
      "Price:",
      formatINR(item.pricing.sellingPrice),
      ""
    );
  });

  lines.push(
    "Delivery Address",
    "",
    `Name:`,
    address.fullName,
    "",
    `Phone:`,
    address.mobile
  );

  if (address.alternativeMobile) {
    lines.push("", `Alternative Phone:`, address.alternativeMobile);
  }

  lines.push(
    "",
    `Flat/House:`,
    address.flatHouse,
    "",
    `Area:`,
    address.area,
    ""
  );

  if (address.landmark) {
    lines.push(`Landmark:`, address.landmark, "");
  }

  lines.push(
    `City:`,
    address.city,
    "",
    `State:`,
    address.state,
    "",
    `Pincode:`,
    address.pincode,
    "",
    `Address Type:`,
    address.addressType,
    "",
    "Order Summary",
    "",
    `Subtotal:`,
    formatINR(summary.subtotal),
    "",
    `Discount:`,
    formatINR(summary.productDiscount),
    "",
    `Platform Fee:`,
    formatINR(summary.platformFee),
    "",
    `Delivery Charge:`,
    summary.deliveryCharge === 0 ? "FREE" : formatINR(summary.deliveryCharge)
  );

  if (summary.couponDiscount > 0) {
    lines.push(
      "",
      `Coupon Discount:`,
      formatINR(summary.couponDiscount),
      couponCode ? `(Code: ${couponCode.trim().toUpperCase()})` : ""
    );
  }

  lines.push(
    "",
    `Grand Total:`,
    formatINR(summary.grandTotal),
    "",
    `You Saved ${formatINR(summary.totalSavings)}`,
    "",
    "Please confirm my order."
  );

  return lines.join("\n");
}
