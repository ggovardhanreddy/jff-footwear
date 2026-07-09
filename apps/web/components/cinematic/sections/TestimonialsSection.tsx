"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import SnapSection from "@/components/cinematic/primitives/SnapSection";
import CinematicBackground from "@/components/cinematic/primitives/CinematicBackground";
import SplitText from "@/components/cinematic/primitives/SplitText";
import type { Review } from "@/types";

interface TestimonialsSectionProps {
  reviews: Review[];
}

export default function TestimonialsSection({
  reviews,
}: TestimonialsSectionProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const review = reviews[index];

  useEffect(() => {
    if (reduced) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [reviews.length, reduced]);

  if (!review) return null;

  return (
    <SnapSection id="testimonials" dark className="justify-center pt-16">
      <CinematicBackground variant="dark" />

      <div className="container-custom relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center py-10 text-center">
        <p className="eyebrow">Section 07</p>
        <SplitText
          text="Trusted Worldwide"
          className="heading-section mx-auto mt-3 max-w-2xl text-white"
        />

        <div className="relative mt-12 w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={review.id}
              initial={reduced ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -24 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] px-8 py-12 backdrop-blur-md md:px-14 md:py-16"
            >
              <div className="mb-6 flex justify-center gap-1">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-brand-accent text-brand-accent"
                    aria-hidden
                  />
                ))}
              </div>
              <p className="font-display text-xl leading-relaxed text-white md:text-2xl">
                &ldquo;{review.comment}&rdquo;
              </p>
              <footer className="mt-8">
                <p className="text-sm font-semibold uppercase tracking-widest text-brand-accent">
                  {review.name}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {review.location} · {review.productName}
                </p>
              </footer>
            </motion.blockquote>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                setIndex((i) => (i - 1 + reviews.length) % reviews.length)
              }
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-accent hover:text-brand-accent"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  aria-current={index === i}
                  className="focus-ring rounded-full p-2"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all ${
                      index === i ? "w-8 bg-brand-accent" : "w-2 bg-white/25"
                    }`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % reviews.length)}
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-brand-accent hover:text-brand-accent"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </SnapSection>
  );
}
