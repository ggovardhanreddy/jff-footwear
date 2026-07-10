"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type PerspectiveSlide = {
  id: string;
  image: string;
  content?: ReactNode;
};

type PerspectiveCarouselProps = {
  slides: PerspectiveSlide[];
  className?: string;
  autoPlay?: boolean;
  intervalMs?: number;
  showDots?: boolean;
  onIndexChange?: (index: number) => void;
};

/**
 * Premium perspective carousel: autoplay, infinite loop, swipe, keyboard, parallax.
 */
export default function PerspectiveCarousel({
  slides,
  className,
  autoPlay = true,
  intervalMs = 5500,
  showDots = true,
  onIndexChange,
}: PerspectiveCarouselProps) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const reduced = useReducedMotion();
  const touchStart = useRef<number | null>(null);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      const wrapped = ((next % count) + count) % count;
      setIndex(wrapped);
      onIndexChange?.(wrapped);
    },
    [count, onIndexChange]
  );

  useEffect(() => {
    if (!autoPlay || count < 2 || reduced) return;
    const id = window.setInterval(() => go(index + 1), intervalMs);
    return () => window.clearInterval(id);
  }, [autoPlay, count, go, index, intervalMs, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  const onPointerDown = (e: ReactPointerEvent) => {
    touchStart.current = e.clientX;
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (touchStart.current == null) return;
    setDragX(e.clientX - touchStart.current);
  };

  const onPointerUp = () => {
    if (touchStart.current == null) return;
    if (dragX < -60) go(index + 1);
    else if (dragX > 60) go(index - 1);
    touchStart.current = null;
    setDragX(0);
  };

  const slide = slides[index];
  if (!slide) return null;

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden rounded-[2rem] md:rounded-[2.5rem]",
        className
      )}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{ touchAction: "pan-y" }}
    >
      <div className="relative min-h-[68vh] md:min-h-[78vh]" style={{ perspective: 1400 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={reduced ? { opacity: 0 } : { opacity: 0, rotateY: 12, scale: 1.06, x: 40 }}
            animate={{
              opacity: 1,
              rotateY: 0,
              scale: 1,
              x: dragX * 0.15,
            }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, rotateY: -10, scale: 1.02, x: -30 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d" }}
          >
            {}
            <motion.img
              src={slide.image}
              alt=""
              className="h-full w-full object-cover"
              animate={reduced ? undefined : { scale: 1.08 }}
              transition={{ duration: intervalMs / 1000, ease: "linear" }}
              draggable={false}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,169,110,0.28),transparent_55%)]" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 flex min-h-[68vh] flex-col justify-end px-6 pb-12 pt-28 md:min-h-[78vh] md:px-12 md:pb-16">
          {slide.content}
        </div>

        {showDots && count > 1 ? (
          <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 md:bottom-8">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-8 bg-brand-accent" : "w-1.5 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
