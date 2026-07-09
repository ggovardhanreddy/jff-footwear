import { MapPin } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { ADDRESS_LINES } from "@/data/company";
import { cn } from "@/lib/utils";

interface MapSectionProps {
  className?: string;
}

/** Rayachoty, Andhra Pradesh — approximate map centre */
const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=14.9561,78.5511&z=14&hl=en&output=embed";

export default function MapSection({ className }: MapSectionProps) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(COMPANY.address)}`;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[28px] border border-black/[0.06] bg-white/60 shadow-soft backdrop-blur-sm dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      <div className="relative aspect-[21/9] min-h-[220px] w-full bg-brand-light dark:bg-brand-charcoal">
        <iframe
          title="JFF Footwear location on Google Maps"
          src={MAP_EMBED_URL}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <div className="flex flex-col gap-4 border-t border-black/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue dark:text-brand-blue-dark" aria-hidden />
          <div>
            <p className="font-display font-semibold text-brand-black dark:text-white">
              JFF Footwear
            </p>
            <address className="mt-1 not-italic text-sm text-brand-muted">
              {ADDRESS_LINES.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
          </div>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline focus-ring inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-brand-blue/30 bg-white px-5 py-2.5 text-sm font-semibold text-brand-blue transition-colors hover:bg-brand-blue/5 dark:border-brand-blue-dark/40 dark:bg-white/10 dark:text-brand-blue-dark"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
