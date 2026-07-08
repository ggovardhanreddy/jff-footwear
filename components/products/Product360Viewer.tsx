"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import AssetImage from "@/components/ui/AssetImage";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Rotate3d } from "lucide-react";
import { useProduct360Preload } from "@/hooks/useProduct360Preload";
import { EASE_LUXURY, MOTION_GPU } from "@/lib/motion";
import { getFrameLabel, getViewerFrames } from "@/lib/viewerFrames";
import { cn } from "@/lib/utils";

const INACTIVITY_MS = 5000;
const SWIPE_THRESHOLD = 40;
/** Ms between frames during auto-rotate (higher = slower). */
const DEFAULT_ROTATION_MS = 320;
const SPIN_ROTATION_MS = 420;

export interface Product360ViewerProps {
  images: string[];
  productName?: string;
  /** Auto-advance frames after inactivity (default: true). */
  autoRotate?: boolean;
  /** Ms between frames during auto-rotate. */
  rotationSpeed?: number;
  /** Horizontal drag pixels per frame change. */
  dragSensitivity?: number;
  showControls?: boolean;
  theme?: "light" | "dark";
  className?: string;
}

function normalizeIndex(index: number, length: number): number {
  if (length === 0) return 0;
  return ((index % length) + length) % length;
}

export default function Product360Viewer({
  images,
  productName = "Product",
  autoRotate = true,
  rotationSpeed,
  dragSensitivity = 32,
  showControls = true,
  theme = "light",
  className,
}: Product360ViewerProps) {
  const { frames, defaultIndex, isSpinSequence } = useMemo(
    () => getViewerFrames(images),
    [images]
  );

  const reduced = useReducedMotion();
  const isDark = theme === "dark";
  const canDrag = frames.length >= 2;
  const frameInterval =
    rotationSpeed ?? (isSpinSequence ? SPIN_ROTATION_MS : DEFAULT_ROTATION_MS);

  const { loadedMap, allLoaded } = useProduct360Preload(frames, frames.length > 0);
  const [inlineLoaded, setInlineLoaded] = useState<Record<string, boolean>>({});

  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [direction, setDirection] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragOffsetRef = useRef(0);
  const swipeStartXRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastInteractionRef = useRef(performance.now());
  const rafRef = useRef<number | null>(null);
  const frameAccumulatorRef = useRef(0);
  const lastTickRef = useRef(0);

  const activeSrc = frames[activeIndex] ?? frames[0];
  const frameLoaded = activeSrc
    ? Boolean(loadedMap[activeSrc] || inlineLoaded[activeSrc])
    : false;

  const markInteraction = useCallback(() => {
    lastInteractionRef.current = performance.now();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      if (!canDrag) return;
      const next = normalizeIndex(index, frames.length);
      setDirection(next >= activeIndex ? 1 : -1);
      setActiveIndex(next);
      markInteraction();
    },
    [activeIndex, canDrag, frames.length, markInteraction]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  const applyDragDelta = useCallback(
    (deltaX: number) => {
      if (!canDrag) return;
      dragOffsetRef.current += deltaX;
      const frameDelta = Math.trunc(dragOffsetRef.current / dragSensitivity);
      if (frameDelta === 0) return;

      dragOffsetRef.current -= frameDelta * dragSensitivity;
      setDirection(frameDelta > 0 ? -1 : 1);
      setActiveIndex((current) =>
        normalizeIndex(current - frameDelta, frames.length)
      );
      markInteraction();
    },
    [canDrag, dragSensitivity, frames.length, markInteraction]
  );

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!canDrag) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      setIsDragging(true);
      swipeStartXRef.current = event.clientX;
      lastPointerXRef.current = event.clientX;
      dragOffsetRef.current = 0;
      markInteraction();
    },
    [canDrag, markInteraction]
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const deltaX = event.clientX - lastPointerXRef.current;
      lastPointerXRef.current = event.clientX;
      applyDragDelta(deltaX);
    },
    [applyDragDelta, isDragging]
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const totalSwipe = event.clientX - swipeStartXRef.current;

      if (Math.abs(totalSwipe) >= SWIPE_THRESHOLD && dragOffsetRef.current === 0) {
        if (totalSwipe < 0) goNext();
        else goPrev();
      }

      setIsDragging(false);
      dragOffsetRef.current = 0;
      markInteraction();
    },
    [goNext, goPrev, isDragging, markInteraction]
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goNext();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        goPrev();
      }
    },
    [goNext, goPrev]
  );

  useEffect(() => {
    setActiveIndex(defaultIndex);
  }, [defaultIndex, frames]);

  useEffect(() => {
    if (!autoRotate || !canDrag || reduced || isDragging) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      return;
    }

    const tick = (now: number) => {
      const idleFor = now - lastInteractionRef.current;

      if (idleFor >= INACTIVITY_MS) {
        if (lastTickRef.current === 0) lastTickRef.current = now;
        const delta = now - lastTickRef.current;
        lastTickRef.current = now;
        frameAccumulatorRef.current += delta;

        while (frameAccumulatorRef.current >= frameInterval) {
          frameAccumulatorRef.current -= frameInterval;
          setDirection(1);
          setActiveIndex((current) =>
            normalizeIndex(current + 1, frames.length)
          );
        }
      } else {
        lastTickRef.current = 0;
        frameAccumulatorRef.current = 0;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [autoRotate, canDrag, frameInterval, frames.length, isDragging, reduced]);

  const fadeVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      scale: reduced ? 1 : dir > 0 ? 0.98 : 1.02,
    }),
    center: { opacity: 1, scale: 1 },
    exit: (dir: number) => ({
      opacity: 0,
      scale: reduced ? 1 : dir > 0 ? 1.02 : 0.98,
    }),
  };

  if (frames.length === 0) {
    return (
      <div
        className={cn(
          "flex aspect-square items-center justify-center rounded-3xl",
          isDark ? "bg-white/5 text-gray-400" : "bg-neutral-50 text-brand-muted",
          className
        )}
      >
        No images available
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label={`${productName} image viewer`}
      aria-roledescription="carousel"
      tabIndex={canDrag ? 0 : undefined}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "product360-viewer immersive-viewer-stage relative aspect-square w-full touch-none select-none outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40",
        isDragging ? "cursor-grabbing" : canDrag ? "cursor-grab" : "cursor-default",
        MOTION_GPU,
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

      {canDrag && (
        <div
          className={cn(
            "absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] shadow-sm backdrop-blur-md",
            isDark
              ? "border border-white/20 bg-black/50 text-white"
              : "border border-white/60 bg-white/80 text-brand-black"
          )}
        >
          <Rotate3d className="h-3.5 w-3.5 text-brand-accent" />
          {isSpinSequence ? "360° View" : "Gallery"}
        </div>
      )}

      {!allLoaded && frames.length > 1 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-3xl bg-black/5">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
        </div>
      )}

      <div className="relative z-10 flex h-full w-full items-center justify-center p-5 sm:p-8">
        <div className="relative h-full w-full max-h-[min(72vw,520px)] max-w-[min(72vw,520px)]">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={activeSrc}
              custom={direction}
              variants={fadeVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: EASE_LUXURY }}
              className="relative h-full w-full"
            >
              {!frameLoaded && (
                <div className="skeleton-shimmer absolute inset-0 rounded-2xl bg-neutral-100/80" />
              )}
              <AssetImage
                src={activeSrc}
                alt={`${productName} — ${getFrameLabel(activeSrc, activeIndex)}`}
                fill
                priority={activeIndex === defaultIndex}
                loading={activeIndex === defaultIndex ? undefined : "lazy"}
                draggable={false}
                onLoad={() =>
                  setInlineLoaded((current) => ({ ...current, [activeSrc]: true }))
                }
                className={cn(
                  "object-contain drop-shadow-[0_20px_36px_rgba(0,0,0,0.12)] transition-opacity duration-300",
                  frameLoaded ? "opacity-100" : "opacity-0"
                )}
                sizes="(max-width: 768px) 92vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {showControls && canDrag && (
        <>
          <button
            type="button"
            onClick={goPrev}
            className="immersive-viewer-nav absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 sm:flex"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={goNext}
            className="immersive-viewer-nav absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 sm:flex"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-[0.22em]",
                  isDark ? "text-gray-400" : "text-brand-muted"
                )}
              >
                Drag or swipe to browse
              </p>
              <p
                className={cn(
                  "mt-1 truncate font-display text-sm font-semibold",
                  isDark ? "text-white" : "text-brand-black"
                )}
              >
                {getFrameLabel(activeSrc, activeIndex)}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] shadow-sm backdrop-blur-md",
                isDark
                  ? "bg-black/50 text-white ring-1 ring-white/15"
                  : "bg-white/80 text-brand-black"
              )}
            >
              {activeIndex + 1} / {frames.length}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export { getViewerFrames } from "@/lib/viewerFrames";
export { has360Rotation } from "@/lib/product360Frames";
