import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import PageShell from "@/components/ui/PageShell";

export default function ProductsLoading() {
  return (
    <PageShell ambient="light">
      <div className="mb-12 space-y-4">
        <div className="skeleton-shimmer h-4 w-24 rounded-full" aria-hidden />
        <div className="skeleton-shimmer h-10 w-64 max-w-full rounded-xl" aria-hidden />
        <div className="skeleton-shimmer h-5 w-96 max-w-full rounded-lg" aria-hidden />
      </div>
      <ProductGridSkeleton count={8} />
      <p className="sr-only" role="status">
        Loading products…
      </p>
    </PageShell>
  );
}
