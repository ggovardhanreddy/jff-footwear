"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fetchSocialProofMap } from "@jff/api/social-proof";
import type { ProductSocialProof } from "@/types";

const ALLOW_DEMO = process.env.NEXT_PUBLIC_SOCIAL_PROOF_DEMO === "true";

interface SocialProofContextValue {
  bySlug: Record<string, ProductSocialProof>;
  allowDemo: boolean;
}

const SocialProofContext = createContext<SocialProofContextValue>({
  bySlug: {},
  allowDemo: false,
});

export function SocialProofProvider({ children }: { children: ReactNode }) {
  const [bySlug, setBySlug] = useState<Record<string, ProductSocialProof>>({});

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const next = await fetchSocialProofMap();
      if (ALLOW_DEMO) {
        const demo = await import("@/data/social-proof.demo");
        for (const [slug, proof] of Object.entries(demo.DEMO_SOCIAL_PROOF)) {
          if (!next[slug]) next[slug] = proof;
        }
      }
      if (!cancelled) setBySlug(next);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({ bySlug, allowDemo: ALLOW_DEMO }), [bySlug]);

  return <SocialProofContext.Provider value={value}>{children}</SocialProofContext.Provider>;
}

export function useProductSocialProof(slug: string): ProductSocialProof | null {
  const { bySlug, allowDemo } = useContext(SocialProofContext);
  const proof = bySlug[slug];
  if (!proof) return null;
  if (proof.source === "demo" && !allowDemo) return null;
  return proof;
}

export function useSocialProofDemo(): boolean {
  return useContext(SocialProofContext).allowDemo;
}
