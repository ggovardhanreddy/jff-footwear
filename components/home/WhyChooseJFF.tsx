"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { WHY_CHOOSE_JFF } from "@/data/company";
import { Gem, Footprints, Shield, IndianRupee, type LucideIcon } from "lucide-react";
import { ROUTES } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  Gem,
  Footprints,
  Shield,
  IndianRupee,
};

export default function WhyChooseJFF() {
  const reduced = useReducedMotion();
  const items = WHY_CHOOSE_JFF.slice(0, 4);

  return (
    <section className="section-padding bg-brand-light">
      <div className="container-custom">
        <SectionHeading
          subtitle="Why JFF"
          title="Why Choose JFF"
          description="Premium quality, reliable manufacturing, and footwear trusted across India."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const Icon = ICONS[item.icon] ?? Gem;
            return (
              <motion.div
                key={item.id}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[24px] border border-black/[0.04] bg-white p-6 shadow-soft"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-accent/10">
                  <Icon className="h-5 w-5 text-brand-accent" aria-hidden />
                </div>
                <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            href={`${ROUTES.about}#why-jff`}
            className="focus-ring text-sm font-semibold text-brand-accent hover:underline"
          >
            Learn more about JFF →
          </Link>
        </div>
      </div>
    </section>
  );
}
