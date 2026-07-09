"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/** Top progress bar on route change — cinematic navigation feedback. */
export default function RouteProgress() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (reduced) return;
    setActive(true);
    const timer = setTimeout(() => setActive(false), 700);
    return () => clearTimeout(timer);
  }, [pathname, reduced]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[600] h-[3px] origin-left bg-gradient-to-r from-brand-accent via-brand-blue to-brand-accent"
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: "100%" }}
          aria-hidden
        />
      )}
    </AnimatePresence>
  );
}
