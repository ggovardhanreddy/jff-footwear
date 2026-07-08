"use client";

import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import Button from "@/components/ui/Button";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const fields = [
  { id: "contact-name", name: "name", label: "Name", type: "text", required: true },
  { id: "contact-email", name: "email", label: "Email", type: "email", required: true },
  { id: "contact-phone", name: "phone", label: "Phone", type: "tel", required: false },
  { id: "contact-subject", name: "subject", label: "Subject", type: "text", required: true },
] as const;

interface ContactFormProps {
  defaultSubject?: string;
}

export default function ContactForm({ defaultSubject = "" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: defaultSubject,
    message: "",
  });

  useEffect(() => {
    if (defaultSubject) {
      setFormData((prev) => ({ ...prev, subject: defaultSubject }));
    }
  }, [defaultSubject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      "Hello JFF,",
      "",
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Phone: ${formData.phone}`,
      `Subject: ${formData.subject}`,
      "",
      formData.message,
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-[28px] border border-black/[0.06] bg-white/80 p-6 shadow-soft backdrop-blur-md md:p-8"
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">
        {fields.slice(0, 2).map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="eyebrow mb-2 block text-brand-muted">
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.name}
              type={field.type}
              required={field.required}
              autoComplete={field.name === "name" ? "name" : field.name === "email" ? "email" : undefined}
              value={formData[field.name]}
              onChange={(e) =>
                setFormData({ ...formData, [field.name]: e.target.value })
              }
              className="input-field"
            />
          </div>
        ))}
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {fields.slice(2).map((field) => (
          <div key={field.id}>
            <label htmlFor={field.id} className="eyebrow mb-2 block text-brand-muted">
              {field.label}
            </label>
            <input
              id={field.id}
              name={field.name}
              type={field.type}
              required={field.required}
              autoComplete={field.name === "phone" ? "tel" : undefined}
              value={formData[field.name]}
              onChange={(e) =>
                setFormData({ ...formData, [field.name]: e.target.value })
              }
              className="input-field"
            />
          </div>
        ))}
      </div>
      <div>
        <label htmlFor="contact-message" className="eyebrow mb-2 block text-brand-muted">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="input-field resize-none"
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" variant="primary" className="flex-1">
          <Send className="h-4 w-4" />
          Send Message
        </Button>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello JFF, I would like to get in touch.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp flex-1 justify-center"
        >
          Chat on WhatsApp
        </a>
      </div>
    </form>
  );
}
