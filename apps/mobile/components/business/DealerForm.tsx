import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  Pressable,
  Linking,
  View,
} from "react-native";
import { DEALER_BUSINESS_TYPES } from "@jff/shared/pages";
import { WHATSAPP_NUMBER } from "@jff/config/constants";
import { buildWhatsAppUrl } from "@jff/utils/wholesale";

const initialState = {
  businessName: "",
  contactPerson: "",
  phone: "",
  email: "",
  gstNumber: "",
  city: "",
  state: "",
  businessType: "",
  yearsInBusiness: "",
  message: "",
};

export default function DealerForm() {
  const [formData, setFormData] = useState(initialState);

  const update = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (
      !formData.businessName ||
      !formData.contactPerson ||
      !formData.phone ||
      !formData.email ||
      !formData.city ||
      !formData.state ||
      !formData.businessType ||
      !formData.yearsInBusiness
    ) {
      return;
    }

    const message = [
      "Hello JFF, I would like to register as a dealer.",
      "",
      `Business Name: ${formData.businessName}`,
      `Contact Person: ${formData.contactPerson}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      `GST Number: ${formData.gstNumber || "Not provided"}`,
      `City: ${formData.city}`,
      `State: ${formData.state}`,
      `Business Type: ${formData.businessType}`,
      `Years in Business: ${formData.yearsInBusiness}`,
      "",
      formData.message,
    ].join("\n");

    Linking.openURL(buildWhatsAppUrl(WHATSAPP_NUMBER, message));
  };

  return (
    <View className="gap-4">
      {(
        [
          ["businessName", "Business Name", "default"],
          ["contactPerson", "Contact Person", "default"],
          ["phone", "Phone", "phone-pad"],
          ["email", "Email", "email-address"],
          ["gstNumber", "GST Number (optional)", "default"],
          ["city", "City", "default"],
          ["state", "State", "default"],
          ["yearsInBusiness", "Years in Business", "numeric"],
        ] as const
      ).map(([key, label, keyboard]) => (
        <View key={key}>
          <Text className="mb-1 text-xs font-semibold uppercase text-brand-muted">
            {label}
          </Text>
          <TextInput
            className="rounded-xl border border-black/10 bg-white px-4 py-3 text-brand-black"
            value={formData[key]}
            onChangeText={(v) => update(key, v)}
            keyboardType={keyboard === "default" ? "default" : keyboard}
            autoCapitalize={keyboard === "email-address" ? "none" : "words"}
          />
        </View>
      ))}

      <View>
        <Text className="mb-1 text-xs font-semibold uppercase text-brand-muted">
          Business Type
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {DEALER_BUSINESS_TYPES.map((type) => (
              <Pressable
                key={type}
                onPress={() => update("businessType", type)}
                className={`rounded-full border px-4 py-2 ${
                  formData.businessType === type
                    ? "border-brand-black bg-brand-black"
                    : "border-black/10 bg-white"
                }`}
              >
                <Text
                  className={
                    formData.businessType === type ? "text-white" : "text-brand-black"
                  }
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      <View>
        <Text className="mb-1 text-xs font-semibold uppercase text-brand-muted">
          Message
        </Text>
        <TextInput
          className="min-h-[100px] rounded-xl border border-black/10 bg-white px-4 py-3 text-brand-black"
          value={formData.message}
          onChangeText={(v) => update("message", v)}
          multiline
          textAlignVertical="top"
          placeholder="Tell us about your business..."
        />
      </View>

      <Pressable
        className="rounded-2xl bg-brand-black py-4"
        onPress={handleSubmit}
      >
        <Text className="text-center font-semibold text-white">
          Submit on WhatsApp
        </Text>
      </Pressable>
    </View>
  );
}
