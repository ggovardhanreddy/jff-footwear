"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import AssetImage from "@/components/ui/AssetImage";
import AnimatedBackground from "@/components/ui/AnimatedBackground";
import ButtonLink from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/constants";
import { getProductMainImage } from "@/lib/utils";
import type { Product } from "@/types";

interface LuxuryHeroProps {
  heroProduct: Product;
}

const STATS = [
  { value: "50+", label: "Designs" },
  { value: "100%", label: "Comfort" },
  { value: "Premium", label: "Materials" },
];

export default function LuxuryHero({ heroProduct }: LuxuryHeroProps) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 80, damping: 20 });
  const springY = useSpring(my, { stiffness: 80, damping: 20 });

  const heroImage = getProductMainImage(heroProduct);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduced || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(x * 24);
    my.set(y * 16);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-brand-black"
      aria-label="Hero"
    >
      <AnimatedBackground variant="dark" />

      <div className="container-custom relative z-10 grid items-center gap-12 pt-24 pb-20 lg:grid-cols-2 lg:gap-16 lg:pt-28">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="eyebrow text-brand-accent">Premium Footwear Since 1998</p>
          <h1 className="heading-display mt-4 text-white">
            Crafted Comfort.
            <br />
            <span className="text-brand-accent">Every Step.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-300">
            Internationally crafted premium slippers — orthopedic support,
            luxury materials, and precision manufacturing from JFF Footwear.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <ButtonLink href={ROUTES.products} size="lg">
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              href={ROUTES.contact}
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-brand-black"
            >
              Contact Us
            </ButtonLink>
          </div>

          <dl className="mt-14 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
              >
                <dt className="font-display text-2xl font-bold text-white md:text-3xl">
                  {stat.value}
                </dt>
                <dd className="mt-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  {stat.label}
                </dd>
              </motion.div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          style={reduced ? undefined : { x: springX, y: springY }}
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg"
          initial={reduced ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div
            className="absolute inset-[8%] rounded-full bg-brand-accent/20 blur-3xl"
            aria-hidden
          />
          <motion.div
            animate={reduced ? undefined : { y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            <AssetImage
              src={heroImage}
              alt={heroProduct.name}
              fill
              priority
              className="object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.45)]"
              sizes="(max-width: 768px) 90vw, 480px"
            />
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-gray-500">
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown className="h-4 w-4 text-brand-accent" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
