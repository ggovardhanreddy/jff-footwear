"use client";

import FeatureCard from "./FeatureCard";
import { OEM_FEATURES } from "@/data/pages";
import { cn } from "@/lib/utils";

interface OEMCardGridProps {
  className?: string;
}

export default function OEMCardGrid({ className }: OEMCardGridProps) {
  return (
    <div
      className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}
      aria-label="OEM and private label services"
    >
      {OEM_FEATURES.map((item, index) => (
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
