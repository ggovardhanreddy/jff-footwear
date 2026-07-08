"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";
import {
  DeliveryAddressForm,
  CheckoutSummary,
} from "@/components/checkout";
import { useCart } from "@/context/CartContext";
import { calculateOrderSummary } from "@/lib/pricing";
import { GLASS_CARD, GLASS_CARD_INNER } from "@/lib/checkout-styles";
import { ROUTES } from "@/lib/constants";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp-order";
import {
  EMPTY_DELIVERY_ADDRESS,
  hasAddressErrors,
  validateDeliveryAddress,
} from "@/lib/validation/address";
import {
  loadSavedAddress,
  saveDefaultAddress,
} from "@/lib/validation/address-storage";
import type { DeliveryAddress, DeliveryAddressErrors } from "@/types";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { items } = useCart();
  const [address, setAddress] = useState<DeliveryAddress>(EMPTY_DELIVERY_ADDRESS);
  const [errors, setErrors] = useState<DeliveryAddressErrors>({});
  const [couponCode, setCouponCode] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof DeliveryAddress, boolean>>>({});

  useEffect(() => {
    const saved = loadSavedAddress();
    if (saved) setAddress(saved);
  }, []);

  const summary = useMemo(
    () => calculateOrderSummary(items, couponCode),
    [items, couponCode]
  );

  const validateField = (field: keyof DeliveryAddress) => {
    const fieldErrors = validateDeliveryAddress(address);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field],
    }));
  };

  const handlePlaceOrder = () => {
    setSubmitError("");

    if (items.length === 0) {
      setSubmitError("Your cart is empty. Add products before checkout.");
      return;
    }

    const validationErrors = validateDeliveryAddress(address);
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      mobile: true,
      flatHouse: true,
      area: true,
      city: true,
      state: true,
      pincode: true,
      alternativeMobile: true,
    });

    if (hasAddressErrors(validationErrors)) {
      setSubmitError("Please fix the highlighted address fields.");
      return;
    }

    saveDefaultAddress(address);

    const url = buildOrderWhatsAppUrl({
      items,
      address,
      summary,
      couponCode,
    });

    window.open(url, "_blank");
  };

  if (items.length === 0) {
    return (
      <PageShell>
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Cart", href: ROUTES.cart },
            { label: "Checkout", href: ROUTES.checkout },
          ]}
        />
        <div className="mx-auto max-w-lg py-16 text-center">
          <h1 className="heading-page text-brand-black">Checkout</h1>
          <p className="mt-4 text-brand-muted">
            Your cart is empty. Browse products and add items to continue.
          </p>
          <Button className="mt-8" onClick={() => router.push(ROUTES.products)}>
            Browse Products
          </Button>
        </div>
      </PageShell>
    );
  }

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(([key]) => touched[key as keyof DeliveryAddress])
  ) as DeliveryAddressErrors;

  return (
    <PageShell>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: ROUTES.cart },
          { label: "Checkout", href: ROUTES.checkout },
        ]}
      />

      <div className="mb-10">
        <p className="eyebrow text-brand-accent">Secure Checkout</p>
        <h1 className="heading-page mt-2 text-brand-black">Complete Your Order</h1>
        <p className="mt-3 text-brand-muted">
          Enter your delivery details and review your order summary.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        <div className="lg:col-span-3">
          <div className={GLASS_CARD}>
            <div className={GLASS_CARD_INNER}>
              <DeliveryAddressForm
                value={address}
                errors={visibleErrors}
                onChange={setAddress}
                onBlurField={(field) => {
                  setTouched((prev) => ({ ...prev, [field]: true }));
                  validateField(field);
                }}
              />
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-brand-muted lg:text-left">
            <Link
              href={ROUTES.cart}
              className="font-medium text-brand-accent hover:underline"
            >
              ← Back to cart
            </Link>
          </p>
        </div>

        <div className="lg:col-span-2">
          <CheckoutSummary
            items={items}
            couponCode={couponCode}
            onCouponChange={setCouponCode}
            onPlaceOrder={handlePlaceOrder}
            submitError={submitError}
          />
        </div>
      </div>
    </PageShell>
  );
}
