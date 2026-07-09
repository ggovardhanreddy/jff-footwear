import { View, Text } from "react-native";
import type { OrderSummaryBreakdown } from "@jff/types";
import { formatINR } from "@jff/utils/pricing";

interface OrderSummaryCardProps {
  summary: OrderSummaryBreakdown;
  couponCode?: string;
}

function Row({
  label,
  value,
  accent,
  bold,
}: {
  label: string;
  value: string;
  accent?: boolean;
  bold?: boolean;
}) {
  return (
    <View className="flex-row justify-between py-1.5">
      <Text className={`text-sm ${bold ? "font-semibold text-brand-black dark:text-white" : "text-brand-muted"}`}>
        {label}
      </Text>
      <Text
        className={`text-sm ${bold ? "font-bold text-brand-black dark:text-white" : accent ? "font-semibold text-emerald-600" : "text-brand-black dark:text-white"}`}
      >
        {value}
      </Text>
    </View>
  );
}

export default function OrderSummaryCard({ summary, couponCode }: OrderSummaryCardProps) {
  return (
    <View className="rounded-2xl bg-white p-4 dark:bg-white/10">
      <Text className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-muted">
        Order Summary
      </Text>
      <Row label="MRP total" value={formatINR(summary.subtotal)} />
      <Row label="Product discount" value={`-${formatINR(summary.productDiscount)}`} accent />
      <Row label="Selling subtotal" value={formatINR(summary.cartSellingTotal)} />
      <Row label="Platform fee" value={formatINR(summary.platformFee)} />
      <Row
        label="Delivery"
        value={summary.deliveryCharge === 0 ? "FREE" : formatINR(summary.deliveryCharge)}
        accent={summary.deliveryCharge === 0}
      />
      {summary.couponDiscount > 0 && (
        <Row
          label={couponCode ? `Coupon (${couponCode})` : "Coupon"}
          value={`-${formatINR(summary.couponDiscount)}`}
          accent
        />
      )}
      <View className="my-2 border-t border-brand-light dark:border-white/10" />
      <Row label="Grand total" value={formatINR(summary.grandTotal)} bold />
      {summary.totalSavings > 0 && (
        <Text className="mt-2 text-center text-xs font-semibold text-emerald-600">
          You save {formatINR(summary.totalSavings)}
        </Text>
      )}
      {summary.isFreeDelivery && (
        <Text className="mt-2 text-center text-xs text-brand-muted">
          Free delivery applied
        </Text>
      )}
    </View>
  );
}
