"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { buildWhatsAppUrl, validateQuantityForOrderType } from "@jff/utils/wholesale";
import { cn } from "@/lib/utils";

interface DistributorEnquiryFormProps {
  className?: string;
}

const initialState = {
  companyName: "",
  contactPerson: "",
  phone: "",
  email: "",
  gstNumber: "",
  territory: "",
  monthlyVolume: "",
  channels: "",
  hasWarehouse: "",
  message: "",
};

export default function DistributorEnquiryForm({
  className,
}: DistributorEnquiryFormProps) {
  const [formData, setFormData] = useState(initialState);
  const [volumeError, setVolumeError] = useState("");

  const update = (field: keyof typeof initialState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "monthlyVolume") setVolumeError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const volume = Number(formData.monthlyVolume) || 0;
    const moqCheck = validateQuantityForOrderType(volume, "Distributor");
    if (formData.monthlyVolume && !moqCheck.valid) {
      setVolumeError(
        `Indicative monthly volume should meet distributor MOQ (${moqCheck.moq}+ pairs).`
      );
      return;
    }

    const message = [
      "Hello JFF, I am interested in becoming a distributor.",
      "",
      `Company: ${formData.companyName}`,
      `Contact: ${formData.contactPerson}`,
      `Phone: ${formData.phone}`,
      `Email: ${formData.email}`,
      `GST: ${formData.gstNumber || "Not provided"}`,
      "",
      `Territory / States: ${formData.territory}`,
      `Est. Monthly Volume: ${formData.monthlyVolume || "TBD"} pairs`,
      `Distribution Channels: ${formData.channels || "TBD"}`,
      `Own Warehouse: ${formData.hasWarehouse || "TBD"}`,
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
        <p className="eyebrow text-brand-accent">Distributor Programme</p>
        <h3 className="mt-2 font-display text-xl font-bold">Distributor Enquiry</h3>
        <p className="mt-2 text-sm text-brand-muted">
          Apply for territorial distribution with volume pricing and dedicated support.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dist-company" className="eyebrow mb-2 block text-brand-muted">
            Company Name
          </label>
          <input
            id="dist-company"
            required
            value={formData.companyName}
            onChange={(e) => update("companyName", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="dist-contact" className="eyebrow mb-2 block text-brand-muted">
            Contact Person
          </label>
          <input
            id="dist-contact"
            required
            value={formData.contactPerson}
            onChange={(e) => update("contactPerson", e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dist-phone" className="eyebrow mb-2 block text-brand-muted">
            Phone
          </label>
          <input
            id="dist-phone"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="dist-email" className="eyebrow mb-2 block text-brand-muted">
            Email
          </label>
          <input
            id="dist-email"
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
          <label htmlFor="dist-gst" className="eyebrow mb-2 block text-brand-muted">
            GST Number
          </label>
          <input
            id="dist-gst"
            value={formData.gstNumber}
            onChange={(e) => update("gstNumber", e.target.value)}
            className="input-field"
            placeholder="Optional"
          />
        </div>
        <div>
          <label htmlFor="dist-territory" className="eyebrow mb-2 block text-brand-muted">
            Territory / States Covered
          </label>
          <input
            id="dist-territory"
            required
            value={formData.territory}
            onChange={(e) => update("territory", e.target.value)}
            className="input-field"
            placeholder="e.g. Andhra Pradesh, Telangana"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="dist-volume" className="eyebrow mb-2 block text-brand-muted">
            Est. Monthly Volume (pairs)
          </label>
          <input
            id="dist-volume"
            type="number"
            min={200}
            value={formData.monthlyVolume}
            onChange={(e) => update("monthlyVolume", e.target.value)}
            className="input-field"
            placeholder="e.g. 500"
          />
          {volumeError ? (
            <p className="mt-1 text-xs text-red-600" role="alert">
              {volumeError}
            </p>
          ) : (
            <p className="mt-1 text-xs text-brand-muted">Distributor MOQ: 200+ pairs per order</p>
          )}
        </div>
        <div>
          <label htmlFor="dist-warehouse" className="eyebrow mb-2 block text-brand-muted">
            Own Warehouse?
          </label>
          <select
            id="dist-warehouse"
            value={formData.hasWarehouse}
            onChange={(e) => update("hasWarehouse", e.target.value)}
            className="input-field"
          >
            <option value="">Select</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="Planning">Planning to set up</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="dist-channels" className="eyebrow mb-2 block text-brand-muted">
          Distribution Channels
        </label>
        <input
          id="dist-channels"
          value={formData.channels}
          onChange={(e) => update("channels", e.target.value)}
          className="input-field"
          placeholder="Retail networks, e-commerce, institutional..."
        />
      </div>

      <div>
        <label htmlFor="dist-message" className="eyebrow mb-2 block text-brand-muted">
          Message
        </label>
        <textarea
          id="dist-message"
          rows={4}
          value={formData.message}
          onChange={(e) => update("message", e.target.value)}
          className="input-field resize-none"
          placeholder="Tell us about your distribution experience..."
        />
      </div>

      <Button type="submit" variant="whatsapp" className="w-full">
        <Send className="h-4 w-4" />
        Submit Distributor Enquiry
      </Button>
    </form>
  );
}
