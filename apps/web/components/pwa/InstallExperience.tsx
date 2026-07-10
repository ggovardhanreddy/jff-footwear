"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Star, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useInstall } from "@/context/InstallContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function InstallExperience() {
  const pathname = usePathname();
  const {
    canInstall,
    isInstalled,
    dismissedBanner,
    dismissBanner,
    promptInstall,
    platform,
    browseCount,
    shouldSuggestInstall,
  } = useInstall();
  const { profile, user } = useAuth();
  const { itemCount } = useCart();
  const [showBanner, setShowBanner] = useState(false);
  const [showExit, setShowExit] = useState(false);
  const [exitShown, setExitShown] = useState(false);

  useEffect(() => {
    if (isInstalled || dismissedBanner) return;
    const t = window.setTimeout(() => setShowBanner(true), 4500);
    return () => window.clearTimeout(t);
  }, [isInstalled, dismissedBanner]);

  useEffect(() => {
    if (platform !== "desktop" || isInstalled || exitShown || dismissedBanner) {
      return;
    }
    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 8) {
        setShowExit(true);
        setExitShown(true);
      }
    };
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [platform, isInstalled, exitShown, dismissedBanner]);

  if (isInstalled) return null;

  const name = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0];
  const onProduct = pathname.startsWith("/products/");
  const onCart = pathname.startsWith("/cart") || pathname.startsWith("/checkout");

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === "unavailable") {
      window.location.href = ROUTES.install;
    }
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && !dismissedBanner && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed inset-x-3 bottom-20 z-[45] mx-auto max-w-lg lg:bottom-6"
            role="dialog"
            aria-label="Install JFF app"
          >
            <div className="rounded-[1.75rem] border border-white/40 bg-white/85 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] backdrop-blur-2xl dark:border-white/10 dark:bg-brand-charcoal/90">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-semibold text-brand-black dark:text-white">
                    Get the Full JFF Experience
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-brand-muted">
                    <li>Faster Shopping</li>
                    <li>Exclusive Offers</li>
                    <li>Earn More JFF Coins</li>
                    <li>Early Access to New Collections</li>
                  </ul>
                  <p className="mt-2 flex items-center gap-1 text-xs text-brand-accent">
                    <Star className="h-3.5 w-3.5 fill-brand-accent" />
                    Rated by customers
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    dismissBanner();
                    setShowBanner(false);
                  }}
                  className="rounded-full p-1.5 text-brand-muted hover:bg-black/5"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleInstall()}
                  className="rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-black shadow-[0_0_24px_rgba(200,169,110,0.4)]"
                >
                  {canInstall ? "Install App" : "Download App"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    dismissBanner();
                    setShowBanner(false);
                  }}
                  className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold dark:border-white/15"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isInstalled && (
        <motion.button
          type="button"
          onClick={() => void handleInstall()}
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          className={cn(
            "fixed bottom-24 right-4 z-[44] flex items-center gap-2 rounded-full bg-brand-black px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-[0_0_28px_rgba(200,169,110,0.45)] lg:bottom-8",
            showBanner && !dismissedBanner && "hidden sm:flex"
          )}
          aria-label="Download JFF app"
        >
          <Download className="h-4 w-4 text-brand-accent" />
          Download App
        </motion.button>
      )}

      <AnimatePresence>
        {showExit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-md rounded-[2rem] border border-white/30 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-brand-charcoal"
            >
              <h2 className="font-display text-2xl font-semibold text-brand-black dark:text-white">
                Don&apos;t Miss Exclusive JFF Deals!
              </h2>
              <p className="mt-3 text-sm text-brand-muted">
                Download the JFF App and enjoy exclusive discounts, faster checkout, reward coins,
                order tracking, wishlist sync, and members-only offers.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleInstall()}
                  className="rounded-full bg-brand-accent px-5 py-2.5 text-sm font-semibold text-brand-black"
                >
                  Download Now
                </button>
                <button
                  type="button"
                  onClick={() => setShowExit(false)}
                  className="rounded-full border border-black/10 px-5 py-2.5 text-sm font-semibold dark:border-white/15"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {onProduct && !isInstalled && (
        <div className="fixed inset-x-0 bottom-[4.5rem] z-[42] px-3 lg:hidden">
          <div className="mx-auto flex max-w-lg items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/90 px-4 py-3 text-sm shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-brand-charcoal/90">
            <p className="text-xs text-brand-muted">
              View this product in the JFF App — faster checkout &amp; extra coins.
            </p>
            <button
              type="button"
              onClick={() => void handleInstall()}
              className="shrink-0 rounded-full bg-brand-black px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-white"
            >
              Open App
            </button>
          </div>
        </div>
      )}

      {onCart && itemCount > 0 && !isInstalled && (
        <div className="container-custom relative z-10 mb-4 mt-2">
          <div className="rounded-2xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-3 text-sm">
            <p className="font-medium text-brand-black dark:text-white">
              Complete your purchase in the JFF App and earn extra JFF Coins!
            </p>
            <Link
              href={ROUTES.install}
              className="mt-1 inline-block text-xs font-semibold uppercase tracking-widest text-brand-accent"
            >
              Install now →
            </Link>
          </div>
        </div>
      )}

      {shouldSuggestInstall && browseCount >= 5 && name && !showBanner && (
        <span className="sr-only">Hi {name}, install the JFF App for a faster experience.</span>
      )}
    </>
  );
}
