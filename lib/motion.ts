/** Shared motion presets — honors reduced motion preferences */
export const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;
export const EASE_CINEMATIC = [0.16, 1, 0.3, 1] as const;

export const SPRING_LUXURY = { stiffness: 120, damping: 20, mass: 0.8 };
export const SPRING_SNAPPY = { stiffness: 260, damping: 26 };

export const fadeInUp = (reduced: boolean | null) => ({
  initial: reduced ? false : { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: reduced ? 0 : 0.55, ease: EASE_LUXURY },
});

export const staggerContainer = (reduced: boolean | null, stagger = 0.08) => ({
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, margin: "-80px" },
  transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : 0.1 },
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
