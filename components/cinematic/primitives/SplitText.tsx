"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_CINEMATIC } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  mode?: "chars" | "words";
  /** Animate immediately on mount (for hero / above-fold) */
  immediate?: boolean;
}

export default function SplitText({
  text,
  className,
  delay = 0,
  as: Tag = "h2",
  mode = "words",
  immediate = false,
}: SplitTextProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const units = mode === "chars" ? text.split("") : text.split(" ");

  const motionProps = immediate
    ? { animate: "visible" as const }
    : {
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <Tag className={cn("overflow-hidden", className)} aria-label={text}>
      <motion.span
        className="inline-flex flex-wrap"
        initial="hidden"
        {...motionProps}
        transition={{
          staggerChildren: mode === "chars" ? 0.03 : 0.08,
          delayChildren: delay,
        }}
      >
        {units.map((unit, i) => (
          <motion.span
            key={`${unit}-${i}`}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: "100%", scale: 0.96 },
              visible: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { duration: 0.55, ease: EASE_CINEMATIC },
              },
            }}
          >
            {unit}
            {mode === "words" && i < units.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}
