import JsonLd from "@/components/seo/JsonLd";
import { createMetadata, createBreadcrumbJsonLd } from "@/lib/seo";
import GalleryPageClient from "@/components/gallery/GalleryPageClient";

export const metadata = createMetadata({
  title: "Gallery",
  description:
    "Browse stunning visuals of JFF Footwear's premium slipper collection.",
  path: "/gallery",
});

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Gallery", path: "/gallery" },
        ])}
      />
      <GalleryPageClient />
    </>
  );
}
