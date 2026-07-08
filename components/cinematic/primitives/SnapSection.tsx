"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SnapSectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

const SnapSection = forwardRef<HTMLElement, SnapSectionProps>(
  function SnapSection({ id, children, className, dark = false }, ref) {
    return (
      <section
        ref={ref}
        id={id}
        data-section={id}
        className={cn(
          "cinematic-section relative flex min-h-[100dvh] w-full snap-start snap-always flex-col overflow-hidden",
          dark ? "bg-brand-black text-white" : "bg-brand-cream text-brand-black",
          className
        )}
      >
        {children}
      </section>
    );
  }
);

export default SnapSection;
