import { z } from "zod";

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number");

const optionalPhoneSchema = z
  .string()
  .trim()
  .refine((v: string) => v === "" || /^[6-9]\d{9}$/.test(v), {
    message: "Enter a valid 10-digit mobile number",
  });

export const deliveryAddressSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  mobile: phoneSchema,
  alternativeMobile: optionalPhoneSchema,
  flatHouse: z.string().trim().min(1, "Flat / house / building is required"),
  area: z.string().trim().min(1, "Area / locality is required"),
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
  city: z.string().trim().min(1, "City is required"),
  district: z.string().trim().min(1, "District is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  postOffice: z.string(),
  landmark: z.string(),
  addressType: z.enum(["Home", "Work"]),
  isDefault: z.boolean(),
});

export type DeliveryAddressSchema = z.infer<typeof deliveryAddressSchema>;
