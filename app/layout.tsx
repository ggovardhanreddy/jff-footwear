import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import SiteChrome from "@/components/layout/SiteChrome";
import {
  createMetadata,
  createOrganizationJsonLd,
  createWebSiteJsonLd,
} from "@/lib/seo";
import { assetPath } from "@/lib/paths";
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
    "JFF Footwear crafts premium slippers for global markets — orthopedic, EVA, rubber, and fashion collections for men, women, and kids. Wholesale & OEM inquiries welcome.",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = [createOrganizationJsonLd(), createWebSiteJsonLd()];

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href={assetPath("/images/logo.svg")} type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteChrome />
      </body>
    </html>
  );
}
