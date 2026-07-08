"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { COMPANY, ROUTES } from "@/lib/constants";

export default function FloatingContactButton() {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className="fixed bottom-[5.75rem] right-4 z-40 hidden sm:bottom-[5.5rem] sm:block lg:bottom-6"
      whileHover={reduced ? undefined : { scale: 1.05 }}
      whileTap={reduced ? undefined : { scale: 0.95 }}
    >
      <Link
        href={ROUTES.contact}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-black/10 bg-white/95 text-brand-black shadow-lg backdrop-blur-md transition-colors hover:bg-brand-black hover:text-white dark:border-white/10 dark:bg-brand-dark dark:text-white"
        aria-label={`Contact ${COMPANY.name}`}
      >
        <Phone className="h-5 w-5" />
      </Link>
    </motion.div>
  );
}
