"use client";

import { motion } from "framer-motion";
import { Award, Factory, Globe, HeartHandshake } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const reasons = [
  {
    icon: Factory,
    title: "In-House Manufacturing",
    description:
      "Complete control from raw material to finished product. Our state-of-the-art facility produces 2 million pairs annually.",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description:
      "Every pair undergoes 12-point quality inspection. ISO-certified processes ensure consistent excellence.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Exporting to 30+ countries with trusted logistics partners. Competitive pricing for wholesale buyers.",
  },
  {
    icon: HeartHandshake,
    title: "Custom Solutions",
    description:
      "OEM/ODM services with custom branding, colors, and packaging. Your vision, our craftsmanship.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-brand-black text-white">
      <div className="container-custom">
        <SectionHeading
          subtitle="The JFF Difference"
          title="Why Choose Us"
          description="Decades of expertise in crafting the world's most comfortable slippers."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group border border-gray-800 p-8 transition-colors hover:border-brand-accent"
            >
              <reason.icon className="mb-6 h-8 w-8 text-brand-accent transition-transform group-hover:scale-110" />
              <h3 className="mb-3 font-display text-lg font-semibold">
                {reason.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
