import NextImage, { type ImageProps } from "next/image";
import { assetPath } from "@/lib/paths";

export default function AssetImage({ src, ...props }: ImageProps) {
  const resolvedSrc =
    typeof src === "string" ? assetPath(src) : src;

  return <NextImage src={resolvedSrc} {...props} />;
}
