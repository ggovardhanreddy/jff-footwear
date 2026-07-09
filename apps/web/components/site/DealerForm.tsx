"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { DEALER_BUSINESS_TYPES } from "@/data/pages";
import { buildWhatsAppUrl } from "@jff/utils/wholesale";
import { cn } from "@/lib/utils";

interface DealerFormProps {
  className?: string;
}

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

export default function DealerForm({ className }: DealerFormProps) {
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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

    window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, message), "_blank");
  };

  const update = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "space-y-6 rounded-[28px] border border-black/[0.06] bg-white/80 p-6 shadow-soft backdrop-blur-md md:p-8",
        className
      )}
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dealer-business" className="eyebrow mb-2 block text-brand-muted">
            Business Name
          </label>
          <input
            id="dealer-business"
            required
            value={formData.businessName}
            onChange={(e) => update("businessName", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="dealer-contact" className="eyebrow mb-2 block text-brand-muted">
            Contact Person
          </label>
          <input
            id="dealer-contact"
            required
            value={formData.contactPerson}
            onChange={(e) => update("contactPerson", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dealer-phone" className="eyebrow mb-2 block text-brand-muted">
            Phone
          </label>
          <input
            id="dealer-phone"
            type="tel"
            required
            autoComplete="tel"
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="dealer-email" className="eyebrow mb-2 block text-brand-muted">
            Email
          </label>
          <input
            id="dealer-email"
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dealer-gst" className="eyebrow mb-2 block text-brand-muted">
            GST Number
          </label>
          <input
            id="dealer-gst"
            value={formData.gstNumber}
            onChange={(e) => update("gstNumber", e.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="dealer-city" className="eyebrow mb-2 block text-brand-muted">
            City
          </label>
          <input
            id="dealer-city"
            required
            value={formData.city}
            onChange={(e) => update("city", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dealer-state" className="eyebrow mb-2 block text-brand-muted">
            State
          </label>
          <input
            id="dealer-state"
            required
            value={formData.state}
            onChange={(e) => update("state", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="dealer-type" className="eyebrow mb-2 block text-brand-muted">
            Business Type
          </label>
          <select
            id="dealer-type"
            required
            value={formData.businessType}
            onChange={(e) => update("businessType", e.target.value)}
            className="input-field"
          >
            <option value="">Select type</option>
            {DEALER_BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="dealer-years" className="eyebrow mb-2 block text-brand-muted">
          Years in Business
        </label>
        <input
          id="dealer-years"
          required
          value={formData.yearsInBusiness}
          onChange={(e) => update("yearsInBusiness", e.target.value)}
          className="input-field"
          placeholder="e.g. 3"
        />
      </div>

      <div>
        <label htmlFor="dealer-message" className="eyebrow mb-2 block text-brand-muted">
          Message
        </label>
        <textarea
          id="dealer-message"
          rows={4}
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          className="input-field resize-none"
          placeholder="Tell us about your business and requirements..."
        />
      </div>

      <Button type="submit" variant="whatsapp" className="w-full">
        <Send className="h-4 w-4" />
        Become a Dealer
      </Button>
    </form>
  );
}
