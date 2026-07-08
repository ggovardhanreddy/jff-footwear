import { CARE_INSTRUCTIONS } from "@/data/pages";
import { cn } from "@/lib/utils";

export default function CareInstructions({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-black/5 bg-white/60 p-6 dark:border-white/10 dark:bg-brand-dark",
        className
      )}
    >
      <h3 className="font-display text-lg font-bold">Care Instructions</h3>
      <ul className="mt-4 space-y-2 text-sm text-brand-muted">
        {CARE_INSTRUCTIONS.map((tip) => (
          <li key={tip.id} className="flex gap-2">
            <span className="text-brand-accent">•</span>
            {tip.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
