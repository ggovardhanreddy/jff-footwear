"use client";

import FeatureCard from "./FeatureCard";
import { SHIPPING_DETAILS } from "@/data/pages";
import { cn } from "@/lib/utils";

interface ShippingDetailsGridProps {
  className?: string;
}

export default function ShippingDetailsGrid({ className }: ShippingDetailsGridProps) {
  return (
    <div
      className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-3", className)}
      aria-label="Shipping information"
    >
      {SHIPPING_DETAILS.map((item, index) => (
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
