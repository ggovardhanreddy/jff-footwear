import LoadingSkeleton from "@/components/LoadingSkeleton";
import { GLASS_CARD, GLASS_CARD_INNER } from "@/lib/checkout-styles";

export function CheckoutPageSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-hidden>
      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-32 rounded-full" />
        <LoadingSkeleton className="h-10 w-64 rounded-2xl" />
      </div>
      <LoadingSkeleton className="h-16 w-full rounded-[28px]" />
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className={GLASS_CARD}>
            <div className={`${GLASS_CARD_INNER} space-y-5`}>
              {Array.from({ length: 6 }).map((_, i) => (
                <LoadingSkeleton key={i} className="h-12 w-full rounded-2xl" />
              ))}
              <LoadingSkeleton className="mt-4 h-12 w-48 rounded-2xl" />
            </div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className={GLASS_CARD}>
            <div className={`${GLASS_CARD_INNER} space-y-4`}>
              <LoadingSkeleton className="h-24 w-full rounded-2xl" />
              <LoadingSkeleton className="h-24 w-full rounded-2xl" />
              <LoadingSkeleton className="h-40 w-full rounded-2xl" />
              <LoadingSkeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CheckoutSummarySkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <LoadingSkeleton className="h-20 w-full rounded-2xl" />
      <LoadingSkeleton className="h-20 w-full rounded-2xl" />
      <LoadingSkeleton className="h-36 w-full rounded-2xl" />
    </div>
  );
}

export function DeliveryDetailsSkeleton() {
  return (
    <div className="space-y-4" aria-hidden>
      <LoadingSkeleton className="h-16 w-full rounded-2xl" />
      <LoadingSkeleton className="h-20 w-full rounded-2xl" />
      <LoadingSkeleton className="h-14 w-full rounded-2xl" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-8 w-24 rounded-full" />
        <LoadingSkeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
}
