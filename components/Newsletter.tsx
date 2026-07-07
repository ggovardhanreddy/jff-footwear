"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
            className="[&_h2]:text-white [&_p]:text-gray-400"
          />

          {submitted ? (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 text-brand-accent"
            >
              Thank you for subscribing! We&apos;ll be in touch soon.
            </motion.p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-700 bg-brand-dark py-4 pl-11 pr-4 text-sm text-white outline-none focus:border-brand-accent"
                  aria-label="Email address"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-brand-accent px-8 py-4 text-sm font-semibold uppercase tracking-widest text-brand-black transition-colors hover:bg-white"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
