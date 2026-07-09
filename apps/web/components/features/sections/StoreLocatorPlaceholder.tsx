import { MapPin } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function StoreLocatorPlaceholder({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-black/15 bg-neutral-50 p-10 text-center dark:border-white/15 dark:bg-brand-dark",
        className
      )}
    >
      <MapPin className="h-10 w-10 text-brand-muted" />
      <h3 className="mt-4 font-display text-lg font-bold">Store Locator</h3>
      <p className="mt-2 max-w-md text-sm text-brand-muted">
        Find JFF retailers near you. Interactive store map coming soon.
      </p>
      <p className="mt-4 text-xs text-brand-muted">{COMPANY.address}</p>
    </div>
  );
}
