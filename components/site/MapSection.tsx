import { MapPin } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { ADDRESS_LINES } from "@/data/company";
import { cn } from "@/lib/utils";

interface MapSectionProps {
  className?: string;
}

export default function MapSection({ className }: MapSectionProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/60 shadow-soft backdrop-blur-sm",
        className
      )}
    >
      <div className="flex aspect-[21/9] min-h-[200px] flex-col items-center justify-center bg-gradient-to-br from-brand-cream/80 to-brand-light px-6 text-center">
        <MapPin className="h-10 w-10 text-brand-accent" aria-hidden />
        <p className="mt-4 font-display text-lg font-semibold text-brand-black">
          JFF Footwear
        </p>
        <address className="mt-2 not-italic text-sm text-brand-muted">
          {ADDRESS_LINES.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline focus-ring mt-5 inline-flex items-center gap-2 rounded-full border border-brand-accent/30 bg-white px-5 py-2.5 text-sm font-semibold text-brand-accent transition-colors hover:bg-brand-accent/5"
        >
          Open in Google Maps
        </a>
      </div>
      <p className="border-t border-black/5 px-4 py-3 text-center text-xs text-brand-muted">
        Map embed placeholder — use the link above to view our location.
      </p>
    </div>
  );
}
