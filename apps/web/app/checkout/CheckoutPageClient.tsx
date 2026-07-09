"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import Button from "@/components/ui/Button";
import AddressForm from "@/components/AddressForm";
import {
  AddressCard,
  CheckoutPanel,
  CheckoutProgress,
  CheckoutStepContent,
  CheckoutSummary,
  DeliveryDetailsSection,
  DeliveryTimeline,
  EmptyCartState,
  MobileCheckoutBar,
  OrderConfirmationModal,
  OrderReview,
  OrderSuccessModal,
  RecommendedProducts,
  ShippingInfo,
  ShoppingExperience,
} from "@/components/checkout";
import { CheckoutPageSkeleton } from "@/components/checkout/CheckoutSkeleton";
import { useCart } from "@/context/CartContext";
import { useDeliveryAvailability } from "@/hooks/useDeliveryAvailability";
import { useCodAvailability } from "@/hooks/useCodAvailability";
import { useDeliveryEstimate } from "@/hooks/useDeliveryEstimate";
import { usePincodeLookup } from "@/hooks/usePincodeLookup";
import { useCoupon } from "@/hooks/useCoupon";
import { calculateOrderSummary } from "@/lib/pricing";
import {
  CHECKOUT_EYEBROW,
  CHECKOUT_SECTION_TITLE,
} from "@/lib/checkout-styles";
import { checkoutPanelReveal, CHECKOUT_MOTION_GPU } from "@/lib/checkout-motion";
import { ROUTES } from "@/lib/constants";
import { buildOrderWhatsAppUrl } from "@/lib/whatsapp-order";
import { cn } from "@/lib/utils";
import {
  EMPTY_DELIVERY_ADDRESS,
  hasAddressErrors,
  validateDeliveryAddress,
} from "@/lib/validation/address";
import {
  loadSavedAddress,
  saveDefaultAddress,
} from "@/lib/validation/address-storage";
import type {
  CheckoutStep,
  DeliveryAddress,
  DeliveryAddressErrors,
} from "@/types";

