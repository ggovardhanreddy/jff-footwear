"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import { useMagnetic, useMouseParallax } from "@/hooks";
import { ROUTES } from "@/lib/constants";
import type { Product } from "@/types";

type ImmersiveHeroProps = {
  products: Product[];
  imageFor: (product: Product) => string;
};

const DEPTHS = [0.35, 0.7, 1];

export default function ImmersiveHero({ products, imageFor }: ImmersiveHeroProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const mouse = useMouseParallax(reduced ? 0 : 22);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 70]);
  const stageY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 120]);
  const cardsY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 180]);
  const textY = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [0, 48]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], reduced ? [1, 1] : [1, 0]);
  const bgX = useTransform(mouse.x, (value) => value * 0.25);
  const bgMouseY = useTransform(mouse.y, (value) => value * 0.2);

  const cards = products.slice(0, 3);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden lg:min-h-[100svh]"
      onMouseMove={mouse.onMouseMove}
      onMouseLeave={mouse.onMouseLeave}
      aria-label="JFF introduction"
    >
      <motion.div
        aria-hidden
        style={{ x: bgX, y: bgMouseY, translateY: bgY }}
        className="pointer-events-none absolute -left-24 top-10 h-[28rem] w-[28rem] rounded-full bg-[#e7d7c3]/80 blur-3xl dark:bg-[#2a241e]"
      />
      <motion.div
        aria-hidden
        style={{ y: bgY }}
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full border border-black/5 dark:border-white/10"
      />

      <div className="container-custom relative grid items-center gap-6 pb-10 pt-24 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-6 lg:pb-20 lg:pt-32">
        <motion.div style={{ y: textY, opacity: textOpacity }} className="relative z-20 max-w-xl">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-accent"
          >
            JFF · Rayachoty · Since 2021
          </motion.p>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduced ? 0 : 0.7,
              delay: reduced ? 0 : 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-4 font-display text-[2.6rem] font-semibold leading-[0.95] tracking-[-0.03em] text-brand-black dark:text-[#f4f0ea] sm:text-6xl lg:text-7xl"
          >
            Step into
            <span className="mt-1 block">your style</span>
          </motion.h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.16 }}
            className="mt-5 max-w-md text-base leading-relaxed text-[#3f3a36] [text-shadow:0_1px_10px_rgba(246,243,238,0.9)] dark:text-[#f4f0ea] dark:[text-shadow:0_1px_14px_rgba(12,11,10,0.95)] md:text-lg"
          >
            Comfort, style and everyday footwear designed for every step.
          </motion.p>
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.24 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <MagneticLink
              href={ROUTES.products}
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full bg-brand-black px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-transform hover:scale-[1.03] dark:bg-[#f4f0ea] dark:text-[#161311]"
            >
              Shop collection
            </MagneticLink>
            <MagneticLink
              href="/products?new=1"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-full border border-black/15 bg-white/50 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-brand-black backdrop-blur transition-transform hover:scale-[1.03] dark:border-white/20 dark:bg-white/5 dark:text-[#f4f0ea]"
            >
              Explore new arrivals
            </MagneticLink>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: stageY }}
          className="relative z-10 mt-2 h-[340px] overflow-hidden sm:h-[460px] sm:overflow-visible lg:mt-0 lg:h-[640px]"
        >
          <motion.div
            aria-hidden
            style={{ y: bgY }}
            className="absolute left-1/2 top-8 h-[78%] w-[78%] -translate-x-1/2 rounded-full bg-gradient-to-b from-white to-[#e7dccb] shadow-[inset_0_0_0_1px_rgba(22,19,17,0.05)] dark:from-[#1c1916] dark:to-[#2a241e]"
          />
          {cards.map((product, index) => (
            <FloatingCard
              key={product.slug}
              product={product}
              image={imageFor(product)}
              index={index}
              depth={DEPTHS[index] ?? 1}
              mouseX={mouse.x}
              mouseY={mouse.y}
              scrollY={cardsY}
              priority={index === 1}
              reduced={Boolean(reduced)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FloatingCard({
  product,
  image,
  index,
  depth,
  mouseX,
  mouseY,
  scrollY,
  priority,
  reduced,
}: {
  product: Product;
  image: string;
  index: number;
  depth: number;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scrollY: MotionValue<number>;
  priority: boolean;
  reduced: boolean;
}) {
  const x = useTransform(mouseX, (value) => value * depth);
  const pointerY = useTransform(mouseY, (value) => value * depth * 0.65);
  const parallaxY = useTransform(scrollY, (value) => value * depth);
  const y = useTransform(
    [pointerY, parallaxY],
    ([pointer, scroll]) => Number(pointer) + Number(scroll)
  );
  const positions = [
    "left-[0%] top-[22%] z-10 hidden w-[42%] min-[380px]:block sm:w-[38%]",
    "left-[18%] top-[4%] z-20 w-[62%] sm:left-[22%] sm:w-[48%]",
    "right-[0%] bottom-[2%] z-30 w-[46%] sm:w-[34%]",
  ];

  return (
    <motion.div style={{ x, y }} className={`absolute ${positions[index] ?? positions[0]}`}>
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 28 }}
        animate={reduced ? { opacity: 1 } : { opacity: 1, y: [0, -8, 0] }}
        transition={
          reduced
            ? { duration: 0 }
            : {
                opacity: { duration: 0.7, delay: 0.15 + index * 0.08 },
                y: { duration: 6 + index, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 },
              }
        }
      >
        <Link
          href={`/products/${product.slug}`}
          data-cursor="view"
          className="focus-ring group block overflow-hidden rounded-[1.4rem] bg-[#fffcf8] shadow-[0_24px_50px_-24px_rgba(40,28,16,0.45)] ring-1 ring-black/5 dark:bg-[#1c1916] dark:ring-white/10"
        >
          <div className="relative aspect-[4/5]">
            <AssetImage
              src={image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 55vw, 280px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            <p className="absolute inset-x-2 bottom-2 line-clamp-2 rounded-xl bg-white/85 px-2.5 py-1.5 text-[11px] font-medium leading-snug text-brand-black backdrop-blur-sm dark:bg-[#161311]/80 dark:text-[#f4f0ea]">
              {product.name}
            </p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function MagneticLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const mag = useMagnetic(0.1);

  return (
    <motion.div
      className="inline-flex"
      style={reduced ? undefined : { x: mag.x, y: mag.y }}
      onMouseMove={mag.onMouseMove}
      onMouseLeave={mag.onMouseLeave}
    >
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}
