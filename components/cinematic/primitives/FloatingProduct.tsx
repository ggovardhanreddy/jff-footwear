"use client";

import {
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  motion,
  useSpring,
  useTransform,
  useReducedMotion,
  AnimatePresence,
} from "framer-motion";
import AssetImage from "@/components/ui/AssetImage";
import { cn } from "@/lib/utils";

interface FloatingProductProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  glow?: boolean;
  gallery?: string[];
  children?: ReactNode;
}

export default function FloatingProduct({
  src,
  alt,
  className,
  priority = false,
  glow = true,
  gallery,
  children,
}: FloatingProductProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [activeSrc, setActiveSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);

  const rotateX = useSpring(0, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 180, damping: 22 });
  const shadowX = useTransform(rotateY, (v) => v * 2);
  const shadowOpacity = useTransform(rotateX, (v) =>
    Math.max(0.12, 0.28 - Math.abs(v) * 0.008)
  );

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX.set(-y * 16);
      rotateY.set(x * 16);
    },
    [reduced, rotateX, rotateY]
  );

  const reset = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={cn("relative flex items-center justify-center", className)}
    >
      {glow && (
        <div className="pointer-events-none absolute inset-[15%] rounded-full bg-brand-accent/15 blur-[80px]" />
      )}

      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[8%] left-1/2 z-0 h-[8%] w-[50%] -translate-x-1/2 rounded-[100%] bg-black/40 blur-2xl"
        style={{ x: shadowX, opacity: shadowOpacity }}
        animate={reduced ? undefined : { scaleX: [1, 1.08, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="relative z-10 w-full max-w-lg"
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={
          reduced
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                perspective: 1200,
              }
        }
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -18, 0], rotate: [0, 1.5, 0, -1.5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="relative aspect-square w-full"
        >
          {!loaded && (
            <div className="skeleton-shimmer absolute inset-0 z-10 rounded-3xl bg-white/10" />
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSrc}
              initial={{ opacity: 0.6, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.6, scale: 1.01 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-full w-full"
            >
              <AssetImage
                src={activeSrc}
                alt={alt}
                fill
                priority={priority}
                onLoad={() => setLoaded(true)}
                className="object-contain opacity-100 drop-shadow-[0_32px_64px_rgba(0,0,0,0.35)]"
                sizes="(max-width: 768px) 85vw, 45vw"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {gallery && gallery.length > 1 && (
        <div className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {gallery.map((img) => (
            <button
              key={img}
              type="button"
              onClick={() => {
                setLoaded(false);
                setActiveSrc(img);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                activeSrc === img ? "w-8 bg-brand-accent" : "w-2 bg-white/30"
              )}
              aria-label="Change product view"
            />
          ))}
        </div>
      )}

      {children}
    </div>
  );
}
