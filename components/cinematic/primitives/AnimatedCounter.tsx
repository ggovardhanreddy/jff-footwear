"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  label: string;
  sublabel?: string;
}

function parseValue(value: string) {
  const match = value.match(/^([\d,]+)(.*)$/);
  if (!match) return null;
  const numStr = match[1].replace(/,/g, "");
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { num: parseFloat(numStr), suffix: match[2], decimals };
}

export default function AnimatedCounter({
  value,
  label,
  sublabel,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();
  const parsed = parseValue(value);
  const isStatic = !parsed;
  const { num = 0, suffix = "", decimals = 0 } = parsed ?? {};
  const [display, setDisplay] = useState(
    reduced || isStatic ? value : "0" + suffix
  );

  useEffect(() => {
    if (isStatic || !inView || reduced) {
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
  }, [inView, reduced, num, suffix, decimals, value, isStatic]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-3xl font-bold text-white md:text-4xl lg:text-5xl">
        {display}
      </p>
      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-500">
        {label}
      </p>
      {sublabel ? (
        <p className="mt-1 text-xs text-gray-500">{sublabel}</p>
      ) : null}
    </div>
  );
}
