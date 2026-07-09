import { Link } from "expo-router";
import { ScrollView, Text, View, Pressable, TextInput } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/providers";
import {
  calculateOrderSummary,
  formatINR,
  isValidCouponCode,
  getCouponLabel,
} from "@jff/utils/pricing";
import { getJson, setJson, storageKeys } from "@/lib/storage";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import ScreenShell from "@/components/ScreenShell";
import { useNetwork } from "@/lib/network/NetworkProvider";

export default function CartScreen() {
  const { items, count, removeItem, updateQuantity } = useCart();
  const { isOnline } = useNetwork();
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    const stored = getJson<string>(storageKeys.coupon, "");
    if (stored) {
      setAppliedCoupon(stored);
      setCouponInput(stored);
      if (isValidCouponCode(stored)) {
        setCouponMessage(`${getCouponLabel(stored)} applied`);
      }
    }
  }, []);

  const summary = useMemo(
    () => calculateOrderSummary(items, appliedCoupon),
    [items, appliedCoupon]
  );

  function applyCoupon() {
    const code = couponInput.trim().toUpperCase();
    if (!code) {
      setAppliedCoupon("");
      setCouponMessage("");
      setJson(storageKeys.coupon, "");
      return;
    }
    if (!isValidCouponCode(code)) {
      setCouponMessage("Invalid code. Try JFF20 or WELCOME10.");
      return;
    }
    setAppliedCoupon(code);
    setJson(storageKeys.coupon, code);
    setCouponMessage(`${getCouponLabel(code)} applied`);
  }

  return (
    <ScreenShell>
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="mb-1 text-2xl font-semibold text-brand-black dark:text-white">
          Cart ({count})
        </Text>
        {!isOnline && (
          <Text className="mb-3 text-xs text-amber-700 dark:text-amber-400">
            Offline — your cart is saved on this device
          </Text>
        )}
        {items.length === 0 ? (
          <Text className="text-brand-muted dark:text-zinc-400">
            Your cart is empty. Browse products to add items.
          </Text>
        ) : (
          <View className="gap-4 pb-8">
            {items.map((item) => (
              <View
                key={item.id}
                className="rounded-2xl bg-white p-4 dark:bg-white/10"
              >
                <Text className="font-semibold text-brand-black dark:text-white">
                  {item.name}
                </Text>
                <Text className="text-brand-muted dark:text-zinc-400">
                  Size {item.size} · {item.color} × {item.quantity}
                </Text>
                <Text className="mt-1 font-medium text-brand-black dark:text-white">
                  {formatINR(item.pricing.sellingPrice * item.quantity)}
                </Text>
                <View className="mt-3 flex-row items-center gap-3">
                  <Pressable
                    onPress={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="h-9 w-9 items-center justify-center rounded-lg border border-brand-light dark:border-white/20"
                  >
                    <Text className="text-lg font-bold">−</Text>
                  </Pressable>
                  <Text className="min-w-[2rem] text-center font-semibold text-brand-black dark:text-white">
                    {item.quantity}
                  </Text>
                  <Pressable
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-9 w-9 items-center justify-center rounded-lg border border-brand-light dark:border-white/20"
                  >
                    <Text className="text-lg font-bold">+</Text>
                  </Pressable>
                  <Pressable onPress={() => removeItem(item.id)} className="ml-auto">
                    <Text className="text-red-600">Remove</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            <View className="rounded-2xl bg-white p-4 dark:bg-white/10">
              <Text className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-muted">
                Coupon Code
              </Text>
              <View className="flex-row gap-2">
                <TextInput
                  value={couponInput}
                  onChangeText={setCouponInput}
                  placeholder="JFF20 or WELCOME10"
                  autoCapitalize="characters"
                  className="flex-1 rounded-xl border border-brand-light bg-brand-cream px-3 py-3 text-brand-black dark:border-white/10 dark:bg-white/5 dark:text-white"
                />
                <Pressable
                  onPress={applyCoupon}
                  className="justify-center rounded-xl bg-brand-black px-4 dark:bg-brand-blue"
                >
                  <Text className="text-sm font-semibold text-white">Apply</Text>
                </Pressable>
              </View>
              {couponMessage ? (
                <Text className="mt-2 text-xs text-emerald-600">{couponMessage}</Text>
              ) : null}
            </View>

            <OrderSummaryCard summary={summary} couponCode={appliedCoupon} />

            <Link href="/checkout" asChild>
              <Pressable className="rounded-2xl bg-brand-black py-4 dark:bg-brand-blue">
                <Text className="text-center font-semibold text-white">
                  Proceed to Checkout
                </Text>
              </Pressable>
            </Link>
          </View>
        )}
      </ScrollView>
    </ScreenShell>
  );
}
