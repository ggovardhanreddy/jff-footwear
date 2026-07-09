/**
 * Central animation variants — GPU-friendly (transform + opacity only).
 * Import from here for consistent cinematic timing across the site.
 */

export {
  EASE_LUXURY,
  EASE_CINEMATIC,
  SPRING_LUXURY,
  SPRING_SNAPPY,
  SPRING_LIFT,
  MOTION_GPU,
  motionDisabled,
  fadeInUp,
  fadeInSection,
  staggerContainer,
  staggerItem,
  revealFromLeft,
  revealFromRight,
  scaleReveal,
  floatAnimation,
  hoverLift,
  buttonMotion,
  IMAGE_ZOOM_CLASS,
} from "@/lib/motion";

export const DURATION = {
  fast: 0.25,
  normal: 0.45,
  slow: 0.65,
  cinematic: 0.85,
  loader: 2.4,
} as const;

export const pageTransition = {
  initial: { opacity: 0, y: 16, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(6px)",
    transition: { duration: DURATION.normal, ease: [0.4, 0, 0.2, 1] },
  },
};

export const pageTransitionReduced = {
  initial: false as const,
  animate: { opacity: 1 },
  exit: { opacity: 1 },
};

export const heroReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.cinematic, ease: [0.16, 1, 0.3, 1] },
  },
};

export const blurReveal = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 24 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: DURATION.slow, ease: [0.16, 1, 0.3, 1] },
  },
};

export const imageMorph = {
  initial: { opacity: 0, scale: 1.08 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.slow, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: DURATION.fast },
  },
};

export const glassCardHover = {
  rest: {
    y: 0,
    scale: 1,
    boxShadow: "0 12px 40px -16px rgba(0,0,0,0.12)",
  },
  hover: {
    y: -10,
    scale: 1.015,
    boxShadow: "0 28px 56px -20px rgba(0,0,0,0.18)",
    transition: { type: "spring", stiffness: 340, damping: 28 },
  },
};

export const loaderLogo = {
  hidden: { opacity: 0, scale: 0.85, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
  glow: {
    scale: [1, 1.05, 1],
    filter: [
      "drop-shadow(0 0 0px rgba(200,169,110,0))",
      "drop-shadow(0 0 24px rgba(200,169,110,0.6))",
      "drop-shadow(0 0 8px rgba(200,169,110,0.3))",
    ],
    transition: { duration: 1.2, ease: "easeInOut" },
  },
};

export const lightSweep = {
  initial: { x: "-120%", opacity: 0.6 },
  animate: {
    x: "220%",
    opacity: [0, 0.8, 0],
    transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.6 },
  },
};

export const expandBackground = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: 3,
    opacity: [0, 0.35, 0],
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.2 },
  },
};

export const staggerChildren = (stagger = 0.08, delayChildren = 0.1) => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const fadeUpItem = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
};

export const rippleTap = {
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 400, damping: 28 },
};

export const navShrink = {
  expanded: { height: "4.5rem", paddingTop: 0 },
  shrunk: {
    height: "3.75rem",
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
};
