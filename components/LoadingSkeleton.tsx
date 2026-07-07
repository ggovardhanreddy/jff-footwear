export default function LoadingSkeleton({
  className = "h-48 w-full",
}: {
  className?: string;
}) {
  return (
    <div
      className={`skeleton-shimmer rounded-[28px] bg-neutral-100 ${className}`}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/60 bg-white/70 shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)]">
      <LoadingSkeleton className="aspect-[4/5] w-full rounded-none rounded-t-[28px]" />
      <div className="space-y-4 px-6 py-6 md:px-7 md:py-7">
        <div className="flex gap-2">
          <LoadingSkeleton className="h-6 w-20 rounded-full" />
          <LoadingSkeleton className="h-6 w-24 rounded-full" />
          <LoadingSkeleton className="h-6 w-16 rounded-full" />
        </div>
        <LoadingSkeleton className="h-7 w-full" />
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="mt-2 h-10 w-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="premium-product-gallery grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
