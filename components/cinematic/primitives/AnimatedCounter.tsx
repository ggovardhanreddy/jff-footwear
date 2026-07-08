"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  label: string;
}

function parseValue(value: string) {
  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: 0, suffix: value, decimals: 0 };
  const numStr = match[1];
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { num: parseFloat(numStr), suffix: match[2], decimals };
}

export default function AnimatedCounter({ value, label }: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const { num, suffix, decimals } = parseValue(value);
  const [display, setDisplay] = useState(reduced ? value : "0" + suffix);

  useEffect(() => {
    if (!inView || reduced) {
      setDisplay(value);
      return;
    }

    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = num * eased;
      setDisplay(
        (decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString()) +
          suffix
      );
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, reduced, num, suffix, decimals, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
        {display}
      </p>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">
        {label}
      </p>
    </div>
  );
}
