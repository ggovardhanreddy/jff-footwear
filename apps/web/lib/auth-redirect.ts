import { ROUTES } from "@/lib/constants";

const NEXT_KEY = "jff-auth-next";

/** Safe internal path only (prevent open redirects). */
export function sanitizeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return ROUTES.account;
  }
  return next;
}

export function buildLoginUrl(nextPath: string): string {
  const next = sanitizeNextPath(nextPath);
  if (typeof window !== "undefined") {
    sessionStorage.setItem(NEXT_KEY, next);
  }
  return `${ROUTES.login}?next=${encodeURIComponent(next)}`;
}

export function consumeStoredNextPath(): string | null {
  if (typeof window === "undefined") return null;
  const stored = sessionStorage.getItem(NEXT_KEY);
  if (stored) sessionStorage.removeItem(NEXT_KEY);
  return stored;
}

export function getLoginNextFromSearch(
  searchParams: URLSearchParams | { get: (k: string) => string | null }
): string {
  return sanitizeNextPath(searchParams.get("next") || consumeStoredNextPath() || ROUTES.account);
}
