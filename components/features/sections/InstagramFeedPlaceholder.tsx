import { Instagram } from "lucide-react";
import { cn } from "@/lib/utils";

export default function InstagramFeedPlaceholder({
  className,
}: {
  className?: string;
}) {
  return (
    <section className={cn("space-y-6", className)} aria-labelledby="ig-feed">
      <div className="flex items-center gap-2">
        <Instagram className="h-5 w-5 text-brand-accent" />
        <h2 id="ig-feed" className="heading-section text-xl">
          @jfffootwear
        </h2>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square rounded-xl bg-gradient-to-br from-brand-cream to-neutral-200 dark:from-brand-dark dark:to-neutral-800"
            aria-hidden
          />
        ))}
      </div>
      <p className="text-center text-sm text-brand-muted">
        Instagram feed placeholder — connect your account to display live posts.
      </p>
    </section>
  );
}
