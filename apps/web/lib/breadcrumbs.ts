import { ROUTES } from "@/lib/constants";

export type BreadcrumbSegment = { name: string; path: string };

export function homeCrumb(): BreadcrumbSegment {
  return { name: "Home", path: ROUTES.home };
}

export function breadcrumbTrail(
  ...segments: BreadcrumbSegment[]
): BreadcrumbSegment[] {
  return [homeCrumb(), ...segments];
}

export function toBreadcrumbItems(segments: BreadcrumbSegment[]) {
  return segments.map((segment) => ({
    label: segment.name,
    href: segment.path,
  }));
}
