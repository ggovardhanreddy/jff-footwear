"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import WhatsAppButton from "@/components/WhatsAppButton";
import AnimatedBackground from "@/components/ui/AnimatedBackground";

export default function ContactCTA() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[28px] bg-brand-black px-8 py-16 text-center text-white md:px-16 md:py-20"
        >
          <AnimatedBackground variant="dark" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(200,169,110,0.08),_transparent_55%)]" />
          <div className="relative z-10 mx-auto max-w-2xl">
            <p className="eyebrow">Get in Touch</p>
            <h2 className="heading-section mt-4 text-white">
              Ready to Place an Order?
            </h2>
            <p className="mt-4 text-gray-400">
              Whether you need retail quantities or bulk wholesale orders, our
              team is ready to assist with pricing and availability.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonLink href="/contact" size="lg">
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <WhatsAppButton
                label="WhatsApp Inquiry"
                className="inline-flex"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
