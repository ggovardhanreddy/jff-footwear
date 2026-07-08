"use client";

import FeatureCard from "./FeatureCard";
import { RETURN_POLICY_ITEMS } from "@/data/pages";
import { cn } from "@/lib/utils";

interface ReturnPolicyCardsProps {
  className?: string;
}

export default function ReturnPolicyCards({ className }: ReturnPolicyCardsProps) {
  return (
    <div
      className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}
      aria-label="Return and exchange policy"
    >
      {RETURN_POLICY_ITEMS.map((item, index) => (
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
