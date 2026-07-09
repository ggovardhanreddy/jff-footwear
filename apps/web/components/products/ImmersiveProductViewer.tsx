"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import AssetImage from "@/components/ui/AssetImage";
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
import { getGalleryImages } from "@/lib/productViews";
import { SOLD_OUT_IMAGE } from "@/lib/paths";
import { imageMorph } from "@/lib/animationVariants";

interface ImmersiveProductViewerProps {
  images: string[];
  productName: string;
  variant?: "light" | "dark";
}

const SPRING = { stiffness: 260, damping: 26, mass: 0.65 };
const SWIPE_THRESHOLD = 48;

function getDefaultImageIndex(images: string[]): number {
  if (images.length <= 1) return 0;
  const mainIdx = images.findIndex((img) => /main\./i.test(img));
  if (mainIdx >= 0) return mainIdx;
  const frontIdx = images.findIndex((img) => /front\./i.test(img));
  if (frontIdx >= 0) return frontIdx;
  return 0;
}

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
      scale: prefersReducedMotion ? 1 : 1.08,
    }),
    center: imageMorph.animate,
    exit: (dir: number) =>
      prefersReducedMotion
        ? { opacity: 0 }
        : {
            opacity: 0,
            x: dir > 0 ? -48 : 48,
            scale: 0.95,
            transition: imageMorph.exit.transition,
          },
  };

  return (
    <div
      ref={stageRef}
      data-cursor="view"
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
              <AssetImage
                src={images[activeIndex]}
                alt={`${productName} — view ${activeIndex + 1}`}
                fill
                priority={activeIndex === 0}
                loading={activeIndex === 0 ? undefined : "lazy"}
                onLoad={() => onLoad(activeIndex)}
                className={cn(
                  "object-contain drop-shadow-[0_24px_40px_rgba(0,0,0,0.14)] transition-opacity duration-300",
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

export default function ImmersiveProductViewer({
  images,
  productName,
  variant = "light",
}: ImmersiveProductViewerProps) {
  const isDark = variant === "dark";
  const galleryImages = useMemo(() => {
    const visible = getGalleryImages(images);
    return visible.length > 0 ? visible : [SOLD_OUT_IMAGE];
  }, [images]);
  const isSoldOut = galleryImages.length === 1 && galleryImages[0] === SOLD_OUT_IMAGE;
  const defaultIndex = useMemo(
    () => getDefaultImageIndex(galleryImages),
    [galleryImages]
  );

  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [direction, setDirection] = useState(0);
  const [loadedMap, setLoadedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setActiveIndex(defaultIndex);
    setLoadedMap({});
    setDirection(0);
  }, [galleryImages, defaultIndex]);

  const goTo = useCallback(
    (index: number) => {
      if (index === activeIndex || galleryImages.length === 0) return;
      setDirection(index > activeIndex ? 1 : -1);
      setActiveIndex(index);
    },
    [activeIndex, galleryImages.length]
  );

  const goNext = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setDirection(1);
    setActiveIndex((i) => (i + 1) % galleryImages.length);
  }, [galleryImages.length]);

  const goPrev = useCallback(() => {
    if (galleryImages.length <= 1) return;
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  }, [galleryImages.length]);

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    },
    [goNext, goPrev, isFullscreen]
  );

  useEffect(() => {
    if (!isFullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isFullscreen]);

  if (images.length === 0 || isSoldOut) {
    return (
      <div className="space-y-5">
        <div className="immersive-viewer-stage relative aspect-square w-full overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neutral-50 via-white to-neutral-100" />
          <div className="relative flex h-full items-center justify-center p-8">
            <div className="relative h-full w-full max-h-[min(72vw,520px)] max-w-[min(72vw,520px)]">
              <AssetImage
                src={SOLD_OUT_IMAGE}
                alt={`${productName} — sold out`}
                fill
                priority
                className="object-contain p-6"
                sizes="(max-width: 768px) 90vw, 50vw"
              />
            </div>
          </div>
        </div>
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

  const renderMainViewer = (fullscreen = false) => (
    <ViewerStage
      {...stageProps}
      fullscreen={fullscreen}
      onFullscreen={fullscreen ? undefined : () => setIsFullscreen(true)}
    />
  );

  return (
    <div className="space-y-5">
      {renderMainViewer(false)}

      {galleryImages.length > 1 && (
        <div
          className={cn(
            "grid gap-2.5",
            galleryImages.length <= 4 ? "grid-cols-4" : "grid-cols-4 sm:grid-cols-6"
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
              <AssetImage
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

      {galleryImages.length > 1 && (
        <p
          className={cn(
            "text-center text-[10px] uppercase tracking-[0.2em] sm:text-left",
            isDark ? "text-gray-500" : "text-brand-muted"
          )}
        >
          Swipe on mobile · Arrow keys on desktop
        </p>
      )}

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
