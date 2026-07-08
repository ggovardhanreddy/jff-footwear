import Breadcrumb from "@/components/Breadcrumb";
import PageShell from "@/components/ui/PageShell";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface PolicyLayoutProps {
  title: string;
  description?: string;
  breadcrumb: BreadcrumbItem[];
  lastUpdated?: string;
  children: React.ReactNode;
  className?: string;
}

export default function PolicyLayout({
  title,
  description,
  breadcrumb,
  lastUpdated,
  children,
  className,
}: PolicyLayoutProps) {
  return (
    <PageShell ambient="cream">
      <Breadcrumb items={breadcrumb} />
      <div className={cn("mx-auto max-w-3xl", className)}>
        <h1 className="heading-display text-brand-black">{title}</h1>
        {description ? (
          <p className="mt-4 text-base leading-relaxed text-brand-muted">
            {description}
          </p>
        ) : null}
        {lastUpdated ? (
          <p className="mt-4 text-sm text-brand-muted">
            Last updated: {lastUpdated}
          </p>
        ) : null}
        <div className="content-prose mt-12 space-y-10">{children}</div>
      </div>
    </PageShell>
  );
}
