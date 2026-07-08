import {
  Gem,
  Footprints,
  Shield,
  IndianRupee,
  MapPin,
  Factory,
  Package,
  Store,
  type LucideIcon,
} from "lucide-react";
import { WHY_CHOOSE_JFF } from "@/data/company";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Gem,
  Footprints,
  Shield,
  IndianRupee,
  MapPin,
  Factory,
  Package,
  Store,
};

export default function WhyChooseJFF({ className }: { className?: string }) {
  return (
    <section className={cn("space-y-8", className)} aria-labelledby="why-jff">
      <div className="text-center">
        <p className="eyebrow text-brand-accent">Why JFF</p>
        <h2 id="why-jff" className="heading-section mt-2">
          Why Choose JFF
        </h2>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_CHOOSE_JFF.map((item) => {
          const Icon = ICONS[item.icon] ?? Gem;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-black/5 bg-white/60 p-6 dark:border-white/10 dark:bg-brand-dark"
            >
              <div className="inline-flex rounded-2xl bg-brand-accent/10 p-3 text-brand-accent">
                <Icon className="h-5 w-5" aria-hidden />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-brand-muted">{item.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
