import { WHATSAPP_NUMBER } from "@/lib/constants";
import { formatINR } from "@/lib/pricing";
import { calculateCustomOrderPricing } from "@/lib/customizer/pricing";
import type { ProductCustomization } from "@/types/customizer";

export function buildCustomOrderWhatsAppMessage(
  config: ProductCustomization
): string {
  const pricing = calculateCustomOrderPricing(config);

  const lines: string[] = [
    "Hello JFF,",
    "",
    "I would like to place a custom order:",
    "",
    "— Product Customization —",
    `Category: ${config.category}`,
    `Gender: ${config.gender}`,
    `Material: ${config.material}`,
    `Sole Type: ${config.soleType}`,
    `Strap Type: ${config.strapType}`,
    `Color: ${config.color}`,
    `Size: ${config.size}`,
    `Quantity: ${config.quantity} pairs`,
    "",
    "— Packaging & Order —",
    `Packaging: ${config.packaging}`,
    `Order Type: ${config.orderType}`,
  ];

  if (config.customLogo) {
    lines.push(
      "",
      "— Custom Branding —",
      "Custom Logo: Yes",
      config.logoFileName ? `Logo File: ${config.logoFileName}` : "",
      config.logoPosition ? `Logo Position: ${config.logoPosition}` : "",
      "(I will send the logo file in this chat)"
    );
  } else {
    lines.push("", "Custom Logo: No");
  }

  if (config.deliveryPincode) {
    lines.push(
      "",
      "— Delivery —",
      `PIN Code: ${config.deliveryPincode}`,
      config.deliveryState ? `State: ${config.deliveryState}` : "",
      config.deliveryBy ? `Estimated Delivery: ${config.deliveryBy}` : ""
    );
  }

  lines.push(
    "",
    "— Price Summary —",
    `MRP (per pair): ${formatINR(pricing.mrp)}`,
    `Selling Price (per pair): ${formatINR(pricing.sellingPrice)}`,
    `Subtotal (${pricing.quantity} pairs): ${formatINR(pricing.cartSellingTotal)}`
  );

  if (pricing.bulkDiscountPercent > 0) {
    lines.push(
      `Bulk Discount (${pricing.bulkDiscountPercent}%): -${formatINR(pricing.bulkDiscountAmount)}`
    );
  }

  lines.push(
    `Platform Fee: ${formatINR(pricing.platformFee)}`,
    `Delivery: ${pricing.deliveryCharge === 0 ? "FREE" : formatINR(pricing.deliveryCharge)}`,
    `Grand Total: ${formatINR(pricing.grandTotal)}`,
    `Total Savings: ${formatINR(pricing.totalSavings)}`
  );

  if (config.specialInstructions.trim()) {
    lines.push("", "Special Instructions:", config.specialInstructions.trim());
  }

  lines.push("", "Please confirm my custom order. Thank you!");

  return lines.filter(Boolean).join("\n");
}

export function buildCustomOrderWhatsAppUrl(
  config: ProductCustomization
): string {
  const message = buildCustomOrderWhatsAppMessage(config);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
