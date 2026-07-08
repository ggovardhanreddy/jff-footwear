"use client";

import { useCountUp } from "@/hooks/motionHooks";
import { cn } from "@/lib/utils";

interface CountUpProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  duration?: number;
}

export default function CountUp({
  value,
  suffix = "",
  prefix = "",
  className,
  duration = 1200,
}: CountUpProps) {
  const display = useCountUp(value, duration);

  return (
    <span className={cn("tabular-nums", className)} aria-live="polite">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
