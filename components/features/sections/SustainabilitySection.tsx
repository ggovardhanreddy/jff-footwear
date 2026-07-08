import { Leaf, Recycle, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    icon: Leaf,
    title: "Eco-Friendly Materials",
    desc: "EVA and rubber sourced with minimal environmental impact.",
  },
  {
    icon: Recycle,
    title: "Recyclable Packaging",
    desc: "Reduced plastic in our shipping and retail packaging.",
  },
  {
    icon: Droplets,
    title: "Water-Efficient Process",
    desc: "Manufacturing optimised to reduce water consumption.",
  },
];

export default function SustainabilitySection({
  className,
}: {
  className?: string;
}) {
  return (
    <section className={cn("space-y-8", className)} aria-labelledby="sustain">
      <div className="text-center">
        <p className="eyebrow text-brand-accent">Our Planet</p>
        <h2 id="sustain" className="heading-section mt-2">
          Sustainability
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="rounded-2xl border border-emerald-200/50 bg-emerald-50/30 p-6 dark:border-emerald-900 dark:bg-emerald-950/20"
          >
            <Icon className="h-7 w-7 text-emerald-600" />
            <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm text-brand-muted">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
