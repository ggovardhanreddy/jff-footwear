"use client";

import FeatureCard from "./FeatureCard";
import { CARE_INSTRUCTIONS } from "@/data/pages";
import { cn } from "@/lib/utils";

interface CareInstructionsGridProps {
  className?: string;
}

export default function CareInstructionsGrid({
  className,
}: CareInstructionsGridProps) {
  return (
    <div
      className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}
      aria-label="Care instructions"
    >
      {CARE_INSTRUCTIONS.map((item, index) => (
        <FeatureCard
          key={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
          index={index}
        />
      ))}
    </div>
  );
}
