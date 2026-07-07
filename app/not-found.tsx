import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent">
        404
      </p>
      <h1 className="heading-display mt-4">Page Not Found</h1>
      <p className="text-body mt-4 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary mt-8">
        Back to Home
      </Link>
    </div>
  );
}
