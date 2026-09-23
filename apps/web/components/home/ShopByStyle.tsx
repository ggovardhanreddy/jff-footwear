"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import SectionIntro from "./SectionIntro";

export type StyleCard = {
  name: string;
  href: string;
  image: string;
};

export default function ShopByStyle({ styles }: { styles: StyleCard[] }) {
  const reduced = useReducedMotion();

  return (
    <section className="py-16 md:py-24" aria-labelledby="styles-heading">
      <div className="container-custom">
        <div id="styles-heading">
          <SectionIntro
            eyebrow="Edit"
            title="Shop by style"
            description="Move across the range. On a phone, swipe the row."
          />
        </div>
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] md:grid md:grid-cols-4 md:overflow-visible md:px-[max(1rem,calc((100%-80rem)/2+1rem))] lg:px-[max(2rem,calc((100%-80rem)/2+2rem))] [&::-webkit-scrollbar]:hidden">
        {styles.map((style, index) => (
          <motion.div
            key={style.name}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : index * 0.04 }}
            className="w-[70%] shrink-0 snap-start sm:w-[46%] md:w-auto"
          >
            <Link
              href={style.href}
              data-cursor="view"
              className="focus-ring group relative block aspect-[3/4] overflow-hidden rounded-[1.4rem] bg-[#e7dfd4] shadow-[0_16px_36px_-24px_rgba(40,28,16,0.45)] dark:bg-[#1c1916]"
            >
              <AssetImage
                src={style.image}
                alt={`${style.name} collection`}
                fill
                sizes="(max-width: 768px) 70vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 font-display text-2xl text-white">
                {style.name}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
