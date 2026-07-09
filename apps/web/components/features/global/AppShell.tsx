"use client";

import ToastContainer from "./ToastContainer";
import BackToTop from "./BackToTop";
import OfflineBanner from "./OfflineBanner";
import FloatingContactButton from "./FloatingContactButton";
import { CursorFollower, RouteProgress } from "@/components/motion";

/** Site-wide floating UI: toasts, offline, back-to-top, contact, cursor */
export default function AppShell() {
  return (
    <>
      <RouteProgress />
      <CursorFollower />
      <OfflineBanner />
      <ToastContainer />
      <BackToTop />
      <FloatingContactButton />
    </>
  );
}
