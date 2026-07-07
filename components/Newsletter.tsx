"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="section-padding bg-brand-black text-white">
      <div className="container-custom">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading
            subtitle="Stay Updated"
            title="Join Our Newsletter"
            description="Get the latest collections, manufacturing insights, and wholesale offers delivered to your inbox."
            theme="dark"
          />

          {submitted ? (
            <motion.p
              initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-brand-accent"
              role="status"
            >
              Thank you for subscribing! We&apos;ll be in touch soon.
            </motion.p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                  aria-hidden
                />
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="input-field border-gray-700 bg-brand-dark py-4 pl-11 text-white placeholder:text-gray-500"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0">
                Subscribe
                <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
