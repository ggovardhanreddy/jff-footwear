"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type AnimatedBorderProps = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

/** Soft rotating gold border glow for glass surfaces. */
export default function AnimatedBorder({
  children,
  className,
  contentClassName,
}: AnimatedBorderProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className={cn("relative overflow-hidden rounded-[1.75rem] p-[1px]", className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-[-40%] bg-[conic-gradient(from_0deg,transparent_0%,rgba(200,169,110,0.55)_18%,transparent_36%,transparent_64%,rgba(200,169,110,0.35)_82%,transparent_100%)] opacity-70",
          !reduceMotion && "animate-[spin_8s_linear_infinite]"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "relative z-10 rounded-[calc(1.75rem-1px)] bg-white/80 backdrop-blur-xl dark:bg-brand-charcoal/80",
          contentClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}
