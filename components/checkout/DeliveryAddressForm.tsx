"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";
import type { AddressType, DeliveryAddress, DeliveryAddressErrors } from "@/types";

interface DeliveryAddressFormProps {
  value: DeliveryAddress;
  errors: DeliveryAddressErrors;
  onChange: (address: DeliveryAddress) => void;
  onBlurField?: (field: keyof DeliveryAddress) => void;
  className?: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-red-600" role="alert">
      {message}
    </p>
  );
}

interface FieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block text-brand-muted">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

const inputClass = (hasError?: boolean) =>
  cn("input-field", hasError && "border-red-400 focus:border-red-500");

export default function DeliveryAddressForm({
  value,
  errors,
  onChange,
  onBlurField,
  className,
}: DeliveryAddressFormProps) {
  const formId = useId();

  const update = <K extends keyof DeliveryAddress>(
    field: K,
    fieldValue: DeliveryAddress[K]
  ) => {
    onChange({ ...value, [field]: fieldValue });
  };

  return (
    <form
      id={formId}
      className={cn("space-y-6", className)}
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <div>
        <p className="eyebrow text-brand-accent">Checkout</p>
        <h2 className="heading-section mt-2 text-brand-black">Deliver To</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-fullName`}
          label="Full Name"
          required
          error={errors.fullName}
        >
          <input
            id={`${formId}-fullName`}
            type="text"
            autoComplete="name"
            value={value.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            onBlur={() => onBlurField?.("fullName")}
            aria-invalid={!!errors.fullName}
            className={inputClass(!!errors.fullName)}
          />
        </Field>

        <Field
          id={`${formId}-mobile`}
          label="Mobile Number"
          required
          error={errors.mobile}
        >
          <input
            id={`${formId}-mobile`}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="10-digit mobile"
            value={value.mobile}
            onChange={(e) =>
              update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            onBlur={() => onBlurField?.("mobile")}
            aria-invalid={!!errors.mobile}
            className={inputClass(!!errors.mobile)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-flatHouse`}
          label="Flat / House / Building"
          required
          error={errors.flatHouse}
        >
          <input
            id={`${formId}-flatHouse`}
            type="text"
            autoComplete="address-line1"
            value={value.flatHouse}
            onChange={(e) => update("flatHouse", e.target.value)}
            onBlur={() => onBlurField?.("flatHouse")}
            aria-invalid={!!errors.flatHouse}
            className={inputClass(!!errors.flatHouse)}
          />
        </Field>

        <Field
          id={`${formId}-area`}
          label="Area / Sector / Locality"
          required
          error={errors.area}
        >
          <input
            id={`${formId}-area`}
            type="text"
            autoComplete="address-line2"
            value={value.area}
            onChange={(e) => update("area", e.target.value)}
            onBlur={() => onBlurField?.("area")}
            aria-invalid={!!errors.area}
            className={inputClass(!!errors.area)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field id={`${formId}-city`} label="City" required error={errors.city}>
          <input
            id={`${formId}-city`}
            type="text"
            autoComplete="address-level2"
            value={value.city}
            onChange={(e) => update("city", e.target.value)}
            onBlur={() => onBlurField?.("city")}
            aria-invalid={!!errors.city}
            className={inputClass(!!errors.city)}
          />
        </Field>

        <Field
          id={`${formId}-state`}
          label="State"
          required
          error={errors.state}
        >
          <input
            id={`${formId}-state`}
            type="text"
            autoComplete="address-level1"
            value={value.state}
            onChange={(e) => update("state", e.target.value)}
            onBlur={() => onBlurField?.("state")}
            aria-invalid={!!errors.state}
            className={inputClass(!!errors.state)}
          />
        </Field>

        <Field
          id={`${formId}-pincode`}
          label="Pincode"
          required
          error={errors.pincode}
        >
          <input
            id={`${formId}-pincode`}
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder="6-digit pincode"
            value={value.pincode}
            onChange={(e) =>
              update("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            onBlur={() => onBlurField?.("pincode")}
            aria-invalid={!!errors.pincode}
            className={inputClass(!!errors.pincode)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id={`${formId}-altMobile`}
          label="Alternative Mobile Number"
          error={errors.alternativeMobile}
        >
          <input
            id={`${formId}-altMobile`}
            type="tel"
            inputMode="numeric"
            placeholder="Optional"
            value={value.alternativeMobile}
            onChange={(e) =>
              update(
                "alternativeMobile",
                e.target.value.replace(/\D/g, "").slice(0, 10)
              )
            }
            onBlur={() => onBlurField?.("alternativeMobile")}
            aria-invalid={!!errors.alternativeMobile}
            className={inputClass(!!errors.alternativeMobile)}
          />
        </Field>

        <Field id={`${formId}-landmark`} label="Landmark">
          <input
            id={`${formId}-landmark`}
            type="text"
            placeholder="Optional"
            value={value.landmark}
            onChange={(e) => update("landmark", e.target.value)}
            className="input-field"
          />
        </Field>
      </div>

      <fieldset>
        <legend className="eyebrow mb-3 block text-brand-muted">
          Address Type
        </legend>
        <div className="flex flex-wrap gap-4">
          {(["Home", "Work"] as AddressType[]).map((type) => (
            <label
              key={type}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                value.addressType === type
                  ? "border-brand-accent bg-brand-accent/10 text-brand-black"
                  : "border-gray-200 hover:border-brand-accent/50"
              )}
            >
              <input
                type="radio"
                name={`${formId}-addressType`}
                value={type}
                checked={value.addressType === type}
                onChange={() => update("addressType", type)}
                className="accent-brand-accent"
              />
              {type}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={value.isDefault}
          onChange={(e) => update("isDefault", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 accent-brand-accent"
        />
        Set as Default Address
      </label>
    </form>
  );
}
