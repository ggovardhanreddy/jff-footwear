export default function LoadingSkeleton({
  className = "h-48 w-full",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-xl bg-gray-200 ${className}`}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-premium overflow-hidden rounded-2xl">
      <LoadingSkeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-3 p-5">
        <LoadingSkeleton className="h-3 w-24" />
        <LoadingSkeleton className="h-5 w-full" />
        <LoadingSkeleton className="h-4 w-32" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
