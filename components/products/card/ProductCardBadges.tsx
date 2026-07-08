"use client";

import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";

interface ProductCardBadgesProps {
  featured?: boolean;
  newArrival?: boolean;
  category?: string;
  material?: string;
  gender?: string;
}

export default function ProductCardBadges({
  featured,
  newArrival,
  category,
  material,
  gender,
}: ProductCardBadgesProps) {
  const hasMeta = category || material || gender;

  return (
    <div className="absolute left-5 top-5 z-20 flex max-w-[calc(100%-5rem)] flex-col gap-2">
      {newArrival && (
        <motion.div
          initial={{ opacity: 0, x: -12, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.05 }}
        >
          <Badge variant="new" className="rounded-full px-3.5 shadow-sm">
            New
          </Badge>
        </motion.div>
      )}
      {featured && (
        <motion.div
          initial={{ opacity: 0, x: -12, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.1 }}
        >
          <Badge variant="accent" className="rounded-full px-3.5 shadow-sm">
            Featured
          </Badge>
        </motion.div>
      )}
      {hasMeta && (
        <div className="flex flex-wrap gap-1.5">
          {category && (
            <Badge variant="muted" className="rounded-full px-2.5 py-0.5 text-[10px]">
              {category}
            </Badge>
          )}
          {material && (
            <Badge variant="muted" className="rounded-full px-2.5 py-0.5 text-[10px]">
              {material}
            </Badge>
          )}
          {gender && (
            <Badge variant="muted" className="rounded-full px-2.5 py-0.5 text-[10px]">
              {gender}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
