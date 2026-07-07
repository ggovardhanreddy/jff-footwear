"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { COMPANY } from "@/lib/constants";

export default function AboutSection() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              subtitle="About JFF"
              title="Premium Slippers, Crafted in India"
              align="left"
              className="mb-6"
            />
            <div className="space-y-4 text-body">
              <p>
                {COMPANY.fullName} has been manufacturing premium slippers since{" "}
                {COMPANY.founded}. From our facility in Surat, Gujarat, we produce
                orthopedic, bathroom, fashion, and outdoor slippers for men,
                women, and kids.
              </p>
              <p>
                Every pair reflects our commitment to quality materials, ergonomic
                design, and manufacturing excellence — trusted by retailers and
                distributors across 30+ countries.
              </p>
            </div>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-brand-accent transition-colors hover:text-brand-black"
            >
              Learn More
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { label: "Orthopedic", desc: "Therapeutic support" },
              { label: "Bathroom", desc: "Water-resistant PVC" },
              { label: "Fashion", desc: "Trend-forward PU" },
              { label: "Outdoor", desc: "Durable rubber soles" },
            ].map((item, i) => (
              <div
                key={item.label}
                className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent">
                  0{i + 1}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold">
                  {item.label}
                </h3>
                <p className="mt-1 text-sm text-brand-muted">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
