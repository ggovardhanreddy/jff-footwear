"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { buildWhatsAppUrl, validateQuantityForOrderType } from "@jff/utils/wholesale";
import { cn } from "@/lib/utils";

interface OEMEnquiryFormProps {
  className?: string;
}

const initialState = {
  brandName: "",
  contactPerson: "",
  phone: "",
  email: "",
  productType: "",
  targetMoq: "",
  logoRequired: "Yes",
  packaging: "",
  timeline: "",
  samplesRequired: "Yes",
  message: "",
};

export default function OEMEnquiryForm({ className }: OEMEnquiryFormProps) {
  const [formData, setFormData] = useState(initialState);
  const [moqError, setMoqError] = useState("");

  const update = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "targetMoq") setMoqError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const moq = Number(formData.targetMoq) || 0;
    const moqCheck = validateQuantityForOrderType(moq, "Wholesale");
    if (formData.targetMoq && moq > 0 && !moqCheck.valid) {
      setMoqError(moqCheck.message);
      return;
    }

    const message = [
      "Hello JFF, I am interested in private label / OEM manufacturing.",
      "",
      `Brand: ${formData.brandName}`,
      `Contact: ${formData.contactPerson}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      "",
      `Product Type: ${formData.productType}`,
      `Target MOQ: ${formData.targetMoq || "TBD"} pairs`,
      `Custom Logo: ${formData.logoRequired}`,
      `Packaging: ${formData.packaging || "TBD"}`,
      `Timeline: ${formData.timeline || "TBD"}`,
      `Samples Required: ${formData.samplesRequired}`,
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
        <p className="eyebrow text-brand-accent">OEM / Private Label</p>
        <h3 className="mt-2 font-display text-xl font-bold">Manufacturing Enquiry</h3>
        <p className="mt-2 text-sm text-brand-muted">
          Custom branding, logo printing, packaging, and bulk production for your brand.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="oem-brand" className="eyebrow mb-2 block text-brand-muted">
            Brand / Company Name
          </label>
          <input
            id="oem-brand"
            required
            value={formData.brandName}
            onChange={(e) => update("brandName", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="oem-contact" className="eyebrow mb-2 block text-brand-muted">
            Contact Person
          </label>
          <input
            id="oem-contact"
            required
            value={formData.contactPerson}
            onChange={(e) => update("contactPerson", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="oem-phone" className="eyebrow mb-2 block text-brand-muted">
            Phone
          </label>
          <input
            id="oem-phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="oem-email" className="eyebrow mb-2 block text-brand-muted">
            Email
          </label>
          <input
            id="oem-email"
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
          <label htmlFor="oem-product" className="eyebrow mb-2 block text-brand-muted">
            Product Type
          </label>
          <input
            id="oem-product"
            required
            value={formData.productType}
            onChange={(e) => update("productType", e.target.value)}
            className="input-field"
            placeholder="e.g. EVA slides, orthopedic slippers"
          />
        </div>
        <div>
          <label htmlFor="oem-moq" className="eyebrow mb-2 block text-brand-muted">
            Target MOQ (pairs)
          </label>
          <input
            id="oem-moq"
            type="number"
            min={50}
            value={formData.targetMoq}
            onChange={(e) => update("targetMoq", e.target.value)}
            className="input-field"
            placeholder="e.g. 500"
          />
          {moqError && (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {moqError}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        <div>
          <label htmlFor="oem-logo" className="eyebrow mb-2 block text-brand-muted">
            Custom Logo?
          </label>
          <select
            id="oem-logo"
            value={formData.logoRequired}
            onChange={(e) => update("logoRequired", e.target.value)}
            className="input-field"
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Undecided">Undecided</option>
          </select>
        </div>
        <div>
          <label htmlFor="oem-packaging" className="eyebrow mb-2 block text-brand-muted">
            Packaging
          </label>
          <input
            id="oem-packaging"
            value={formData.packaging}
            onChange={(e) => update("packaging", e.target.value)}
            className="input-field"
            placeholder="Premium box, bulk pack..."
          />
        </div>
        <div>
          <label htmlFor="oem-timeline" className="eyebrow mb-2 block text-brand-muted">
            Timeline
          </label>
          <input
            id="oem-timeline"
            value={formData.timeline}
            onChange={(e) => update("timeline", e.target.value)}
            className="input-field"
            placeholder="e.g. 6 weeks"
          />
        </div>
      </div>

      <div>
        <label htmlFor="oem-samples" className="eyebrow mb-2 block text-brand-muted">
          Samples Required?
        </label>
        <select
          id="oem-samples"
          value={formData.samplesRequired}
          onChange={(e) => update("samplesRequired", e.target.value)}
          className="input-field sm:max-w-xs"
        >
          <option value="Yes">Yes</option>
          <option value="No">No</option>
          <option value="Later">Maybe later</option>
        </select>
      </div>

      <div>
        <label htmlFor="oem-message" className="eyebrow mb-2 block text-brand-muted">
          Project Details
        </label>
        <textarea
          id="oem-message"
          rows={4}
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          className="input-field resize-none"
          placeholder="Logo placement, colourways, target markets..."
        />
      </div>

      <Button type="submit" variant="whatsapp" className="w-full">
        <Send className="h-4 w-4" />
        Request OEM Quote on WhatsApp
      </Button>
    </form>
  );
}
