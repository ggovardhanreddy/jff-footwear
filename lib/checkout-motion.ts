import { EASE_LUXURY, MOTION_GPU, SPRING_SNAPPY } from "@/lib/motion";

export const CHECKOUT_EASE = EASE_LUXURY;

export const checkoutStepTransition = (reduced: boolean | null) => ({
  initial: reduced ? false : { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: reduced ? undefined : { opacity: 0, y: -12, filter: "blur(4px)" },
  transition: {
    duration: reduced ? 0 : 0.38,
    ease: CHECKOUT_EASE,
  },
});

export const checkoutPanelReveal = (reduced: boolean | null, delay = 0) => ({
  initial: reduced ? false : { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: reduced ? 0 : 0.5,
    delay: reduced ? 0 : delay,
    ease: CHECKOUT_EASE,
  },
});

export const checkoutItemStagger = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.35,
      ease: CHECKOUT_EASE,
    },
  }),
};

export const checkoutSuccessSpring = {
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  transition: SPRING_SNAPPY,
};

export const CHECKOUT_MOTION_GPU = MOTION_GPU;
