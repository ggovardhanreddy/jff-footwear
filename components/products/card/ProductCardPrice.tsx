import { cn } from "@/lib/utils";

interface ProductCardPriceProps {
  price?: number;
  className?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductCardPrice({
  price,
  className,
}: ProductCardPriceProps) {
  if (price == null) return null;

  return (
    <p
      className={cn(
        "font-display text-lg font-semibold tracking-tight text-brand-black",
        className
      )}
    >
      {formatPrice(price)}
      <span className="ml-2 text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-brand-muted">
        MRP
      </span>
    </p>
  );
}
