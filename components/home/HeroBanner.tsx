"use client";

import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";

export default function HeroBanner() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-brand-black">
      <AssetImage
        src="/images/hero-banner.svg"
        alt="JFF Premium Slippers"
        fill
        priority
        className="object-cover opacity-60"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/60 to-transparent" />

      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-accent"
          >
            Premium Footwear Since 1998
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
            Discover our collection of premium slippers — from orthopedic
            support to fashion-forward designs. Manufactured with precision for
            global excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link href="/products">
              <Button size="lg">
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-brand-black">
                Our Story
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-8 w-px bg-brand-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