export default function CheckoutPageClient() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<CheckoutStep>("address");
  const [address, setAddress] = useState<DeliveryAddress>(EMPTY_DELIVERY_ADDRESS);
  const [errors, setErrors] = useState<DeliveryAddressErrors>({});
  const baseSummary = useMemo(() => calculateOrderSummary(items), [items]);
  const coupon = useCoupon(baseSummary.cartSellingTotal);
  const couponCode = coupon.appliedCode;
  const [submitError, setSubmitError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [specialNotes, setSpecialNotes] = useState("");
  const [touched, setTouched] = useState<
    Partial<Record<keyof DeliveryAddress, boolean>>
  >({});

  const pincodeLookup = usePincodeLookup(address.pincode);
  const delivery = useDeliveryAvailability(address.pincode);
  const cod = useCodAvailability(address.pincode, delivery.available);
  const estimate = useDeliveryEstimate(address.state);

  useEffect(() => {
    const saved = loadSavedAddress();
    if (saved) setAddress(saved);
    setHydrated(true);
  }, []);

  const summary = useMemo(
    () => ({
      ...calculateOrderSummary(items, couponCode),
      estimatedDeliveryBy: estimate.deliveryBy,
    }),
    [items, couponCode, estimate.deliveryBy]
  );

  const validateField = (field: keyof DeliveryAddress) => {
    const fieldErrors = validateDeliveryAddress(address);
    setErrors((prev) => ({
      ...prev,
      [field]: fieldErrors[field],
    }));
  };

  const visibleErrors = Object.fromEntries(
    Object.entries(errors).filter(
      ([key]) => touched[key as keyof DeliveryAddress]
    )
  ) as DeliveryAddressErrors;

  const continueToDelivery = () => {
    setSubmitError("");
    const validationErrors = validateDeliveryAddress(address);
    setErrors(validationErrors);
    setTouched({
      fullName: true,
      mobile: true,
      flatHouse: true,
      area: true,
      city: true,
      district: true,
      state: true,
      pincode: true,
      alternativeMobile: true,
    });

    if (hasAddressErrors(validationErrors)) {
      setSubmitError("Please complete all required address fields.");
      return;
    }

    if (delivery.checked && !delivery.available) {
      setSubmitError("Delivery is not available for this PIN code.");
      return;
    }

    setStep("delivery");
  };

  const continueToReview = () => {
    if (delivery.checked && !delivery.available) {
      setSubmitError("Delivery is not available for this PIN code.");
      return;
    }
    setSubmitError("");
    setStep("review");
  };

  const handlePlaceOrder = () => {
    setSubmitError("");

    if (items.length === 0) {
      setSubmitError("Your cart is empty. Add products before checkout.");
      return;
    }

    const validationErrors = validateDeliveryAddress(address);
    if (hasAddressErrors(validationErrors)) {
      setStep("address");
      setErrors(validationErrors);
      setSubmitError("Please fix your delivery address.");
      return;
    }

    if (delivery.checked && !delivery.available) {
      setSubmitError("Delivery is not available for this PIN code.");
      setStep("delivery");
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmOrder = () => {
    saveDefaultAddress(address);

    const url = buildOrderWhatsAppUrl({
      items,
      address,
      summary,
      couponCode,
      estimate,
      cod,
      specialNotes,
    });

    setShowConfirmModal(false);
    setShowSuccess(true);
    const delay = reduced ? 0 : 900;
    window.setTimeout(() => {
      window.open(url, "_blank");
      clearCart();
      coupon.remove();
      setShowSuccess(false);
    }, delay);
  };

  const handleDeleteAddress = () => {
    setAddress(EMPTY_DELIVERY_ADDRESS);
    setStep("address");
  };

  if (!hydrated) {
    return (
      <PageShell>
        <CheckoutPageSkeleton />
      </PageShell>
    );
  }

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
        <EmptyCartState />
        <RecommendedProducts className="mt-12" />
      </PageShell>
    );
  }

  const cannotCheckout =
    step !== "review" ||
    items.length === 0 ||
    (delivery.checked && !delivery.available);

  return (
    <PageShell className="pb-28 lg:pb-12">
      <OrderSuccessModal show={showSuccess} />
      <OrderConfirmationModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmOrder}
        address={address}
        summary={summary}
        estimate={estimate}
        cod={cod}
        couponCode={couponCode}
        specialNotes={specialNotes}
        onSpecialNotesChange={setSpecialNotes}
      />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Cart", href: ROUTES.cart },
          { label: "Checkout", href: ROUTES.checkout },
        ]}
      />

      <motion.header
        {...checkoutPanelReveal(reduced)}
        className={cn("mb-6 sm:mb-8", CHECKOUT_MOTION_GPU)}
      >
        <p className={CHECKOUT_EYEBROW}>Secure Checkout</p>
        <h1 className={cn(CHECKOUT_SECTION_TITLE, "mt-3")}>
          Complete Your Order
        </h1>
        <ShoppingExperience className="mt-6" />
      </motion.header>

      <CheckoutProgress currentStep={step} className="mb-8 sm:mb-10" />

      <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
        <div className="space-y-6 lg:col-span-3">
          <CheckoutStepContent stepKey={step}>
            {(step === "delivery" || step === "review") && (
              <ShippingInfo
                address={address}
                estimate={estimate}
                cod={cod}
                className="mb-6"
              />
            )}

            {step === "review" && (
              <AddressCard
                address={address}
                onEdit={() => setStep("address")}
                onDelete={handleDeleteAddress}
                onAddNew={() => {
                  setAddress(EMPTY_DELIVERY_ADDRESS);
                  setStep("address");
                }}
                className="mb-6"
              />
            )}

            {step === "address" && (
              <CheckoutPanel>
                <AddressForm
                  key={hydrated ? "ready" : "loading"}
                  value={address}
                  errors={visibleErrors}
                  onChange={setAddress}
                  onBlurField={(field) => {
                    setTouched((prev) => ({ ...prev, [field]: true }));
                    validateField(field);
                  }}
                />
                {submitError && (
                  <p
                    className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {submitError}
                  </p>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button type="button" size="lg" onClick={continueToDelivery}>
                    Continue to Delivery Details
                  </Button>
                </div>
              </CheckoutPanel>
            )}

            {step === "delivery" && (
              <CheckoutPanel>
                <DeliveryDetailsSection
                  delivery={delivery}
                  cod={cod}
                  estimate={estimate}
                  isFreeDelivery={summary.isFreeDelivery}
                  isPincodeLoading={pincodeLookup.isLoading}
                />
                <DeliveryTimeline activeIndex={0} className="mt-6" />
                {submitError && (
                  <p
                    className="mt-6 rounded-2xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm text-red-700"
                    role="alert"
                  >
                    {submitError}
                  </p>
                )}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("address")}
                  >
                    ← Edit Address
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    onClick={continueToReview}
                    disabled={delivery.checked && !delivery.available}
                  >
                    Continue to Review
                  </Button>
                </div>
              </CheckoutPanel>
            )}

            {step === "review" && (
              <>
                <CheckoutPanel delay={0.04}>
                  <OrderReview
                    items={items}
                    editable
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                </CheckoutPanel>
                <CheckoutPanel delay={0.08} className="mt-6">
                  <DeliveryTimeline activeIndex={0} />
                </CheckoutPanel>
              </>
            )}
          </CheckoutStepContent>

          <RecommendedProducts cartItems={items} className="pt-4" />

          <p className="text-center text-sm text-brand-muted lg:text-left">
            <Link
              href={ROUTES.cart}
              className="font-medium text-brand-accent transition-colors hover:text-brand-black"
            >
              ← Back to cart
            </Link>
          </p>
        </div>

        <div className="lg:col-span-2">
          <CheckoutSummary
            items={items}
            couponCode={couponCode}
            onCouponChange={coupon.syncAppliedCode}
            onPlaceOrder={handlePlaceOrder}
            submitError={submitError}
            delivery={delivery}
            cod={cod}
            estimate={estimate}
            checkoutDisabled={step !== "review"}
          />
        </div>
      </div>

      <MobileCheckoutBar
        grandTotal={summary.grandTotal}
        disabled={cannotCheckout}
        onPlaceOrder={handlePlaceOrder}
        label={step !== "review" ? "Complete Steps" : "Place Order"}
      />
    </PageShell>
  );
}
