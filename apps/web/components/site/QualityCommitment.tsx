"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import FeatureCard from "./FeatureCard";
import { QUALITY_COMMITMENT } from "@/data/pages";
import { cn } from "@/lib/utils";

interface QualityCommitmentProps {
  className?: string;
  showHeading?: boolean;
}

export default function QualityCommitment({
  className,
  showHeading = true,
}: QualityCommitmentProps) {
  return (
    <section className={cn("space-y-10", className)} aria-labelledby="quality-commitment">
      {showHeading ? (
        <SectionHeading
          subtitle={QUALITY_COMMITMENT.subtitle}
          title={QUALITY_COMMITMENT.title}
          description={QUALITY_COMMITMENT.description}
        />
      ) : null}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {QUALITY_COMMITMENT.items.map((item, index) => (
          <FeatureCard
            key={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
