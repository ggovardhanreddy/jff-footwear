"use client";

import {
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "outline" | "ghost";
  external?: boolean;
}

export default function MagneticButton({
  href,
  children,
  className,
  variant = "primary",
  external = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduced = useReducedMotion();

  const handleMouse = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPosition({
      x: (e.clientX - rect.left - rect.width / 2) * 0.18,
      y: (e.clientY - rect.top - rect.height / 2) * 0.18,
    });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const variants = {
    primary:
      "bg-brand-black text-white hover:bg-brand-accent hover:text-brand-black border border-transparent",
    outline:
      "border border-white/30 bg-white/5 text-white backdrop-blur-sm hover:border-brand-accent hover:bg-white/10",
    ghost:
      "border border-brand-black/15 bg-white/60 text-brand-black backdrop-blur-sm hover:border-brand-accent",
  };

  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <motion.div
      animate={reduced ? undefined : { x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="inline-block"
    >
      <Link
        ref={ref}
        href={href}
        onMouseMove={handleMouse}
        onMouseLeave={reset}
        className={cn(
          "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-8 py-4 text-xs font-semibold uppercase tracking-[0.25em] transition-colors duration-500",
          variants[variant],
          className
        )}
        {...props}
      >
        <span className="pointer-events-none absolute inset-0 scale-0 rounded-full bg-white/20 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100" />
        <span className="relative z-10">{children}</span>
      </Link>
    </motion.div>
  );
}
