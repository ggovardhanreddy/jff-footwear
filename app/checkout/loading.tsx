import { CheckoutPageSkeleton } from "@/components/checkout/CheckoutSkeleton";
import PageShell from "@/components/ui/PageShell";

export default function CheckoutLoading() {
  return (
    <PageShell className="pb-28 lg:pb-12">
      <CheckoutPageSkeleton />
      <p className="sr-only" role="status">
        Loading checkout…
      </p>
    </PageShell>
  );
}
