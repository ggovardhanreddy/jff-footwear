"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useAnimatedNumber(
  target: number,
  durationMs = 450
): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }

    const start = value;
    const diff = target - start;
    if (diff === 0) return;

    const startTime = performance.now();

    let frame = 0;
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, durationMs, reduced]);

  return value;
}
