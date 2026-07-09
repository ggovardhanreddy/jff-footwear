"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import OptionGrid from "./OptionGrid";
import CustomizerProgress from "./CustomizerProgress";
import CustomizerPreview from "./CustomizerPreview";
import CustomizerPricePanel from "./CustomizerPricePanel";
import CustomizerDeliveryStep from "./CustomizerDeliveryStep";
import CustomizerReviewStep from "./CustomizerReviewStep";
import ColorSelector from "@/components/products/ColorSelector";
import {
  CUSTOMIZER_CATEGORIES,
  CUSTOMIZER_COLORS,
  CUSTOMIZER_MATERIALS,
  CUSTOMIZER_STEPS,
  CUSTOMIZER_STORAGE_KEY,
  LOGO_MAX_BYTES,
  LOGO_POSITIONS,
  ORDER_TYPES,
  PACKAGING_TYPES,
  SOLE_TYPES,
  STRAP_TYPES,
  canProceedStep,
  getSizesForGender,
  getStepTitle,
  serializeCustomization,
} from "@/lib/customizer/config";
import { getPreviewImageForColor } from "@/lib/customizer/images";
import { buildCustomOrderWhatsAppUrl } from "@/lib/customizer/whatsapp";
import { GENDERS } from "@/lib/constants";
import { readStorage, writeStorage } from "@/lib/storage";
import {
  EMPTY_CUSTOMIZATION,
  type ProductCustomization,
} from "@/types/customizer";
import type { ColorVariant, Gender, ProductColor } from "@/types";
import { getMoqForOrderType, validateQuantityForOrderType } from "@jff/utils/wholesale";

const TOTAL = CUSTOMIZER_STEPS.length;

export default function ProductCustomizerWizard() {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ProductCustomization>(EMPTY_CUSTOMIZATION);
  const [logoError, setLogoError] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = readStorage<Omit<ProductCustomization, "logoPreviewUrl"> | null>(
      CUSTOMIZER_STORAGE_KEY,
      null
    );
    if (saved) {
      setConfig((prev) => ({ ...prev, ...saved, logoPreviewUrl: "" }));
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeStorage(CUSTOMIZER_STORAGE_KEY, serializeCustomization(config));
  }, [config, hydrated]);

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

  const canContinue = canProceedStep(step, config);
  const moqValidation = useMemo(
    () =>
      config.orderType
        ? validateQuantityForOrderType(config.quantity, config.orderType)
        : null,
    [config.orderType, config.quantity]
  );

  const goNext = () => {
    if (step < TOTAL) setStep((s) => s + 1);
  };

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const placeWhatsAppOrder = () => {
    window.open(buildCustomOrderWhatsAppUrl(config), "_blank", "noopener,noreferrer");
  };

  const handleLogoFile = (file: File | undefined) => {
    setLogoError("");
    if (!file) {
      update({ logoFileName: "", logoPreviewUrl: "" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      setLogoError("Please upload an image file (PNG, JPG, or SVG).");
      return;
    }
    if (file.size > LOGO_MAX_BYTES) {
      setLogoError("Logo must be under 1.5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      update({
        logoFileName: file.name,
        logoPreviewUrl: typeof reader.result === "string" ? reader.result : "",
      });
    };
    reader.readAsDataURL(file);
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
                <h2 className="heading-section mt-2 text-brand-black dark:text-white">
                  {getStepTitle(step)}
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
                      onChange={(v) => update({ gender: v, size: "" })}
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
                              ? "border-brand-blue bg-brand-blue/10 text-brand-black dark:text-white"
                              : "border-gray-200 hover:border-brand-blue dark:border-white/20"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 8 && (
                    <div className="max-w-md space-y-4">
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
                      {config.orderType && moqValidation && !moqValidation.valid ? (
                        <p className="text-sm text-amber-700" role="alert">
                          {moqValidation.message}
                        </p>
                      ) : null}
                      <CustomizerPricePanel
                        config={config}
                        showBulkTiers
                        className="lg:hidden"
                      />
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
                                  logoPreviewUrl: yes ? config.logoPreviewUrl : "",
                                })
                              }
                              className={cn(
                                "focus-ring rounded-2xl border px-8 py-4 font-semibold",
                                selected
                                  ? "border-brand-blue bg-brand-blue/10"
                                  : "border-gray-200 dark:border-white/20"
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
                              Upload Logo (optional file — max 1.5 MB)
                            </label>
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/webp,image/svg+xml"
                              onChange={(e) =>
                                handleLogoFile(e.target.files?.[0])
                              }
                              className="text-sm"
                            />
                            {logoError && (
                              <p className="mt-2 text-sm text-red-600">{logoError}</p>
                            )}
                            {config.logoFileName && (
                              <p className="mt-2 text-xs text-brand-muted">
                                {config.logoFileName}
                              </p>
                            )}
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
                      {config.orderType ? (
                        <p className="text-sm text-brand-muted">
                          MOQ for {config.orderType}:{" "}
                          {getMoqForOrderType(config.orderType)} pairs
                          {moqValidation && !moqValidation.valid ? (
                            <span className="mt-1 block text-amber-700" role="alert">
                              {moqValidation.message}
                            </span>
                          ) : null}
                        </p>
                      ) : null}
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

                  {step === 12 && (
                    <CustomizerDeliveryStep config={config} onUpdate={update} />
                  )}

                  {step === 13 && <CustomizerReviewStep config={config} />}
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
            <CustomizerPreview config={config} />
            <div className="mt-6 hidden lg:block">
              <p className="eyebrow mb-3 text-brand-accent">Live Pricing</p>
              <CustomizerPricePanel
                config={config}
                showBulkTiers={step === 8}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
