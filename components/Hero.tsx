"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import ButtonLink from "@/components/ui/ButtonLink";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import { COMPANY } from "@/lib/constants";

export default function Hero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-black">
      <Image
        src="/images/hero-banner.svg"
        alt="JFF Premium Slippers"
        fill
        priority
        className="object-cover opacity-40"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/95 via-brand-black/75 to-brand-black/35" />
      <AnimatedBackground variant="dark" />

      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="eyebrow tracking-[0.4em]"
          >
            Premium Footwear Since {COMPANY.founded}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="heading-display mt-4 text-white md:text-6xl lg:text-7xl"
          >
            Crafted Comfort.
            <br />
            <span className="text-brand-accent">Every Step.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-gray-300"
          >
            Discover our collection of premium slippers — from orthopedic support
            to fashion-forward designs. Manufactured with precision for global
            excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <ButtonLink href="/products" size="lg">
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href="/about"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-brand-black"
            >
              Our Story
            </ButtonLink>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">
            Scroll
          </span>
          <motion.div
            animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
            transition={prefersReducedMotion ? undefined : { repeat: Infinity, duration: 1.5 }}
            className="h-8 w-px bg-brand-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
