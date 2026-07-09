"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import PincodeInput from "@/components/PincodeInput";
import CurrentLocationButton from "@/components/checkout/CurrentLocationButton";
import { usePincodeLookup } from "@/hooks/usePincodeLookup";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { deliveryAddressSchema } from "@/lib/validation/address-schema";
import {
  CHECKOUT_EYEBROW,
  CHECKOUT_INPUT,
  CHECKOUT_SECTION_TITLE,
} from "@/lib/checkout-styles";
import { cn } from "@/lib/utils";
import type { DeliveryAddress, DeliveryAddressErrors } from "@/types";

interface AddressFormProps {
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
  hint?: string;
  children: React.ReactNode;
}

function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow mb-2 block text-brand-muted">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-brand-muted">{hint}</p>
      )}
      <FieldError message={error} />
    </div>
  );
}

const inputClass = (hasError?: boolean, readOnly?: boolean) =>
  cn(
    CHECKOUT_INPUT,
    hasError &&
      "border-red-400 focus:border-red-500 focus:shadow-[0_0_0_4px_rgba(239,68,68,0.12)]",
    readOnly &&
      "cursor-default bg-neutral-50/80 text-brand-black read-only:focus:border-gray-200"
  );

export default function AddressForm({
  value,
  errors: externalErrors,
  onChange,
  onBlurField,
  className,
}: AddressFormProps) {
  const form = useForm<DeliveryAddress>({
    resolver: zodResolver(deliveryAddressSchema),
    defaultValues: value,
    mode: "onBlur",
  });

  const { register, watch, setValue, formState } = form;
  const watched = watch();

  const lookup = usePincodeLookup(watched.pincode);
  const location = useCurrentLocation();

  const lookupFieldsLocked =
    lookup.status === "success" && !lookup.manualOverride;

  useEffect(() => {
    const sub = watch((formValues) => {
      onChange(formValues as DeliveryAddress);
    });
    return () => sub.unsubscribe();
  }, [watch, onChange]);

  useEffect(() => {
    if (lookup.status !== "success" || !lookup.data) return;
    setValue("state", lookup.data.state);
    setValue("district", lookup.data.district);
    setValue("city", lookup.data.city);
    setValue("postOffice", lookup.data.postOffice);
  }, [lookup.status, lookup.data, setValue]);

  const pincodeStatusMessage =
    lookup.status === "loading"
      ? lookup.errorMessage
      : lookup.status === "success"
        ? `Address found — ${lookup.data?.district}, ${lookup.data?.state}`
        : lookup.errorMessage || undefined;

  const fieldError = (field: keyof DeliveryAddress) =>
    externalErrors[field] ||
    (formState.errors[field]?.message as string | undefined);

  const pincodeFieldError =
    fieldError("pincode") ||
    (lookup.status === "invalid" ? lookup.errorMessage : undefined);

  const handleCurrentLocation = async () => {
    const result = await location.requestLocation();
    if (!result) return;
    if (result.area) setValue("area", result.area);
    setValue("city", result.city);
    setValue("district", result.district);
    setValue("state", result.state);
    setValue("country", result.country || "India");
    setValue("pincode", result.pincode);
  };

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={(e) => e.preventDefault()}
      noValidate
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className={CHECKOUT_EYEBROW}>Checkout</p>
          <h2 className={cn(CHECKOUT_SECTION_TITLE, "mt-2 text-2xl")}>
            Deliver To
          </h2>
        </div>
        <CurrentLocationButton
          onResolve={handleCurrentLocation}
          isLoading={location.isLoading}
          error={location.error}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="fullName"
          label="Full Name"
          required
          error={fieldError("fullName")}
        >
          <input
            {...register("fullName")}
            onBlur={() => onBlurField?.("fullName")}
            autoComplete="name"
            aria-invalid={!!fieldError("fullName")}
            className={inputClass(!!fieldError("fullName"))}
          />
        </Field>

        <Field
          id="mobile"
          label="Mobile Number"
          required
          error={fieldError("mobile")}
        >
          <input
            {...register("mobile", {
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
              },
            })}
            onBlur={() => onBlurField?.("mobile")}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="10-digit mobile"
            aria-invalid={!!fieldError("mobile")}
            className={inputClass(!!fieldError("mobile"))}
          />
        </Field>
      </div>

      <Field
        id="alternativeMobile"
        label="Alternative Mobile Number"
        error={fieldError("alternativeMobile")}
      >
        <input
          {...register("alternativeMobile", {
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
            },
          })}
          onBlur={() => onBlurField?.("alternativeMobile")}
          type="tel"
          inputMode="numeric"
          placeholder="Optional"
          aria-invalid={!!fieldError("alternativeMobile")}
          className={inputClass(!!fieldError("alternativeMobile"))}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="flatHouse"
          label="Flat / House / Building"
          required
          error={fieldError("flatHouse")}
        >
          <input
            {...register("flatHouse")}
            onBlur={() => onBlurField?.("flatHouse")}
            autoComplete="address-line1"
            aria-invalid={!!fieldError("flatHouse")}
            className={inputClass(!!fieldError("flatHouse"))}
          />
        </Field>

        <Field
          id="area"
          label="Area / Locality"
          required
          error={fieldError("area")}
        >
          <input
            {...register("area")}
            onBlur={() => onBlurField?.("area")}
            autoComplete="address-line2"
            aria-invalid={!!fieldError("area")}
            className={inputClass(!!fieldError("area"))}
          />
        </Field>
      </div>

      <div>
        <label htmlFor="pincode" className="eyebrow mb-2 block text-brand-muted">
          PIN Code<span className="text-red-500"> *</span>
        </label>
        <PincodeInput
          id="pincode"
          value={watched.pincode}
          onChange={(pin) => setValue("pincode", pin)}
          onBlur={() => onBlurField?.("pincode")}
          error={pincodeFieldError}
          status={lookup.status}
          statusMessage={pincodeStatusMessage}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="city" label="City" required error={fieldError("city")}>
          <input
            {...register("city")}
            onBlur={() => onBlurField?.("city")}
            readOnly={lookupFieldsLocked}
            autoComplete="address-level2"
            aria-invalid={!!fieldError("city")}
            aria-readonly={lookupFieldsLocked}
            className={inputClass(!!fieldError("city"), lookupFieldsLocked)}
          />
        </Field>

        <Field
          id="district"
          label="District"
          required
          error={fieldError("district")}
        >
          <input
            {...register("district")}
            onBlur={() => onBlurField?.("district")}
            readOnly={lookupFieldsLocked}
            aria-invalid={!!fieldError("district")}
            aria-readonly={lookupFieldsLocked}
            className={inputClass(!!fieldError("district"), lookupFieldsLocked)}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="state" label="State" required error={fieldError("state")}>
          <input
            {...register("state")}
            onBlur={() => onBlurField?.("state")}
            readOnly={lookupFieldsLocked}
            autoComplete="address-level1"
            aria-invalid={!!fieldError("state")}
            aria-readonly={lookupFieldsLocked}
            className={inputClass(!!fieldError("state"), lookupFieldsLocked)}
          />
        </Field>

        <Field id="country" label="Country" required error={fieldError("country")}>
          <input
            {...register("country")}
            onBlur={() => onBlurField?.("country")}
            autoComplete="country-name"
            aria-invalid={!!fieldError("country")}
            className={inputClass(!!fieldError("country"))}
          />
        </Field>
      </div>

      {watched.postOffice && (
        <Field
          id="postOffice"
          label="Post Office"
          hint={lookupFieldsLocked ? "Auto-filled from PIN code" : undefined}
        >
          <input
            {...register("postOffice")}
            readOnly={lookupFieldsLocked}
            aria-readonly={lookupFieldsLocked}
            className={inputClass(false, lookupFieldsLocked)}
          />
        </Field>
      )}

      {lookupFieldsLocked && (
        <p className="text-xs text-brand-muted">
          City, district, and state were auto-filled.{" "}
          <button
            type="button"
            onClick={lookup.enableManualOverride}
            className="font-medium text-brand-accent underline-offset-2 hover:underline"
          >
            Edit manually
          </button>
        </p>
      )}

      <Field id="landmark" label="Landmark">
        <input
          {...register("landmark")}
          placeholder="Optional"
          className={inputClass()}
        />
      </Field>

      <fieldset>
        <legend className="eyebrow mb-3 block text-brand-muted">
          Address Type
        </legend>
        <div className="flex flex-wrap gap-4">
          {(["Home", "Work"] as const).map((type) => (
            <label
              key={type}
              className={cn(
                "flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                watched.addressType === type
                  ? "border-brand-accent bg-brand-accent/10 text-brand-black"
                  : "border-gray-200 hover:border-brand-accent/50"
              )}
            >
              <input
                type="radio"
                value={type}
                checked={watched.addressType === type}
                onChange={() => setValue("addressType", type)}
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
          {...register("isDefault")}
          className="h-4 w-4 rounded border-gray-300 accent-brand-accent"
        />
        Save this Address
      </label>
    </form>
  );
}
