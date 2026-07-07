/** Shared motion presets — honors reduced motion preferences */
export const EASE_LUXURY = [0.22, 1, 0.36, 1] as const;

export const fadeInUp = (reduced: boolean | null) => ({
  initial: reduced ? false : { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" },
  transition: { duration: reduced ? 0 : 0.55, ease: EASE_LUXURY },
});
