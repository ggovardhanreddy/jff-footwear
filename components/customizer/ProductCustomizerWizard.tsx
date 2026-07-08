"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import AssetImage from "@/components/ui/AssetImage";
import Button from "@/components/ui/Button";
import OptionGrid from "./OptionGrid";
import CustomizerProgress from "./CustomizerProgress";
import ColorSelector from "@/components/products/ColorSelector";
import { COLOR_MAP } from "@/lib/constants";
import {
  CUSTOMIZER_CATEGORIES,
  CUSTOMIZER_COLORS,
  CUSTOMIZER_MATERIALS,
  CUSTOMIZER_STEPS,
  LOGO_POSITIONS,
  ORDER_TYPES,
  PACKAGING_TYPES,
  SOLE_TYPES,
  STRAP_TYPES,
  getSizesForGender,
} from "@/lib/customizer/config";
import { getPreviewImageForColor } from "@/lib/customizer/images";
import { calculateCustomOrderPricing } from "@/lib/customizer/pricing";
import { buildCustomOrderWhatsAppUrl } from "@/lib/customizer/whatsapp";
import { formatINR } from "@/lib/pricing";
import { GENDERS } from "@/lib/constants";
import {
  EMPTY_CUSTOMIZATION,
  type ProductCustomization,
} from "@/types/customizer";
import type { ColorVariant, Gender, ProductColor } from "@/types";
import { cn } from "@/lib/utils";

const TOTAL = CUSTOMIZER_STEPS.length;

