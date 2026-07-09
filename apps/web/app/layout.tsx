import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import SiteChrome from "@/components/layout/SiteChrome";
import ClientProviders from "@/components/providers/ClientProviders";
import JsonLd from "@/components/seo/JsonLd";
import { ThemeInitScript } from "@/components/brand";
import {
  createMetadata,
  createOrganizationJsonLd,
  createWebSiteJsonLd,
} from "@/lib/seo";
import { assetPath } from "@/lib/paths";
import { brandAssets } from "@jff/ui/brand";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = createMetadata({
  description:
    "JFF Footwear manufactures comfortable, durable slippers for men, women, kids, and unisex collections. Based in Rayachoty, Andhra Pradesh. Retail and wholesale enquiries welcome.",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#121212" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = [createOrganizationJsonLd(), createWebSiteJsonLd()];

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ThemeInitScript />
        <link rel="manifest" href={assetPath("/manifest.webmanifest")} />
        <link
          rel="icon"
          href={assetPath(brandAssets.favicon)}
          type="image/svg+xml"
        />
        <link
          rel="apple-touch-icon"
          href={assetPath(brandAssets.appleTouchIcon)}
        />
        <JsonLd data={structuredData} />
      </head>
      <body className="min-h-screen antialiased">
        <ClientProviders>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteChrome />
        </ClientProviders>
      </body>
    </html>
  );
}
