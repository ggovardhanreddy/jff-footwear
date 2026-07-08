import ButtonLink from "@/components/ui/ButtonLink";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[75vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-10 h-32 w-32">
        <div
          className="absolute inset-0 rounded-[36px] bg-gradient-to-br from-brand-cream to-brand-accent/20"
          aria-hidden
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-5xl font-bold text-brand-accent/80">
            404
          </span>
        </div>
      </div>
      <p className="eyebrow">Page not found</p>
      <h1 className="heading-display mt-4 max-w-lg text-balance">
        This page stepped off the path
      </h1>
      <p className="text-body mx-auto mt-5 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
        Let&apos;s get you back to comfort.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink href={ROUTES.home}>Back to Home</ButtonLink>
        <ButtonLink href={ROUTES.products} variant="outline">
          Browse Products
        </ButtonLink>
      </div>
    </div>
  );
}
