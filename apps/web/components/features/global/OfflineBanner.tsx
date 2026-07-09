"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { WifiOff, Wifi } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useLanguage } from "@/context/LanguageContext";

export default function OfflineBanner() {
  const { online, reconnected } = useOnlineStatus();
  const { t } = useLanguage();
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {(!online || reconnected) && (
        <motion.div
          initial={reduced ? false : { y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduced ? undefined : { y: -48, opacity: 0 }}
          className={`fixed inset-x-0 top-0 z-[150] flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold ${
            online
              ? "bg-emerald-600 text-white"
              : "bg-amber-500 text-brand-black"
          }`}
          role="status"
        >
          {online ? (
            <>
              <Wifi className="h-4 w-4" aria-hidden />
              {t("reconnected")}
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4" aria-hidden />
              {t("offline")}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
