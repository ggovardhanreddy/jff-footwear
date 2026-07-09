"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  useScroll,
} from "framer-motion";

/** Parallax offset from scroll progress (0–1). */
export function useScrollParallax(
  inputRange: [number, number] = [0, 1],
  outputRange: [number, number] = [0, 80]
) {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  return useTransform(
    scrollYProgress,
    inputRange,
    reduced ? [0, 0] : outputRange
  );
}

/** Mouse parallax for hero / floating product layers. */
export function useMouseParallax(intensity = 20) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      x.set(px * intensity);
      y.set(py * intensity * 0.7);
    },
    [reduced, x, y, intensity]
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return { x: springX, y: springY, onMouseMove, onMouseLeave, disabled: reduced };
}

/** 3D tilt on hover for cards and product images. */
export function useTilt(intensity = 12) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 200, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 22 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX.set(-py * intensity);
      rotateY.set(px * intensity);
    },
    [reduced, rotateX, rotateY, intensity]
  );

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return {
    rotateX,
    rotateY,
    onMouseMove,
    onMouseLeave,
    style: reduced
      ? undefined
      : ({
          rotateX,
          rotateY,
          transformPerspective: 1200,
        } as const),
  };
}

/** Magnetic pull for buttons and CTAs. */
export function useMagnetic(strength = 0.18) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 350, damping: 22 });
  const springY = useSpring(y, { stiffness: 350, damping: 22 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduced) return;
      const rect = e.currentTarget.getBoundingClientRect();
      x.set((e.clientX - rect.left - rect.width / 2) * strength);
      y.set((e.clientY - rect.top - rect.height / 2) * strength);
    },
    [reduced, x, y, strength]
  );

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return {
    x: springX,
    y: springY,
    onMouseMove,
    onMouseLeave,
    disabled: reduced,
  };
}

/** Global scroll progress 0–1 for progress rings / bars. */
export function usePageScrollProgress() {
  const { scrollYProgress } = useScroll();
  return scrollYProgress;
}

/** Show intro loader once per session. */
export function useIntroLoader() {
  const reduced = useReducedMotion();
  const [show, setShow] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduced) {
      setReady(true);
      return;
    }
    const seen = sessionStorage.getItem("jff-intro-seen");
    if (seen) {
      setReady(true);
      return;
    }
    setShow(true);
  }, [reduced]);

  const complete = useCallback(() => {
    sessionStorage.setItem("jff-intro-seen", "1");
    setShow(false);
    setReady(true);
  }, []);

  return { showIntro: show, ready, completeIntro: complete };
}

/** Animated number count-up. */
export function useCountUp(
  target: number,
  duration = 1200,
  enabled = true
): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (!enabled || reduced) {
      setValue(target);
      return;
    }
    let start: number | null = null;
    let frame: number;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, enabled, reduced]);

  return value;
}
