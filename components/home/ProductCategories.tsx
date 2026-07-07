"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { CategoryInfo } from "@/types";

interface ProductCategoriesProps {
  categories: CategoryInfo[];
}

export default function ProductCategories({
  categories,
}: ProductCategoriesProps) {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <SectionHeading
          subtitle="Browse By"
          title="Product Categories"
          description="Find the perfect slipper for every need and occasion."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                href={`/products?category=${category.name}`}
                className="group relative block aspect-[16/9] overflow-hidden"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  loading="lazy"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-brand-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-xl font-bold text-white">
                    {category.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-300 opacity-0 transition-opacity group-hover:opacity-100">
                    {category.description}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-brand-accent">
                    Shop Now
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
