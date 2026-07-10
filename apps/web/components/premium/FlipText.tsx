"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type FlipTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  stagger?: number;
};

/**
 * Character flip reveal. Renders plain text on SSR + first paint to avoid
 * hydration mismatches from useReducedMotion / animation trees.
 */
export default function FlipText({
  text,
  className,
  as: Tag = "span",
  delay = 0,
  stagger = 0.035,
}: FlipTextProps) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready || reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  return (
    <Tag className={cn("inline-flex flex-wrap gap-x-[0.28em]", className)} aria-label={text}>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-flex overflow-hidden pb-[0.12em]" aria-hidden>
          {word.split("").map((char, ci) => (
            <motion.span
              key={`${wi}-${ci}`}
              className="inline-block origin-bottom"
              initial={{ y: "110%", rotateX: -70, opacity: 0 }}
              animate={{ y: "0%", rotateX: 0, opacity: 1 }}
              transition={{
                duration: 0.55,
                delay: delay + (wi * word.length + ci) * stagger,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
