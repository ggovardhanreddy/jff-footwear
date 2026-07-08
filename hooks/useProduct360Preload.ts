"use client";

import { useEffect, useState } from "react";
import { assetPath } from "@/lib/paths";

interface PreloadState {
  loadedMap: Record<string, boolean>;
  progress: number;
  allLoaded: boolean;
}

export function useProduct360Preload(
  frames: string[],
  enabled: boolean
): PreloadState {
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  const [progress, setProgress] = useState(0);
  const [allLoaded, setAllLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || frames.length === 0) {
      setLoadedMap({});
      setProgress(0);
      setAllLoaded(false);
      return;
    }

    let cancelled = false;
    let loadedCount = 0;

    setLoadedMap({});
    setProgress(0);
    setAllLoaded(false);

    frames.forEach((src) => {
      const img = new window.Image();
      const markLoaded = () => {
        if (cancelled) return;
        loadedCount += 1;
        setLoadedMap((current) => ({ ...current, [src]: true }));
        setProgress(loadedCount / frames.length);
        if (loadedCount >= frames.length) setAllLoaded(true);
      };

      img.onload = markLoaded;
      img.onerror = markLoaded;
      img.src = assetPath(src);
    });

    return () => {
      cancelled = true;
    };
  }, [frames, enabled]);

  return { loadedMap, progress, allLoaded };
}

export function useInViewLazyLoad(rootMargin = "200px") {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return { setRef, isInView };
}
