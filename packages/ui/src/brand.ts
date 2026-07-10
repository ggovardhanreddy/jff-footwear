/** JFF Footwear — unified brand design tokens (web + mobile) */

export const brandLight = {
  background: "#ffffff",
  surface: "#f4f4f5",
  surfaceElevated: "#ffffff",
  text: "#0a0a0a",
  textMuted: "#6b6b6b",
  logo: "#0a0a0a",
  accent: "#2563eb",
  accentHover: "#1d4ed8",
  accentGold: "#c8a96e",
  accentGoldGlow: "rgba(200, 169, 110, 0.45)",
  border: "rgba(0, 0, 0, 0.06)",
  shadow: "0 4px 24px rgba(0, 0, 0, 0.06)",
  shadowPremium: "0 8px 32px rgba(0, 0, 0, 0.08)",
  shadowFloat: "0 20px 50px -12px rgba(10, 10, 10, 0.18)",
  glass: "rgba(255, 255, 255, 0.72)",
  glassBorder: "rgba(255, 255, 255, 0.5)",
  glassStrong: "rgba(255, 255, 255, 0.88)",
  atmosphere: ["#f8fafc", "#ffffff", "#faf8f5"] as const,
  gradient: "linear-gradient(135deg, #f8fafc 0%, #ffffff 45%, #faf8f5 100%)",
  liquidGradient: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #c8a96e 100%)",
} as const;

export const brandDark = {
  background: "#0c0c0c",
  surface: "rgba(255, 255, 255, 0.06)",
  surfaceElevated: "rgba(255, 255, 255, 0.08)",
  text: "#fafafa",
  textMuted: "#a1a1aa",
  logo: "#ffffff",
  accent: "#60a5fa",
  accentHover: "#93c5fd",
  accentGold: "#d4b87a",
  accentGoldGlow: "rgba(212, 184, 122, 0.4)",
  border: "rgba(255, 255, 255, 0.1)",
  shadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
  shadowPremium: "0 12px 40px rgba(0, 0, 0, 0.5)",
  shadowFloat: "0 24px 60px -12px rgba(0, 0, 0, 0.65)",
  glass: "rgba(12, 12, 12, 0.72)",
  glassBorder: "rgba(255, 255, 255, 0.12)",
  glassStrong: "rgba(18, 18, 18, 0.88)",
  atmosphere: ["#0a0a0a", "#121212", "#1a1612"] as const,
  gradient: "linear-gradient(135deg, #0a0a0a 0%, #121212 45%, #1a1612 100%)",
  liquidGradient: "linear-gradient(135deg, #0a0a0a 0%, #1f1a14 50%, #d4b87a 100%)",
} as const;

export const typography = {
  fontSans: "Inter",
  fontDisplay: "Playfair Display",
  letterSpacingLuxury: "0.24em",
  letterSpacingWide: "0.18em",
} as const;

export const brandAssets = {
  logoLight: "/images/brand/logo-light.png",
  logoDark: "/images/brand/logo-dark.png",
  logoMark: "/images/brand/logo-mark.png",
  favicon: "/images/brand/favicon-48.png",
  appleTouchIcon: "/images/brand/apple-touch-icon.png",
  ogImage: "/images/brand/og-image.png",
  ogImageDark: "/images/brand/og-image-dark.png",
  twitterImage: "/images/brand/twitter-card.png",
  pwa192: "/images/brand/icon-192.png",
  pwa512: "/images/brand/icon-512.png",
  /** Transparent watermark logos for page backgrounds */
  backgroundLogoLight: "/images/brand/logo-watermark-light.png",
  backgroundLogoDark: "/images/brand/logo-watermark-dark.png",
} as const;

export const glassmorphism = {
  light: {
    background: brandLight.glass,
    backdropFilter: "blur(20px) saturate(180%)",
    border: `1px solid ${brandLight.glassBorder}`,
    boxShadow: brandLight.shadow,
  },
  dark: {
    background: brandDark.glass,
    backdropFilter: "blur(24px) saturate(150%)",
    border: `1px solid ${brandDark.glassBorder}`,
    boxShadow: brandDark.shadowPremium,
  },
} as const;

/** Tailwind-compatible color map */
export const tailwindBrand = {
  black: "#0a0a0a",
  dark: "#121212",
  charcoal: "#121212",
  gray: "#1a1a1a",
  muted: "#6b6b6b",
  light: "#f4f4f5",
  cream: "#ffffff",
  white: "#ffffff",
  accent: brandLight.accentGold,
  "accent-dark": "#a68b4b",
  blue: brandLight.accent,
  "blue-dark": brandDark.accent,
} as const;

export const nativeWindBrand = {
  brand: tailwindBrand,
} as const;

export type ResolvedTheme = "light" | "dark";

export function getBrandTokens(resolved: ResolvedTheme) {
  return resolved === "dark" ? brandDark : brandLight;
}

export function getLogoPath(resolved: ResolvedTheme): string {
  return resolved === "dark" ? brandAssets.logoDark : brandAssets.logoLight;
}
