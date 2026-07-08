"use client";

import {
  useCallback,
  useEffect,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import AssetImage from "@/components/ui/AssetImage";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { Rotate3d } from "lucide-react";
import { cn } from "@/lib/utils";
import type { View360 } from "@/lib/productViews";

interface Fake360ViewerProps {
  views: View360[];
  productName: string;
  className?: string;
  fullscreen?: boolean;
  theme?: "light" | "dark";
  onKeyDown?: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
}

const SWIPE_THRESHOLD = 44;

export default function Fake360Viewer({
  views,
  productName,
  className,
  fullscreen = false,
  theme = "light",
  onKeyDown,
}: Fake360ViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<string, boolean>>({});
  const dragX = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const isDark = theme === "dark";

  const activeView = views[activeIndex];

  const markLoaded = useCallback((src: string) => {
    setLoadedMap((m) => (m[src] ? m : { ...m, [src]: true }));
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setLoadedMap((m) => {
        const next = { ...m };
        for (const view of views) next[view.src] = true;
        return next;
      });
    }, 600);

    return () => window.clearTimeout(timer);
  }, [views]);

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex) return;
      const len = views.length;
      const normalized = ((index % len) + len) % len;
      setDirection(normalized > activeIndex ? 1 : -1);
      setActiveIndex(normalized);
    },
    [activeIndex, views.length]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % views.length);
  }, [views.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + views.length) % views.length);
  }, [views.length]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      dragX.set(0);

      if (info.offset.x < -SWIPE_THRESHOLD) goNext();
      else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
    },
    [dragX, goNext, goPrev]
  );

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
      onKeyDown?.(e);
    },
    [goNext, goPrev, onKeyDown]
  );

  const fadeVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: prefersReducedMotion ? 1 : dir > 0 ? 0.97 : 1.03,
    }),
    center: { opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      opacity: 0,
      scale: prefersReducedMotion ? 1 : dir > 0 ? 1.03 : 0.97,
    }),
  };

  return (
    <div
      role="region"
      aria-label={`${productName} 360 product view`}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={cn(
        "immersive-viewer-stage relative outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40",
        fullscreen ? "h-full w-full" : "aspect-square w-full",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 rounded-3xl",
          isDark
            ? "bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-black/20 ring-1 ring-white/10"
            : "bg-gradient-to-b from-neutral-50 via-white to-neutral-100"
        )}
      />

      {/* 360 badge */}
      <div
        className={cn(
          "absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur-md",
          isDark
            ? "border border-white/20 bg-black/50 text-white"
            : "border border-white/60 bg-white/80 text-brand-black"
        )}
      >
        <Rotate3d className="h-3.5 w-3.5 text-brand-accent" />
        360° View
      </div>

      {/* Floating shadow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[14%] left-1/2 z-0 h-[9%] w-[50%] -translate-x-1/2 rounded-[100%] bg-black/20 blur-2xl"
        animate={
          prefersReducedMotion ? undefined : { y: [0, 5, 0], scaleX: [1, 1.06, 1] }
        }
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Drag stage */}
      <motion.div
        className="relative z-10 flex h-full w-full cursor-grab items-center justify-center p-6 active:cursor-grabbing sm:p-10"
        animate={prefersReducedMotion ? undefined : { y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDrag={(_, info) => dragX.set(info.offset.x * 0.35)}
        onDragEnd={handleDragEnd}
        style={{ x: dragX }}
      >
        <div className="relative h-full w-full max-h-[min(68vw,480px)] max-w-[min(68vw,480px)]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={activeView.id}
              custom={direction}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full"
            >
              {!loadedMap[activeView.src] && (
                <div className="skeleton-shimmer absolute inset-0 rounded-2xl bg-neutral-100" />
              )}
              <AssetImage
                src={activeView.src}
                alt={`${productName} — ${activeView.label} view`}
                fill
                priority={activeIndex === 0}
                loading={activeIndex === 0 ? undefined : "lazy"}
                onLoad={() => markLoaded(activeView.src)}
                onLoadingComplete={() => markLoaded(activeView.src)}
                className="object-contain opacity-100 drop-shadow-[0_20px_36px_rgba(0,0,0,0.12)] transition-opacity duration-300"
                sizes="(max-width: 768px) 90vw, 50vw"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* View label + progress */}
      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-4">
        <div>
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-[0.22em]",
              isDark ? "text-gray-400" : "text-brand-muted"
            )}
          >
            Drag to rotate
          </p>
          <p
            className={cn(
              "mt-1 font-display text-sm font-semibold",
              isDark ? "text-white" : "text-brand-black"
            )}
          >
            {activeView.label}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md",
            isDark
              ? "bg-black/50 text-white ring-1 ring-white/15"
              : "bg-white/80 text-brand-black"
          )}
        >
          {activeIndex + 1} / {views.length}
        </span>
      </div>

      {/* Angle pills */}
      <div className="absolute bottom-16 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-[4.5rem]">
        {views.map((view, index) => (
          <button
            key={view.id}
            type="button"
            onClick={() => goTo(index)}
            className={cn(
              "rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-widest transition-all duration-300",
              activeIndex === index
                ? isDark
                  ? "bg-brand-accent text-brand-black shadow-md"
                  : "bg-brand-black text-white shadow-md"
                : isDark
                  ? "bg-white/10 text-gray-300 backdrop-blur-sm hover:bg-white/20 hover:text-white"
                  : "bg-white/70 text-brand-muted backdrop-blur-sm hover:text-brand-black"
            )}
            aria-label={`Show ${view.label} view`}
            aria-current={activeIndex === index}
          >
            {view.label}
          </button>
        ))}
      </div>
    </div>
  );
}
