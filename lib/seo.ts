import type { Metadata } from "next";
import type { Product } from "@/types";
import { COMPANY } from "./constants";
import { getProductMainImage } from "./utils";
import { getProductPricing } from "./pricing";
import { assetPath } from "./paths";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jfffootwear.com";

export function createMetadata({
  title,
  description,
  path = "",
  image = "/images/og-default.svg",
  keywords = [],
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
}): Metadata {
  const fullTitle = title
    ? `${title} | ${COMPANY.fullName}`
    : `${COMPANY.fullName} — Premium Slippers Manufacturer`;
  const desc =
    description ||
    "JFF manufactures premium slippers including orthopedic, EVA, rubber, and fashion slippers for men, women, and kids. Wholesale inquiries welcome.";

  const url = `${siteUrl}${path}`;
  const ogImage = image.startsWith("http") ? image : `${siteUrl}${assetPath(image)}`;

  return {
    title: fullTitle,
    description: desc,
    keywords: [
      "slippers",
      "footwear",
      "JFF",
      "orthopedic slippers",
      "EVA slippers",
      "wholesale slippers",
      "manufacturer",
      ...keywords,
    ],
    authors: [{ name: COMPANY.fullName }],
    creator: COMPANY.fullName,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: COMPANY.fullName,
      title: fullTitle,
      description: desc,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export function createProductJsonLd(product: Product) {
  const image = `${siteUrl}${assetPath(getProductMainImage(product))}`;
  const pricing = getProductPricing(product);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image,
    url: `${siteUrl}/products/${product.slug}`,
    brand: { "@type": "Brand", name: COMPANY.fullName },
    category: product.category,
    material: product.material,
    color: product.color,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: pricing.sellingPrice,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: COMPANY.fullName },
    },
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY.fullName,
    url: siteUrl,
    logo: `${siteUrl}${assetPath("/images/logo.svg")}`,
    description: COMPANY.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: COMPANY.phone,
      contactType: "customer service",
      email: COMPANY.email,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 42, Industrial Estate",
      addressLocality: "Surat",
      addressRegion: "Gujarat",
      postalCode: "395010",
      addressCountry: "IN",
    },
  };
}

export function createBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function createFaqJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function createWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY.fullName,
    url: siteUrl,
    description: COMPANY.description,
    publisher: {
      "@type": "Organization",
      name: COMPANY.fullName,
      logo: `${siteUrl}${assetPath("/images/logo.svg")}`,
    },
  };
}
