import AssetImage from "@/components/ui/AssetImage";
import QuantitySelector from "@/components/QuantitySelector";
import { formatINR } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

interface OrderSummaryProps {
  items: CartItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  editable?: boolean;
  className?: string;
}

export default function OrderSummary({
  items,
  onUpdateQuantity,
  onRemove,
  editable = false,
  className,
}: OrderSummaryProps) {
  if (items.length === 0) {
    return (
      <p className={cn("text-sm text-brand-muted", className)}>
        Your cart is empty. Add products to see the order summary.
      </p>
    );
  }

  return (
    <ul className={cn("space-y-4", className)}>
      {items.map((item) => (
        <li
          key={item.id}
          className="flex gap-4 rounded-2xl border border-black/[0.05] bg-white/60 p-4"
        >
          <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
            <AssetImage
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>

          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="line-clamp-2 text-sm font-semibold text-brand-black">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  Size {item.size}
                  {item.color !== "Standard" ? ` · ${item.color}` : ""}
                </p>
              </div>
              {editable && onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              {editable && onUpdateQuantity ? (
                <QuantitySelector
                  value={item.quantity}
                  onChange={(qty) => onUpdateQuantity(item.id, qty)}
                  min={1}
                  max={99}
                />
              ) : (
                <span className="text-xs text-brand-muted">Qty: {item.quantity}</span>
              )}
              <div className="text-right">
                <p className="text-sm font-bold text-brand-black">
                  {formatINR(item.pricing.sellingPrice * item.quantity)}
                </p>
                {item.pricing.mrp > item.pricing.sellingPrice && (
                  <p className="text-xs text-brand-muted line-through">
                    {formatINR(item.pricing.mrp * item.quantity)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
