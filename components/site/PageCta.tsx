"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import WhatsAppButton from "@/components/WhatsAppButton";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PageCtaProps {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  whatsappLabel?: string;
  whatsappMessage?: string;
  className?: string;
}

export default function PageCta({
  title,
  description,
  primaryLabel,
  primaryHref,
  whatsappLabel = "Chat on WhatsApp",
  whatsappMessage,
  className,
}: PageCtaProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-[32px] border border-black/[0.06] bg-gradient-to-br from-brand-cream/60 to-white/80 p-8 text-center shadow-soft backdrop-blur-md md:p-12",
        className
      )}
    >
      <h2 className="font-display text-2xl font-bold md:text-3xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-brand-muted md:text-base">
        {description}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link href={primaryHref}>
          <Button variant="primary" size="lg">
            {primaryLabel}
          </Button>
        </Link>
        <WhatsAppButton label={whatsappLabel} message={whatsappMessage} />
      </div>
    </motion.div>
  );
}
