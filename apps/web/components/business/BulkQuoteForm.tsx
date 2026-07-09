"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { WHATSAPP_NUMBER, PRODUCT_CATEGORIES } from "@/lib/constants";
import { buildWhatsAppUrl, validateQuantityForOrderType } from "@jff/utils/wholesale";
import { cn } from "@/lib/utils";

interface BulkQuoteFormProps {
  className?: string;
}

const initialState = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  category: "",
  productInterest: "",
  quantity: "50",
  deliveryPincode: "",
  deliveryState: "",
  gstNumber: "",
  message: "",
};

export default function BulkQuoteForm({ className }: BulkQuoteFormProps) {
  const [formData, setFormData] = useState(initialState);
  const [moqError, setMoqError] = useState("");

  const update = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "quantity") setMoqError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(formData.quantity) || 0;
    const moqCheck = validateQuantityForOrderType(qty, "Wholesale");
    if (!moqCheck.valid) {
      setMoqError(moqCheck.message);
      return;
    }

    const message = [
      "Hello JFF, I would like a bulk / wholesale quote.",
      "",
      `Company: ${formData.companyName}`,
      `Contact: ${formData.contactPerson}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      `GST: ${formData.gstNumber || "Not provided"}`,
      "",
      `Category: ${formData.category || "Any"}`,
      `Product / Style: ${formData.productInterest || "Open to suggestions"}`,
      `Quantity: ${qty} pairs`,
      `Delivery PIN: ${formData.deliveryPincode || "TBD"}`,
      `Delivery State: ${formData.deliveryState || "TBD"}`,
      "",
      formData.message,
    ].join("\n");

    window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, message), "_blank");
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
      <div>
        <p className="eyebrow text-brand-accent">Bulk Quote</p>
        <h3 className="mt-2 font-display text-xl font-bold">Request Wholesale Pricing</h3>
        <p className="mt-2 text-sm text-brand-muted">
          Share your requirements and we will respond with availability and competitive
          pricing on WhatsApp.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="bulk-company" className="eyebrow mb-2 block text-brand-muted">
            Company / Store Name
          </label>
          <input
            id="bulk-company"
            required
            value={formData.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="bulk-contact" className="eyebrow mb-2 block text-brand-muted">
            Contact Person
          </label>
          <input
            id="bulk-contact"
            required
            value={formData.contactPerson}
            onChange={(e) => update("contactPerson", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="bulk-phone" className="eyebrow mb-2 block text-brand-muted">
            Phone
          </label>
          <input
            id="bulk-phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="bulk-email" className="eyebrow mb-2 block text-brand-muted">
            Email
          </label>
          <input
            id="bulk-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => update("email", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="bulk-category" className="eyebrow mb-2 block text-brand-muted">
            Category
          </label>
          <select
            id="bulk-category"
            value={formData.category}
            onChange={(e) => update("category", e.target.value)}
            className="input-field"
          >
            <option value="">Any category</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="bulk-qty" className="eyebrow mb-2 block text-brand-muted">
            Quantity (pairs)
          </label>
          <input
            id="bulk-qty"
            type="number"
            min={50}
            required
            value={formData.quantity}
            onChange={(e) => update("quantity", e.target.value)}
            className="input-field"
          />
          {moqError ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {moqError}
            </p>
          ) : (
            <p className="mt-1 text-xs text-brand-muted">Wholesale MOQ: 50 pairs</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="bulk-product" className="eyebrow mb-2 block text-brand-muted">
          Product / Style Interest
        </label>
        <input
          id="bulk-product"
          value={formData.productInterest}
          onChange={(e) => update("productInterest", e.target.value)}
          className="input-field"
          placeholder="e.g. JFF-001, orthopedic range, mixed assortment"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="bulk-pin" className="eyebrow mb-2 block text-brand-muted">
            Delivery PIN
          </label>
          <input
            id="bulk-pin"
            inputMode="numeric"
            maxLength={6}
            value={formData.deliveryPincode}
            onChange={(e) => update("deliveryPincode", e.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="bulk-state" className="eyebrow mb-2 block text-brand-muted">
            Delivery State
          </label>
          <input
            id="bulk-state"
            value={formData.deliveryState}
            onChange={(e) => update("deliveryState", e.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="bulk-gst" className="eyebrow mb-2 block text-brand-muted">
            GST Number
          </label>
          <input
            id="bulk-gst"
            value={formData.gstNumber}
            onChange={(e) => update("gstNumber", e.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>
      </div>

      <div>
        <label htmlFor="bulk-message" className="eyebrow mb-2 block text-brand-muted">
          Additional Details
        </label>
        <textarea
          id="bulk-message"
          rows={4}
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          className="input-field resize-none"
          placeholder="Size mix, timeline, packaging preferences..."
        />
      </div>

      <Button type="submit" variant="whatsapp" className="w-full">
        <Send className="h-4 w-4" />
        Request Bulk Quote on WhatsApp
      </Button>
    </form>
  );
}
