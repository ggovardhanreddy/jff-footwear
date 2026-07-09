"use client";

import PageTransitionProvider from "@/components/motion/PageTransitionProvider";

export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransitionProvider>{children}</PageTransitionProvider>;
}
