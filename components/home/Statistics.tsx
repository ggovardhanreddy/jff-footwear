"use client";

import { motion } from "framer-motion";
import { products } from "@/data";
import { STATS } from "@/lib/constants";

export default function Statistics() {
  const stats = STATS.map((stat) =>
    stat.label === "Product Styles"
      ? { ...stat, value: `${products.length}+` }
      : stat
  );

  return (
    <section className="bg-brand-black py-16 text-white md:py-20">
      <div className="container-custom">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="font-display text-4xl font-bold text-brand-accent md:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
