"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteChrome() {
  const pathname = usePathname();
  const isCinematicHome = pathname === "/";

  if (isCinematicHome) return null;

  return (
    <>
      <Footer />
      <WhatsAppButton variant="floating" />
    </>
  );
}
