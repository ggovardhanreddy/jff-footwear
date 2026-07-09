/** Shared Framer Motion presets — GPU-friendly (transform/opacity only), honors reduced motion */

export const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;
export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;

export const SPRING_LUXURY = { stiffness: 120, damping: 20, mass: 0.8 };
export const SPRING_SNAPPY = { stiffness: 400, damping: 28, mass: 0.6 };
export const SPRING_LIFT = { stiffness: 340, damping: 28, mass: 0.8 };

/** Promote animated layers to their own compositor layer */
export const MOTION_GPU = "transform-gpu will-change-transform backface-hidden";

export function motionDisabled(reduced: boolean | null): boolean {
  return reduced === true;
}

export const fadeInUp = (reduced: boolean | null) => ({
  initial: reduced ? false : { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: reduced ? 0 : 0.55, ease: EASE_LUXURY },
});

export const fadeInSection = (reduced: boolean | null, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-64px" },
  transition: {
    duration: reduced ? 0 : 0.65,
    delay: reduced ? 0 : delay,
    ease: EASE_CINEMATIC,
  },
});

export const staggerContainer = (reduced: boolean | null, stagger = 0.08) => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-80px" },
  transition: {
    staggerChildren: reduced ? 0 : stagger,
    delayChildren: reduced ? 0 : 0.1,
  },
});

export const staggerItem = (reduced: boolean | null) => ({
  variants: {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduced ? 0 : 0.65, ease: EASE_CINEMATIC },
    },
  },
});

export const revealFromLeft = (reduced: boolean | null) => ({
  initial: reduced ? false : { opacity: 0, x: -48 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-64px" },
  transition: { duration: reduced ? 0 : 0.7, ease: EASE_CINEMATIC },
});

export const revealFromRight = (reduced: boolean | null) => ({
  initial: reduced ? false : { opacity: 0, x: 48 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-64px" },
  transition: { duration: reduced ? 0 : 0.7, ease: EASE_CINEMATIC },
});

export const scaleReveal = (reduced: boolean | null) => ({
  initial: reduced ? false : { opacity: 0, scale: 0.92 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-64px" },
  transition: { duration: reduced ? 0 : 0.75, ease: EASE_CINEMATIC },
});

/** Gentle vertical float loop for hero product imagery */
export const floatAnimation = (reduced: boolean | null) =>
  reduced
    ? undefined
    : {
        y: [0, -14, 0],
        transition: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        },
      };

/** Card lift on hover — use on motion wrapper */
export const hoverLift = (reduced: boolean | null) => ({
  whileHover: reduced ? undefined : { y: -10, scale: 1.01 },
  whileTap: reduced ? undefined : { scale: 0.99 },
  transition: SPRING_LIFT,
});

/** Subtle button press / hover */
export const buttonMotion = (reduced: boolean | null) => ({
  whileHover: reduced ? undefined : { y: -2, scale: 1.02 },
  whileTap: reduced ? undefined : { scale: 0.97 },
  transition: SPRING_SNAPPY,
});

/** Image zoom inside a group-hover card */
export const IMAGE_ZOOM_CLASS =
  "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] motion-gpu";
