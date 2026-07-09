/**
 * Semantic version comparison (major.minor.patch).
 * Non-numeric suffixes are ignored (e.g. "1.0.0-beta" → 1.0.0).
 */
export function parseVersion(version: string): [number, number, number] {
  const segments = version
    .trim()
    .replace(/^v/i, "")
    .split(/[.-]/);
  const major = Number.parseInt(segments[0] ?? "0", 10) || 0;
  const minor = Number.parseInt(segments[1] ?? "0", 10) || 0;
  const patch = Number.parseInt(segments[2] ?? "0", 10) || 0;
  return [major, minor, patch];
}

/** Returns negative if a < b, positive if a > b, zero if equal */
export function compareVersions(a: string, b: string): number {
  const va = parseVersion(a);
  const vb = parseVersion(b);
  for (let i = 0; i < 3; i++) {
    if (va[i] < vb[i]) return -1;
    if (va[i] > vb[i]) return 1;
  }
  return 0;
}

export function isVersionBelow(current: string, target: string): boolean {
  return compareVersions(current, target) < 0;
}

export function isVersionAtLeast(current: string, minimum: string): boolean {
  return compareVersions(current, minimum) >= 0;
}
