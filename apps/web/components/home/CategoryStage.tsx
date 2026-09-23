"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import { useTilt } from "@/hooks";
import SectionIntro from "./SectionIntro";

export type CategoryCard = {
  name: string;
  href: string;
  image: string;
  count: number;
  note: string;
};

export default function CategoryStage({ categories }: { categories: CategoryCard[] }) {
  return (
    <section className="container-custom py-16 md:py-24" aria-labelledby="categories-heading">
      <div id="categories-heading">
        <SectionIntro
          eyebrow="Collections"
          title="Featured categories"
          description="Men, women, and kids — slippers made in Rayachoty for everyday wear."
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3 md:gap-5">
        {categories.map((category, index) => (
          <TiltCategory key={category.name} category={category} index={index} />
        ))}
      </div>
    </section>
  );
}

function TiltCategory({ category, index }: { category: CategoryCard; index: number }) {
  const reduced = useReducedMotion();
  const [fine, setFine] = useState(false);
  const tilt = useTilt(fine && !reduced ? 7 : 0);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    const update = () => setFine(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: reduced ? 0 : 0.55, delay: reduced ? 0 : index * 0.06 }}
      className="[perspective:1100px]"
    >
      <motion.div
        onMouseMove={fine ? tilt.onMouseMove : undefined}
        onMouseLeave={fine ? tilt.onMouseLeave : undefined}
        style={fine && !reduced ? tilt.style : undefined}
        className="h-full"
      >
        <Link
          href={category.href}
          data-cursor="view"
          className="focus-ring group relative block aspect-[3/4] overflow-hidden rounded-[1.6rem] bg-[#e7dfd4] shadow-[0_18px_40px_-24px_rgba(40,28,16,0.4)] dark:bg-[#1c1916]"
        >
          <AssetImage
            src={category.image}
            alt={`${category.name} footwear`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
            <p className="font-display text-3xl font-semibold tracking-tight">{category.name}</p>
            <p className="mt-1 text-sm text-white/80">{category.note}</p>
            <span className="mt-4 inline-flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.2em]">
              Shop now
            </span>
          </div>
        </Link>
      </motion.div>
    </motion.article>
  );
}
