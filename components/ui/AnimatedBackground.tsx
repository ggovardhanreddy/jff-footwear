import { cn } from "@/lib/utils";

export type AnimatedBackgroundVariant = "dark" | "light" | "cream";

interface AnimatedBackgroundProps {
  /** Visual palette — dark for hero/CTA, light/cream for content sections */
  variant?: AnimatedBackgroundVariant;
  className?: string;
}

/**
 * Performance-optimized ambient background.
 * Pure CSS transforms + blur — no JS animation loop.
 * Respects prefers-reduced-motion.
 */
export default function AnimatedBackground({
  variant = "light",
  className,
}: AnimatedBackgroundProps) {
  return (
    <div
      className={cn("animated-bg", `animated-bg--${variant}`, className)}
      aria-hidden
    >
      <div className="animated-bg__blob animated-bg__blob--1" />
      <div className="animated-bg__blob animated-bg__blob--2" />
      <div className="animated-bg__blob animated-bg__blob--3" />
    </div>
  );
}
