import ButtonLink from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow">404</p>
      <h1 className="heading-display mt-4">Page Not Found</h1>
      <p className="text-body mx-auto mt-4 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <ButtonLink href="/" className="mt-8">
        Back to Home
      </ButtonLink>
    </div>
  );
}
