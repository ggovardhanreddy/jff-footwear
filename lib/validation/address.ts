import type { AddressType, DeliveryAddress, DeliveryAddressErrors } from "@/types";

const PHONE_REGEX = /^[6-9]\d{9}$/;
const PINCODE_REGEX = /^\d{6}$/;

function isBlank(value: string): boolean {
  return value.trim().length === 0;
}

export function validateDeliveryAddress(
  address: DeliveryAddress
): DeliveryAddressErrors {
  const errors: DeliveryAddressErrors = {};

  if (isBlank(address.fullName)) {
    errors.fullName = "Full name is required";
  }

  if (isBlank(address.mobile)) {
    errors.mobile = "Mobile number is required";
  } else if (!PHONE_REGEX.test(address.mobile.replace(/\s/g, ""))) {
    errors.mobile = "Enter a valid 10-digit mobile number";
  }

  if (
    address.alternativeMobile &&
    !PHONE_REGEX.test(address.alternativeMobile.replace(/\s/g, ""))
  ) {
    errors.alternativeMobile = "Enter a valid 10-digit mobile number";
  }

  if (isBlank(address.flatHouse)) {
    errors.flatHouse = "Flat / house / building is required";
  }

  if (isBlank(address.area)) {
    errors.area = "Area / sector / locality is required";
  }

  if (isBlank(address.city)) {
    errors.city = "City is required";
  }

  if (isBlank(address.state)) {
    errors.state = "State is required";
  }

  if (isBlank(address.pincode)) {
    errors.pincode = "Pincode is required";
  } else if (!PINCODE_REGEX.test(address.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode";
  }

  return errors;
}

export function hasAddressErrors(errors: DeliveryAddressErrors): boolean {
  return Object.keys(errors).length > 0;
}

export const EMPTY_DELIVERY_ADDRESS: DeliveryAddress = {
  fullName: "",
  mobile: "",
  alternativeMobile: "",
  flatHouse: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  landmark: "",
  addressType: "Home" as AddressType,
  isDefault: false,
};
