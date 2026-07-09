import { MATERIAL_INFO } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function MaterialsShowcase({ className }: { className?: string }) {
  return (
    <section className={cn("space-y-8", className)} aria-labelledby="materials">
      <div>
        <p className="eyebrow text-brand-accent">Our Materials</p>
        <h2 id="materials" className="heading-section mt-2">
          Engineered For Comfort
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {MATERIAL_INFO.map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-black/5 bg-white/60 p-6 dark:border-white/10 dark:bg-brand-dark"
          >
            <h3 className="font-display text-xl font-bold">{m.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              {m.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
