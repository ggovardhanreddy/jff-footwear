export function HomePageSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-brand-cream">
      <div className="h-[70vh] bg-brand-black/10" />
      <div className="container-custom section-padding space-y-6">
        <div className="mx-auto h-8 w-48 rounded-full bg-black/5" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] rounded-3xl bg-black/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
