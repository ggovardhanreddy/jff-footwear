"use client";

import { motion, useReducedMotion } from "framer-motion";
import FAQAccordion from "@/components/shared/FAQAccordion";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import SplitText from "@/components/cinematic/primitives/SplitText";
import { faqs } from "@/data/content";
import { scaleReveal } from "@/lib/motion";

export default function FAQSection() {
  const reduced = useReducedMotion();

  return (
    <SnapSection id="faq" className="justify-center pt-16">
      <CinematicBackground variant="light" intensity="medium" />

      <div className="container-custom relative z-10 py-12">
        <motion.div {...scaleReveal(reduced)} className="mx-auto max-w-3xl">
          <p className="eyebrow text-center">Support</p>
          <SplitText
            text="Questions Answered"
            className="heading-section mx-auto mt-3 text-center"
          />
          <div className="mt-10">
            <FAQAccordion faqs={faqs.slice(0, 6)} showHeading={false} />
          </div>
        </motion.div>
      </div>
    </SnapSection>
  );
}
