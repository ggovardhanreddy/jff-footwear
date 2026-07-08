"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/data/content";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

interface ProductFAQProps {
  product: Product;
  className?: string;
}

export default function ProductFAQ({ product, className }: ProductFAQProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const productFaqs = [
    {
      id: "pf1",
      question: `What sizes are available for ${product.name}?`,
      answer: `Available sizes: ${product.sizes.join(", ")}. Contact us for custom sizing on bulk orders.`,
    },
    {
      id: "pf2",
      question: `Is ${product.material} material durable?`,
      answer: `${product.material} is selected for comfort and longevity. JFF products undergo quality checks at every stage.`,
    },
    ...faqs.slice(0, 4),
  ];

  return (
    <section className={cn("space-y-6", className)} aria-labelledby="product-faq">
      <div>
        <p className="eyebrow text-brand-accent">FAQ</p>
        <h2 id="product-faq" className="heading-section mt-2">
          Product Questions
        </h2>
      </div>
      <div className="divide-y divide-black/5 rounded-2xl border border-black/5 dark:divide-white/10 dark:border-white/10">
        {productFaqs.map((faq) => {
          const open = openId === faq.id;
          return (
            <div key={faq.id}>
              <button
                type="button"
                onClick={() => setOpenId(open ? null : faq.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                aria-expanded={open}
              >
                {faq.question}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    open && "rotate-180"
                  )}
                />
              </button>
              {open && (
                <p className="px-5 pb-4 text-sm leading-relaxed text-brand-muted">
                  {faq.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
