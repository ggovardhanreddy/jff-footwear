"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Material } from "@/types";
import { fadeInUp, hoverLift, MOTION_GPU } from "@/lib/motion";

interface MaterialCardProps {
  name: Material;
  description: string;
  productCount: number;
  index?: number;
}

const MATERIAL_GRADIENTS: Record<string, string> = {
  EVA: "from-blue-50 to-blue-100",
  PVC: "from-cyan-50 to-cyan-100",
  Rubber: "from-stone-100 to-stone-200",
  PU: "from-amber-50 to-amber-100",
  "Memory Foam": "from-purple-50 to-purple-100",
};

export default function MaterialCard({
  name,
  description,
  productCount,
  index = 0,
}: MaterialCardProps) {
  const reduced = useReducedMotion();
  const gradient = MATERIAL_GRADIENTS[name] || "from-gray-50 to-gray-100";

  return (
    <motion.div
      {...fadeInUp(reduced)}
      transition={{
        duration: reduced ? 0 : 0.55,
        delay: reduced ? 0 : Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={MOTION_GPU}
    >
      <motion.div {...hoverLift(reduced)}>
        <Link
          href={`/products?material=${encodeURIComponent(name)}`}
          className={`card-premium group block rounded-2xl bg-gradient-to-br ${gradient} p-8 transition-shadow duration-500 hover:shadow-xl`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-muted">
            Material
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold text-brand-black transition-colors duration-300 group-hover:text-brand-accent">
            {name}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted">
            {description}
          </p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-accent transition-transform duration-300 group-hover:translate-x-0.5">
            {productCount} products →
          </p>
        </Link>
      </motion.div>
    </motion.div>
  );
}
