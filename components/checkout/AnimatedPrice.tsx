"use client";

import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";
import { formatINR } from "@/lib/pricing";
import { cn } from "@/lib/utils";

interface AnimatedPriceProps {
  value: number;
  className?: string;
  prefix?: string;
}

export default function AnimatedPrice({
  value,
  className,
  prefix,
}: AnimatedPriceProps) {
  const animated = useAnimatedNumber(value);

  return (
    <span className={cn("tabular-nums", className)} aria-live="polite">
      {prefix}
      {formatINR(animated)}
    </span>
  );
}
