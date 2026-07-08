import { Award, Shield, Star, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const AWARDS = [
  { icon: Award, title: "ISO Quality Certified", year: "2022" },
  { icon: Shield, title: "Export Excellence Award", year: "2023" },
  { icon: Star, title: "Best Manufacturer — Gujarat", year: "2024" },
  { icon: BadgeCheck, title: "BIS Compliant Materials", year: "Ongoing" },
];

export default function AwardsSection({ className }: { className?: string }) {
  return (
    <section className={cn("space-y-8", className)} aria-labelledby="awards">
      <div className="text-center">
        <p className="eyebrow text-brand-accent">Recognition</p>
        <h2 id="awards" className="heading-section mt-2">
          Awards &amp; Certifications
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AWARDS.map(({ icon: Icon, title, year }) => (
          <div
            key={title}
            className="rounded-2xl border border-black/5 bg-white/60 p-6 text-center dark:border-white/10 dark:bg-brand-dark"
          >
            <Icon className="mx-auto h-8 w-8 text-brand-accent" />
            <p className="mt-4 font-semibold">{title}</p>
            <p className="mt-1 text-sm text-brand-muted">{year}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
