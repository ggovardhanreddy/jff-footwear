import { ProductGridSkeleton } from "@/components/LoadingSkeleton";
import PageShell from "@/components/ui/PageShell";

export default function CartLoading() {
  return (
    <PageShell className="pb-12">
      <div className="page-header space-y-4">
        <div className="skeleton-shimmer h-4 w-28 rounded-full" aria-hidden />
        <div className="skeleton-shimmer h-10 w-48 rounded-xl" aria-hidden />
      </div>
      <ProductGridSkeleton count={2} />
      <p className="sr-only" role="status">
        Loading cart…
      </p>
    </PageShell>
  );
}
