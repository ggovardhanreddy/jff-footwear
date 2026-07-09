import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import PageShell from "@/components/ui/PageShell";
import { createBreadcrumbJsonLd } from "@/lib/seo";
import { toBreadcrumbItems, type BreadcrumbSegment } from "@/lib/breadcrumbs";

interface BusinessPageScaffoldProps {
  children: React.ReactNode;
  breadcrumb: BreadcrumbSegment[];
  ambient?: "none" | "cream" | "light";
  fullWidth?: boolean;
  className?: string;
  /** Additional JSON-LD nodes (breadcrumb is always included). */
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

export default function BusinessPageScaffold({
  children,
  breadcrumb,
  ambient = "light",
  fullWidth = false,
  className,
  structuredData,
}: BusinessPageScaffoldProps) {
  const breadcrumbLd = createBreadcrumbJsonLd(breadcrumb);
  const jsonLd = structuredData
    ? Array.isArray(structuredData)
      ? [breadcrumbLd, ...structuredData]
      : [breadcrumbLd, structuredData]
    : breadcrumbLd;

  return (
    <PageShell ambient={ambient} fullWidth={fullWidth} className={className}>
      <JsonLd data={jsonLd} />
      <Breadcrumb items={toBreadcrumbItems(breadcrumb)} />
      {children}
    </PageShell>
  );
}
