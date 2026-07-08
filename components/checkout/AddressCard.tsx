import { MapPin, Phone, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DeliveryAddress } from "@/types";

interface AddressCardProps {
  address: DeliveryAddress;
  className?: string;
}

export default function AddressCard({ address, className }: AddressCardProps) {
  const fullAddress = [
    address.flatHouse,
    address.area,
    address.landmark,
    `${address.city}, ${address.state} ${address.pincode}`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border border-black/[0.06] bg-white/60 p-5",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="rounded-full bg-brand-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-accent">
          {address.addressType}
        </span>
        {address.isDefault && (
          <span className="text-xs font-medium text-brand-muted">Default</span>
        )}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <User className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden />
          <div>
            <p className="font-semibold text-brand-black">{address.fullName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden />
          <div>
            <p>{address.mobile}</p>
            {address.alternativeMobile && (
              <p className="text-brand-muted">Alt: {address.alternativeMobile}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-accent" aria-hidden />
          <p className="leading-relaxed text-brand-muted">{fullAddress}</p>
        </div>
      </div>
    </div>
  );
}
