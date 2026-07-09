import NextImage, { type ImageProps } from "next/image";
import { assetPath } from "@/lib/paths";

type AssetImageProps = ImageProps & {
  /** Hint for LCP images — use only above-the-fold heroes. */
  fetchPriority?: "high" | "low" | "auto";
};

/**
 * Static-export image wrapper with lazy-loading defaults.
 * Next Image Optimization is disabled (`images.unoptimized`); prefer compressed assets in `public/`.
 */
export default function AssetImage({
  src,
  loading,
  priority,
  fetchPriority,
  sizes,
  ...props
}: AssetImageProps) {
  const resolvedSrc = typeof src === "string" ? assetPath(src) : src;
  const resolvedLoading = priority ? undefined : (loading ?? "lazy");
  const resolvedFetchPriority =
    fetchPriority ?? (priority ? "high" : "auto");

  return (
    <NextImage
      src={resolvedSrc}
      loading={resolvedLoading}
      priority={priority}
      fetchPriority={resolvedFetchPriority}
      sizes={sizes ?? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
      {...props}
    />
  );
}
