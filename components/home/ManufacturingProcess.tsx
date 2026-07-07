"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import type { ManufacturingStep } from "@/types";

interface ManufacturingProcessProps {
  steps: ManufacturingStep[];
}

export default function ManufacturingProcess({
  steps,
}: ManufacturingProcessProps) {
  return (
    <section className="section-padding bg-brand-light">
      <div className="container-custom">
        <SectionHeading
          subtitle="Our Craft"
          title="Manufacturing Process"
          description="From raw materials to your feet — every step is perfected."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group overflow-hidden bg-white"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={step.image}
                  alt={step.title}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center bg-brand-accent text-sm font-bold text-brand-black">
                  {step.step}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-lg font-semibold">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
