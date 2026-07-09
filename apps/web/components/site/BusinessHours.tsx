import { Clock } from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface BusinessHoursProps {
  className?: string;
}

export default function BusinessHours({ className }: BusinessHoursProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 rounded-[24px] border border-black/[0.06] bg-white/70 p-5 backdrop-blur-sm",
        className
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
        <Clock className="h-5 w-5" aria-hidden />
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted">
          Business Hours
        </p>
        <p className="mt-1 text-sm font-medium text-brand-black">
          {COMPANY.businessHours}
        </p>
      </div>
    </div>
  );
}
