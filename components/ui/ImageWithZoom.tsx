"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ImageWithZoomProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

export default function ImageWithZoom({
  src,
  alt,
  className,
  priority = false,
  fill = false,
  width,
  height,
}: ImageWithZoomProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (fill) {
    return (
      <div
        className={cn("relative overflow-hidden", className)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={cn(
            "object-cover transition-transform duration-700 ease-out",
            isHovered && "scale-110"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={src}
        alt={alt}
        width={width || 800}
        height={height || 600}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        className={cn(
          "h-full w-full object-cover transition-transform duration-700 ease-out",
          isHovered && "scale-110"
        )}
      />
    </div>
  );
}
