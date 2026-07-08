"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { FAQ } from "@/types";
import { cn } from "@/lib/utils";
import { EASE_LUXURY } from "@/lib/motion";

interface FAQAccordionProps {
  faqs: FAQ[];
  showHeading?: boolean;
}

export default function FAQAccordion({
  faqs,
  showHeading = true,
}: FAQAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  return (
    <div>
      {showHeading && (
        <SectionHeading
          subtitle="Support"
          title="Frequently Asked Questions"
          titleAs="h1"
          description="Everything you need to know about JFF products and ordering."
        />
      )}

      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          const panelId = `faq-panel-${faq.id}`;
          const buttonId = `faq-button-${faq.id}`;

          return (
            <div
              key={faq.id}
              className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md"
            >
              <button
                id={buttonId}
                type="button"
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="focus-ring flex w-full items-center justify-between gap-4 rounded-2xl p-5 text-left md:p-6"
                aria-expanded={isOpen}
                aria-controls={panelId}
              >
                <span className="font-medium leading-snug text-brand-black md:text-lg">
                  {faq.question}
                </span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 text-brand-muted transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: EASE_LUXURY }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-gray-100 px-5 py-4 text-sm leading-[1.7] text-brand-muted md:px-6 md:py-5 md:text-base">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
