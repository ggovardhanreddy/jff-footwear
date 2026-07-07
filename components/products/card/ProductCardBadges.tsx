"use client";

import { motion } from "framer-motion";
import Badge from "@/components/ui/Badge";

interface ProductCardBadgesProps {
  featured?: boolean;
  newArrival?: boolean;
}

export default function ProductCardBadges({
  featured,
  newArrival,
}: ProductCardBadgesProps) {
  if (!featured && !newArrival) return null;

  return (
    <div className="absolute left-5 top-5 z-20 flex flex-col gap-2">
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
    </div>
  );
}
