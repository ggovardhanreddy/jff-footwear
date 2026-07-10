"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Youtube,
  MessageCircle,
  Mail,
  Linkedin,
  Github,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SocialNetwork =
  "instagram" | "facebook" | "youtube" | "whatsapp" | "email" | "linkedin" | "github";

const ICON_MAP: Record<SocialNetwork, LucideIcon> = {
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  whatsapp: MessageCircle,
  email: Mail,
  linkedin: Linkedin,
  github: Github,
};

export type SocialLink = {
  network: SocialNetwork;
  href: string;
  label: string;
};

type SocialFlipButtonProps = {
  links: Array<{ network: string; href: string; label: string }>;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const SIZE = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-14 w-14",
} as const;

/** 3D flip social buttons — front icon / back network initials. */
export default function SocialFlipButton({ links, className, size = "md" }: SocialFlipButtonProps) {
  const reduced = useReducedMotion();

  return (
    <ul className={cn("flex flex-wrap items-center gap-3", className)}>
      {links.map((link) => {
        const Icon = ICON_MAP[link.network as SocialNetwork];
        if (!Icon || !link.href) return null;
        return (
          <li key={link.network} style={{ perspective: 800 }}>
            <motion.a
              href={link.href}
              target={link.network === "email" ? undefined : "_blank"}
              rel={link.network === "email" ? undefined : "noopener noreferrer"}
              aria-label={link.label}
              className={cn("group relative block", SIZE[size], "[transform-style:preserve-3d]")}
              whileHover={reduced ? undefined : { rotateY: 180 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur-md [backface-visibility:hidden]",
                  SIZE[size]
                )}
              >
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-full bg-brand-accent text-[9px] font-bold uppercase tracking-wider text-brand-black [backface-visibility:hidden] [transform:rotateY(180deg)]",
                  SIZE[size]
                )}
              >
                {link.network.slice(0, 2)}
              </span>
            </motion.a>
          </li>
        );
      })}
    </ul>
  );
}
