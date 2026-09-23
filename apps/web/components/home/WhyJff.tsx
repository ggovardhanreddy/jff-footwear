"use client";

import { motion, useReducedMotion } from "framer-motion";
import { BadgeCheck, Footprints, Gem, IndianRupee, ShieldCheck } from "lucide-react";
import SectionIntro from "./SectionIntro";

const FEATURES = [
  {
    title: "Comfort",
    copy: "Soft footbeds shaped for long days at home and outside.",
    icon: Footprints,
  },
  {
    title: "Quality",
    copy: "EVA, PVC, rubber, and memory foam checked before they leave Rayachoty.",
    icon: ShieldCheck,
  },
  {
    title: "Style",
    copy: "Quiet colours and clean lasts that sit with everyday clothes.",
    icon: Gem,
  },
  {
    title: "Value",
    copy: "Honest pricing for families and for shops buying in bulk.",
    icon: IndianRupee,
  },
  {
    title: "Reliability",
    copy: "A steady supply line for wholesale partners and repeat orders.",
    icon: BadgeCheck,
  },
];

export default function WhyJff() {
  const reduced = useReducedMotion();

  return (
    <section className="container-custom py-16 md:py-24" aria-labelledby="why-heading">
      <div id="why-heading">
        <SectionIntro
          eyebrow="Why JFF"
          title="Why JFF"
          description="Five reasons the pairs stay in rotation."
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 [perspective:1000px]">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.article
              key={feature.title}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : index * 0.05 }}
              className="rounded-[1.4rem] border border-black/[0.06] bg-[#fffcf8] p-5 shadow-[0_10px_30px_-18px_rgba(40,28,16,0.25)] transition-transform duration-300 motion-reduce:transform-none dark:border-white/10 dark:bg-[#1c1916] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-2 [@media(hover:hover)_and_(pointer:fine)]:hover:[transform:translateY(-8px)_rotateX(2deg)_rotateY(-2deg)]"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f3ebe1] text-brand-black dark:bg-white/10 dark:text-[#f4f0ea]">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-xl text-brand-black dark:text-[#f4f0ea]">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-muted">{feature.copy}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
