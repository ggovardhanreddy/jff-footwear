"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useSpring,
  useTransform,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  get360Views,
  getSupplementaryImages,
} from "@/lib/productViews";
import Fake360Viewer from "./Fake360Viewer";

interface ImmersiveProductViewerProps {
  images: string[];
  productName: string;
}

const SPRING = { stiffness: 260, damping: 26, mass: 0.65 };
const SWIPE_THRESHOLD = 48;

interface ViewerStageProps {
  images: string[];
  productName: string;
  activeIndex: number;
  direction: number;
  loadedMap: Record<number, boolean>;
  isHovered: boolean;
  fullscreen?: boolean;
  onHover: (hovered: boolean) => void;
  onLoad: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onFullscreen?: () => void;
  onKeyDown: (e: ReactKeyboardEvent<HTMLDivElement>) => void;
}

function ViewerStage({
  images,
  productName,
  activeIndex,
  direction,
  loadedMap,
  isHovered,
  fullscreen = false,
  onHover,
  onLoad,
  onPrev,
  onNext,
  onFullscreen,
  onKeyDown,
}: ViewerStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const rotateX = useSpring(0, SPRING);
  const rotateY = useSpring(0, SPRING);
  const shadowX = useTransform(rotateY, (v) => v * 2.2);
  const shadowScaleX = useTransform(rotateY, (v) => 1 + Math.abs(v) * 0.012);
  const shadowOpacity = useTransform(rotateX, (v) =>
    Math.max(0.14, 0.28 - Math.abs(v) * 0.006)
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (prefersReducedMotion || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX.set(-y * 14);
      rotateY.set(x * 14);
    },
    [prefersReducedMotion, rotateX, rotateY]
  );

  const resetTilt = useCallback(() => {
    onHover(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [onHover, rotateX, rotateY]);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.x < -SWIPE_THRESHOLD) onNext();
      else if (info.offset.x > SWIPE_THRESHOLD) onPrev();
    },
    [onNext, onPrev]
  );

  const slideVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir > 0 ? 48 : -48,
      scale: 0.94,
    }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({
      opacity: 0,
      x: prefersReducedMotion ? 0 : dir > 0 ? -48 : 48,
      scale: 1.04,
    }),
  };

  return (
    <div
      ref={stageRef}
      role="region"
      aria-label={`${productName} image gallery`}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={resetTilt}
      className={cn(
        "immersive-viewer-stage relative outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/40",
        fullscreen ? "h-full w-full" : "aspect-square w-full"
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-neutral-50 via-white to-neutral-100" />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[12%] left-1/2 z-0 h-[10%] w-[55%] -translate-x-1/2 rounded-[100%] bg-black blur-2xl"
        style={{ x: shadowX, scaleX: shadowScaleX, opacity: shadowOpacity }}
        animate={
          prefersReducedMotion
            ? undefined
            : { y: [0, 6, 0], scale: [1, 1.05, 1] }
        }
        transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 flex h-full w-full items-center justify-center p-6 sm:p-10"
        animate={prefersReducedMotion ? undefined : { y: [0, -16, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        style={
          prefersReducedMotion
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1400,
              }
        }
      >
        <motion.div
          className="relative h-full w-full max-h-[min(72vw,520px)] max-w-[min(72vw,520px)]"
          drag={images.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.14}
          onDragEnd={handleDragEnd}
          animate={{ scale: isHovered ? 1.06 : 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={`${activeIndex}-${images[activeIndex]}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full w-full"
            >
              {!loadedMap[activeIndex] && (
                <div className="skeleton-shimmer absolute inset-0 rounded-2xl bg-neutral-100" />
              )}
              <Image
                src={images[activeIndex]}
                alt={`${productName} — view ${activeIndex + 1}`}
                fill
                priority={activeIndex === 0}
                loading={activeIndex === 0 ? undefined : "lazy"}
                onLoad={() => onLoad(activeIndex)}
                className={cn(
                  "object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.14)] transition-opacity duration-500",
                  loadedMap[activeIndex] ? "opacity-100" : "opacity-0"
                )}
                sizes="(max-width: 768px) 90vw, 50vw"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={onPrev}
            className="immersive-viewer-nav absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 sm:flex"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={onNext}
            className="immersive-viewer-nav absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 sm:flex"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between">
        <span className="rounded-full bg-white/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-black shadow-sm backdrop-blur-md">
          {activeIndex + 1} / {images.length}
        </span>
        {!fullscreen && onFullscreen && (
          <button
            type="button"
            onClick={onFullscreen}
            className="immersive-viewer-nav"
            aria-label="Open fullscreen viewer"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function FlatExtraImage({
  src,
  productName,
  fullscreen,
  onFullscreen,
}: {
  src: string;
  productName: string;
  fullscreen?: boolean;
  onFullscreen?: () => void;
}) {
  return (
    <div
      className={cn(
        "immersive-viewer-stage relative overflow-hidden",
        fullscreen ? "h-full w-full" : "aspect-square w-full"
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-neutral-100" />
      <div className="relative flex h-full items-center justify-center p-6 sm:p-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={src}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="relative h-full w-full max-h-[min(72vw,520px)] max-w-[min(72vw,520px)]"
          >
            <Image
              src={src}
              alt={`${productName} additional view`}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 90vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      {!fullscreen && onFullscreen && (
        <div className="absolute bottom-4 right-4 z-20">
          <button
            type="button"
            onClick={onFullscreen}
            className="immersive-viewer-nav"
            aria-label="Open fullscreen viewer"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function ImmersiveProductViewer({
  images,
  productName,
}: ImmersiveProductViewerProps) {
  const views360 = useMemo(() => get360Views(images), [images]);
  const supplementaryImages = useMemo(
    () => getSupplementaryImages(images, views360),
    [images, views360]
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});
  const [selectedExtra, setSelectedExtra] = useState<string | null>(null);
  const [show360, setShow360] = useState(true);

  const galleryImages = views360 ? supplementaryImages : images;

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex || galleryImages.length === 0) return;
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex, galleryImages.length]
  );

  const goNext = useCallback(() => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    },
    [isFullscreen]
  );

  useEffect(() => {
    if (!isFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isFullscreen]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-3xl bg-neutral-50 text-brand-muted">
        No images available
      </div>
    );
  }

  const stageProps = {
    images: galleryImages,
    productName,
    activeIndex,
    direction,
    loadedMap,
    isHovered,
    onHover: setIsHovered,
    onLoad: (index: number) =>
      setLoadedMap((m) => ({ ...m, [index]: true })),
    onPrev: goPrev,
    onNext: goNext,
    onKeyDown: handleKeyDown,
  };

  const renderMainViewer = (fullscreen = false) => {
    if (views360 && show360 && !selectedExtra) {
      return (
        <div className="relative">
          <Fake360Viewer
            views={views360}
            productName={productName}
            fullscreen={fullscreen}
            onKeyDown={handleKeyDown}
          />
          {!fullscreen && (
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="immersive-viewer-nav absolute bottom-4 right-4 z-30"
              aria-label="Open fullscreen viewer"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          )}
        </div>
      );
    }

    if (selectedExtra) {
      return (
        <FlatExtraImage
          src={selectedExtra}
          productName={productName}
          fullscreen={fullscreen}
          onFullscreen={fullscreen ? undefined : () => setIsFullscreen(true)}
        />
      );
    }

    return (
      <ViewerStage
        {...stageProps}
        fullscreen={fullscreen}
        onFullscreen={fullscreen ? undefined : () => setIsFullscreen(true)}
      />
    );
  };

  return (
    <div className="space-y-5">
      {renderMainViewer(false)}

      {/* 360 + supplementary thumbnails */}
      {views360 && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand-muted">
            Views
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setShow360(true);
                setSelectedExtra(null);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-[10px] font-semibold uppercase tracking-widest transition-all",
                show360 && !selectedExtra
                  ? "bg-brand-black text-white"
                  : "bg-white text-brand-muted ring-1 ring-black/10 hover:text-brand-black"
              )}
            >
              360° Rotate
            </button>
            {supplementaryImages.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => {
                  setShow360(false);
                  setSelectedExtra(src);
                }}
                className={cn(
                  "relative h-14 w-14 overflow-hidden rounded-xl border-2 transition-all",
                  selectedExtra === src
                    ? "border-brand-black shadow-md"
                    : "border-transparent ring-1 ring-black/10 hover:border-brand-accent/50"
                )}
                aria-label={`View ${src.split("/").pop()}`}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Standard gallery thumbnails (non-360 products) */}
      {!views360 && galleryImages.length > 1 && (
        <div
          className={cn(
            "grid gap-2.5",
            galleryImages.length <= 4
              ? "grid-cols-4"
              : "grid-cols-4 sm:grid-cols-6"
          )}
        >
          {galleryImages.map((src, index) => (
            <motion.button
              key={src}
              type="button"
              onClick={() => goTo(index)}
              whileTap={{ scale: 0.96 }}
              className={cn(
                "relative aspect-square overflow-hidden rounded-2xl border-2 bg-white transition-colors",
                activeIndex === index
                  ? "border-brand-black shadow-md"
                  : "border-transparent hover:border-brand-accent/50"
              )}
              aria-label={`View image ${index + 1}`}
              aria-current={activeIndex === index}
            >
              <Image
                src={src}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                loading="lazy"
                className="object-cover"
                sizes="80px"
              />
            </motion.button>
          ))}
        </div>
      )}

      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-brand-muted sm:text-left">
        {views360
          ? "Drag horizontally for 360° · Swipe on mobile"
          : "Swipe on mobile · Arrow keys on desktop"}
      </p>

      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            role="dialog"
            aria-modal="true"
            aria-label={`${productName} fullscreen viewer`}
          >
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute right-4 top-4 z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              aria-label="Close fullscreen"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-full w-full max-w-5xl">
              {renderMainViewer(true)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