export default function ProductCustomizerWizard() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ProductCustomization>(EMPTY_CUSTOMIZATION);

  const update = useCallback((partial: Partial<ProductCustomization>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const materialDescriptions = useMemo(
    () =>
      Object.fromEntries(
        CUSTOMIZER_MATERIALS.map((m) => [m.value, m.description])
      ) as Record<string, string>,
    []
  );

  const colorVariants: ColorVariant[] = useMemo(
    () =>
      CUSTOMIZER_COLORS.map((color) => ({
        color,
        slug: color.toLowerCase(),
        image: getPreviewImageForColor(color) ?? "",
      })),
    []
  );

  const previewImage = config.color
    ? getPreviewImageForColor(config.color)
    : null;

  const pricing = calculateCustomOrderPricing(config.quantity);

  const canContinue = useMemo(() => {
    switch (step) {
      case 1:
        return !!config.category;
      case 2:
        return !!config.gender;
      case 3:
        return !!config.material;
      case 4:
        return !!config.soleType;
      case 5:
        return !!config.strapType;
      case 6:
        return !!config.color;
      case 7:
        return config.size !== "";
      case 8:
        return config.quantity >= 1;
      case 9:
        return !config.customLogo || !!config.logoPosition;
      case 10:
        return !!config.packaging;
      case 11:
        return !!config.orderType;
      default:
        return false;
    }
  }, [step, config]);

  const goNext = () => {
    if (step < TOTAL) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const placeWhatsAppOrder = () => {
    window.open(buildCustomOrderWhatsAppUrl(config), "_blank", "noopener,noreferrer");
  };

  const sizes =
    config.gender ? getSizesForGender(config.gender as Gender) : [];

  return (
    <div className="pb-16">
      <CustomizerProgress currentStep={step} totalSteps={TOTAL} />

      <div className="container-custom section-padding">
        <div className="grid gap-10 lg:grid-cols-5 lg:gap-14">
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={reduced ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -20 }}
                transition={{ duration: 0.35 }}
              >
                <p className="eyebrow text-brand-accent">
                  {CUSTOMIZER_STEPS[step - 1]?.label}
                </p>
                <h2 className="heading-section mt-2 text-brand-black">
                  {stepTitles[step]}
                </h2>

                <div className="mt-8">
                  {step === 1 && (
                    <OptionGrid
                      options={CUSTOMIZER_CATEGORIES}
                      value={config.category}
                      onChange={(v) => update({ category: v })}
                    />
                  )}

                  {step === 2 && (
                    <OptionGrid
                      options={[...GENDERS]}
                      value={config.gender}
                      onChange={(v) =>
                        update({ gender: v, size: "" })
                      }
                      columns={2}
                    />
                  )}

                  {step === 3 && (
                    <OptionGrid
                      options={CUSTOMIZER_MATERIALS.map((m) => m.value)}
                      value={config.material}
                      onChange={(v) => update({ material: v })}
                      descriptions={materialDescriptions}
                      columns={2}
                    />
                  )}

                  {step === 4 && (
                    <OptionGrid
                      options={SOLE_TYPES}
                      value={config.soleType}
                      onChange={(v) => update({ soleType: v })}
                      columns={2}
                    />
                  )}

                  {step === 5 && (
                    <OptionGrid
                      options={STRAP_TYPES}
                      value={config.strapType}
                      onChange={(v) => update({ strapType: v })}
                      columns={2}
                    />
                  )}

                  {step === 6 && (
                    <ColorSelector
                      variants={colorVariants}
                      selectedColor={(config.color || "Black") as ProductColor}
                      onSelect={(v) => update({ color: v.color })}
                    />
                  )}

                  {step === 7 && (
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => update({ size })}
                          className={cn(
                            "focus-ring flex h-12 min-w-12 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition-colors",
                            config.size === size
                              ? "border-brand-accent bg-brand-accent/10 text-brand-black"
                              : "border-gray-200 hover:border-brand-accent"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 8 && (
                    <div className="max-w-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          className="focus-ring flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold"
                          onClick={() =>
                            update({
                              quantity: Math.max(1, config.quantity - 1),
                            })
                          }
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={9999}
                          value={config.quantity}
                          onChange={(e) =>
                            update({
                              quantity: Math.max(
                                1,
                                parseInt(e.target.value, 10) || 1
                              ),
                            })
                          }
                          className="input-field w-24 text-center text-lg font-bold"
                          aria-label="Quantity"
                        />
                        <button
                          type="button"
                          className="focus-ring flex h-12 w-12 items-center justify-center rounded-xl border text-xl font-bold"
                          onClick={() =>
                            update({ quantity: config.quantity + 1 })
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="mt-3 text-sm text-brand-muted">
                        Wholesale quantities supported. Bulk discounts apply at
                        checkout confirmation.
                      </p>
                    </div>
                  )}

                  {step === 9 && (
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-4">
                        {(["No", "Yes"] as const).map((opt) => {
                          const yes = opt === "Yes";
                          const selected = config.customLogo === yes;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() =>
                                update({
                                  customLogo: yes,
                                  logoPosition: yes ? config.logoPosition : "",
                                  logoFileName: yes ? config.logoFileName : "",
                                })
                              }
                              className={cn(
                                "focus-ring rounded-2xl border px-8 py-4 font-semibold",
                                selected
                                  ? "border-brand-accent bg-brand-accent/10"
                                  : "border-gray-200"
                              )}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      {config.customLogo && (
                        <>
                          <div>
                            <label className="eyebrow mb-2 block text-brand-muted">
                              Upload Logo
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                update({
                                  logoFileName:
                                    e.target.files?.[0]?.name ?? "",
                                })
                              }
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <p className="eyebrow mb-3 text-brand-muted">
                              Logo Position
                            </p>
                            <OptionGrid
                              options={LOGO_POSITIONS}
                              value={config.logoPosition}
                              onChange={(v) => update({ logoPosition: v })}
                              columns={2}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {step === 10 && (
                    <OptionGrid
                      options={PACKAGING_TYPES}
                      value={config.packaging}
                      onChange={(v) => update({ packaging: v })}
                      columns={2}
                    />
                  )}

                  {step === 11 && (
                    <div className="space-y-6">
                      <OptionGrid
                        options={ORDER_TYPES}
                        value={config.orderType}
                        onChange={(v) => update({ orderType: v })}
                        columns={2}
                      />
                      <div>
                        <label
                          htmlFor="special-instructions"
                          className="eyebrow mb-2 block text-brand-muted"
                        >
                          Special Instructions
                        </label>
                        <textarea
                          id="special-instructions"
                          rows={3}
                          value={config.specialInstructions}
                          onChange={(e) =>
                            update({ specialInstructions: e.target.value })
                          }
                          placeholder="Delivery notes, branding details, etc."
                          className="input-field w-full resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-10 flex flex-wrap gap-3">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={goBack}>
                      <ChevronLeft className="h-4 w-4" />
                      Back
                    </Button>
                  )}
                  {step < TOTAL ? (
                    <Button
                      type="button"
                      onClick={goNext}
                      disabled={!canContinue}
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="whatsapp"
                      onClick={placeWhatsAppOrder}
                      disabled={!canContinue}
                    >
                      <MessageCircle className="h-5 w-5" />
                      Order on WhatsApp
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="lg:sticky lg:top-32 lg:col-span-2 lg:self-start">
            <div className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-premium backdrop-blur-xl">
              <p className="eyebrow text-brand-accent">Preview</p>
              <div className="relative mt-4 aspect-square overflow-hidden rounded-2xl bg-brand-cream">
                {previewImage ? (
                  <AssetImage
                    src={previewImage}
                    alt="Custom slipper preview"
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-brand-muted">
                    Select a color to preview
                  </div>
                )}
              </div>
              {config.color && (
                <div className="mt-4 flex items-center gap-2">
                  <span
                    className="h-5 w-5 rounded-full border"
                    style={{
                      backgroundColor:
                        COLOR_MAP[config.color as ProductColor] ??
                        COLOR_MAP.Standard,
                    }}
                    aria-hidden
                  />
                  <span className="text-sm font-medium">{config.color}</span>
                </div>
              )}
              <dl className="mt-6 space-y-2 border-t border-black/[0.06] pt-6 text-sm">
                <PriceRow label="MRP" value={formatINR(pricing.mrp)} />
                <PriceRow
                  label="Discount"
                  value={`-${formatINR(pricing.discount)}`}
                  accent
                />
                <PriceRow
                  label="Selling Price"
                  value={formatINR(pricing.sellingPrice)}
                />
                <PriceRow
                  label="Platform Fee"
                  value={formatINR(pricing.platformFee)}
                />
                <PriceRow
                  label="Delivery"
                  value={
                    pricing.deliveryCharge === 0
                      ? "FREE"
                      : formatINR(pricing.deliveryCharge)
                  }
                  accent={pricing.deliveryCharge === 0}
                />
                <div className="flex justify-between border-t border-black/[0.06] pt-4 font-display text-xl font-bold">
                  <dt>Grand Total</dt>
                  <dd>{formatINR(pricing.grandTotal)}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

const stepTitles: Record<number, string> = {
  1: "Select Category",
  2: "Select Gender",
  3: "Select Material",
  4: "Select Sole Type",
  5: "Select Strap Type",
  6: "Select Color",
  7: "Select Size",
  8: "Enter Quantity",
  9: "Custom Branding",
  10: "Choose Packaging",
  11: "Order Type",
};

function PriceRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-brand-muted">{label}</dt>
      <dd
        className={cn(
          "font-medium tabular-nums",
          accent && "text-emerald-600"
        )}
      >
        {value}
      </dd>
    </div>
  );
}
