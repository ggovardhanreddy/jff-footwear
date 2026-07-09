import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TextInput,
  View,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { deliveryAddressSchema } from "@jff/shared/validation/address-schema";
import type { DeliveryAddress } from "@jff/types";
import { useCart } from "@/lib/providers";
import {
  calculateOrderSummary,
  formatINR,
  isValidCouponCode,
  getCouponLabel,
} from "@jff/utils/pricing";
import { buildOrderWhatsAppUrl } from "@jff/utils/whatsapp-order";
import { lookupPincode } from "@jff/utils/pincode";
import {
  checkCodAvailability,
  checkDeliveryAvailability,
  estimateDelivery,
} from "@jff/utils/delivery";
import { getJson, setJson, storageKeys } from "@/lib/storage";
import OrderSummaryCard from "@/components/OrderSummaryCard";
import BrandAtmosphere from "@/components/brand/BrandAtmosphere";

export default function CheckoutScreen() {
  const { items, clear } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [codLabel, setCodLabel] = useState("");
  const [deliveryBy, setDeliveryBy] = useState("");

  useEffect(() => {
    const stored = getJson<string>(storageKeys.coupon, "");
    if (stored && isValidCouponCode(stored)) setAppliedCoupon(stored);
  }, []);

  const summary = useMemo(
    () => ({
      ...calculateOrderSummary(items, appliedCoupon),
      estimatedDeliveryBy: deliveryBy,
    }),
    [items, appliedCoupon, deliveryBy]
  );

  const { control, handleSubmit, watch, setValue } = useForm<DeliveryAddress>({
    resolver: zodResolver(deliveryAddressSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      alternativeMobile: "",
      flatHouse: "",
      area: "",
      pincode: "",
      city: "",
      district: "",
      state: "",
      country: "India",
      postOffice: "",
      landmark: "",
      addressType: "Home",
      isDefault: false,
    },
  });

  const pincode = watch("pincode");

  useEffect(() => {
    if (!/^\d{6}$/.test(pincode)) return;
    let cancelled = false;
    (async () => {
      try {
        const result = await lookupPincode(pincode);
        if (cancelled) return;
        setValue("city", result.city);
        setValue("district", result.district);
        setValue("state", result.state);
        setValue("postOffice", result.postOffice ?? "");
        const delivery = checkDeliveryAvailability(pincode);
        const estimate = estimateDelivery(result.state);
        const cod = checkCodAvailability(pincode, delivery.available);
        setDeliveryInfo(
          delivery.available ? "Delivery available" : "Delivery may be limited"
        );
        setCodLabel(cod.available ? "COD available" : "COD not available");
        setDeliveryBy(estimate.deliveryBy);
      } catch {
        if (!cancelled) setDeliveryInfo("Could not verify PIN code.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pincode, setValue]);

  const onSubmit = handleSubmit((address) => {
    const delivery = checkDeliveryAvailability(address.pincode);
    if (delivery.checked && !delivery.available) {
      Alert.alert(
        "Delivery unavailable",
        "This PIN code may not be serviceable. Contact us on WhatsApp for help."
      );
      return;
    }

    const estimate = estimateDelivery(address.state);
    const cod = checkCodAvailability(address.pincode, delivery.available);

    Alert.alert(
      "Place order on WhatsApp?",
      `Grand total: ${formatINR(summary.grandTotal)}. You will confirm with JFF on WhatsApp.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: () => {
            const url = buildOrderWhatsAppUrl({
              items,
              address,
              summary,
              couponCode: appliedCoupon,
              estimate,
              cod,
            });
            void Linking.openURL(url);
            clear();
            setJson(storageKeys.coupon, "");
          },
        },
      ]
    );
  });

  if (items.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-cream p-6 dark:bg-brand-charcoal">
        <Text className="text-brand-muted dark:text-zinc-400">Your cart is empty.</Text>
      </View>
    );
  }

  const fields = [
    ["fullName", "Full Name"],
    ["mobile", "Mobile"],
    ["flatHouse", "Flat / House"],
    ["area", "Area / Street"],
    ["pincode", "PIN Code"],
    ["city", "City"],
    ["district", "District"],
    ["state", "State"],
    ["landmark", "Landmark (optional)"],
  ] as const;

  return (
    <View className="flex-1">
      <BrandAtmosphere />
      <ScrollView className="flex-1 px-5 pt-4">
        <Text className="mb-2 text-2xl font-semibold text-brand-black dark:text-white">
          Checkout
        </Text>
        <Text className="mb-4 text-sm text-brand-muted dark:text-zinc-400">
          Secure WhatsApp checkout — no online payment required.
        </Text>

        {fields.map(([name, label]) => (
          <View key={name} className="mb-3">
            <Text className="mb-1 text-sm text-brand-muted dark:text-zinc-400">{label}</Text>
            <Controller
              control={control}
              name={name}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="rounded-xl border border-brand-light bg-white px-4 py-3 text-brand-black dark:border-white/10 dark:bg-white/10 dark:text-white"
                  value={value ?? ""}
                  onChangeText={onChange}
                  keyboardType={
                    name === "mobile" || name === "pincode" ? "number-pad" : "default"
                  }
                />
              )}
            />
          </View>
        ))}

        {(deliveryInfo || codLabel || deliveryBy) && (
          <View className="mb-4 rounded-2xl bg-blue-50 p-4 dark:bg-blue-950/30">
            {deliveryInfo ? (
              <Text className="text-sm text-brand-black dark:text-white">{deliveryInfo}</Text>
            ) : null}
            {codLabel ? (
              <Text className="mt-1 text-sm text-brand-muted dark:text-zinc-300">{codLabel}</Text>
            ) : null}
            {deliveryBy ? (
              <Text className="mt-1 text-sm font-semibold text-brand-blue dark:text-brand-blue-dark">
                Est. delivery by {deliveryBy}
              </Text>
            ) : null}
          </View>
        )}

        {appliedCoupon ? (
          <Text className="mb-3 text-sm text-emerald-600">
            Coupon {appliedCoupon} ({getCouponLabel(appliedCoupon)}) applied
          </Text>
        ) : null}

        <OrderSummaryCard summary={summary} couponCode={appliedCoupon} />

        <Pressable onPress={onSubmit} className="mb-10 mt-6 rounded-2xl bg-brand-black py-4 dark:bg-brand-blue">
          <Text className="text-center font-semibold text-white">
            Place Order via WhatsApp
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
