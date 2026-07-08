"use client";

import FeatureCard from "./FeatureCard";
import { WHOLESALE_FEATURES } from "@/data/pages";
import { cn } from "@/lib/utils";

interface WholesaleCardGridProps {
  className?: string;
}

export default function WholesaleCardGrid({ className }: WholesaleCardGridProps) {
  return (
    <div
      className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-4", className)}
      aria-label="Wholesale services"
    >
      {WHOLESALE_FEATURES.map((item, index) => (
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
