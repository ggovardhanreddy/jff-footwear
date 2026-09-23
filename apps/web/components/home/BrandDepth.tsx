"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import { COMPANY, ROUTES } from "@/lib/constants";
import type { Product } from "@/types";

export default function BrandDepth({ product, image }: { product: Product | null; image: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const ySlow = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [30, -30]);
  const yFast = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [50, -70]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 md:py-28"
      aria-labelledby="brand-story-heading"
    >
      <div className="container-custom grid items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto h-[420px] w-full max-w-lg [perspective:1200px] sm:h-[520px]">
          <motion.div
            style={{ y: ySlow }}
            aria-hidden
            className="absolute left-1/2 top-6 h-80 w-80 -translate-x-1/2 rounded-full bg-[#e7dccb] blur-sm dark:bg-[#2a241e] sm:h-[26rem] sm:w-[26rem]"
          />
          <motion.div
            style={{ y: yFast }}
            className="absolute left-[8%] top-[18%] z-10 w-[72%] overflow-hidden rounded-[1.8rem] shadow-[0_30px_60px_-30px_rgba(40,28,16,0.45)]"
          >
            {product ? (
              <div className="relative aspect-[4/5]">
                <AssetImage
                  src={image}
                  alt={product.name}
                  fill
                  sizes="(max-width: 1024px) 80vw, 420px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </motion.div>
          <motion.p
            style={{ y: ySlow }}
            className="absolute bottom-6 right-2 z-20 max-w-[11rem] rounded-2xl bg-white/80 px-4 py-3 text-xs leading-relaxed text-brand-black shadow-lg backdrop-blur dark:bg-[#1c1916]/85 dark:text-[#f4f0ea]"
          >
            Designed and made in {COMPANY.locationShort}.
          </motion.p>
        </div>

        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: reduced ? 0 : 0.6 }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            The house of JFF
          </p>
          <h2
            id="brand-story-heading"
            className="mt-3 font-display text-4xl font-semibold tracking-tight text-brand-black dark:text-[#f4f0ea] md:text-5xl"
          >
            Made for every step
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-brand-muted">
            {COMPANY.fullName} has made comfortable slippers in Rayachoty, Andhra Pradesh since{" "}
            {COMPANY.foundedYear}. The same pairs supply shops in bulk and ship to homes across
            India.
          </p>
          <Link
            href={ROUTES.about}
            className="focus-ring mt-8 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em] text-brand-black underline decoration-brand-accent/60 underline-offset-4 dark:text-[#f4f0ea]"
          >
            About JFF
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
