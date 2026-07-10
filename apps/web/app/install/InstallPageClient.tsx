"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Apple, Download, Smartphone } from "lucide-react";
import { useInstall } from "@/context/InstallContext";
import { APP_LINKS, COMPANY, ROUTES } from "@/lib/constants";
import { getStoreUrl } from "@jff/config/app-download";

export default function InstallPageClient() {
  const { canInstall, promptInstall, platform, isInstalled, downloadAction, openAppDownload } =
    useInstall();
  const searchParams = useSearchParams();
  const [origin, setOrigin] = useState<string | null>(null);
  const [showIosSteps, setShowIosSteps] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const forcedPlatform = searchParams.get("platform");
  const activePlatform =
    forcedPlatform === "ios" || forcedPlatform === "android" ? forcedPlatform : platform;

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const installUrl = useMemo(() => (origin ? `${origin}${ROUTES.install}` : ""), [origin]);
  const iosStore = getStoreUrl("ios");
  const androidStore = getStoreUrl("android");
  const iosReady = Boolean(iosStore);
  const androidReady = Boolean(androidStore);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !installUrl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 180;
    canvas.width = size;
    canvas.height = size;
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "#c8a96e";
    const cells = 11;
    const cell = size / cells;
    let seed = installUrl.length * 17;
    for (let y = 0; y < cells; y++) {
      for (let x = 0; x < cells; x++) {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff;
        const edge = x < 2 || y < 2 || x > cells - 3 || y > cells - 3;
        if (edge || seed % 3 === 0) {
          ctx.fillRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
        }
      }
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(size * 0.35, size * 0.35, size * 0.3, size * 0.3);
    ctx.fillStyle = "#c8a96e";
    ctx.font = "bold 14px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("JFF", size / 2, size / 2 + 5);
  }, [installUrl]);

  // Auto-route to the native store when live and device matches
  useEffect(() => {
    if (isInstalled) return;
    if (activePlatform === "ios" && iosStore) {
      window.location.replace(iosStore);
    } else if (activePlatform === "android" && androidStore) {
      window.location.replace(androidStore);
    }
  }, [activePlatform, iosStore, androidStore, isInstalled]);

  const handlePrimary = async () => {
    if (activePlatform === "ios" && !iosReady) {
      setShowIosSteps(true);
      return;
    }
    if (activePlatform === "android" && canInstall) {
      await promptInstall();
      return;
    }
    await openAppDownload();
  };

  const headline = isInstalled
    ? "You're all set"
    : activePlatform === "ios"
      ? iosReady
        ? "Download for iPhone"
        : "Install on iPhone"
      : activePlatform === "android"
        ? androidReady
          ? "Download for Android"
          : "Install on Android"
        : "Get the JFF App";

  return (
    <div className="page-shell">
      <div className="container-custom space-y-12 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            Get the JFF App
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Install JFF</h1>
          <p className="mt-4 text-brand-muted">
            We detect your device automatically and send you to the right download — App Store,
            Google Play, or free home-screen install.
          </p>
          {activePlatform !== "unknown" && activePlatform !== "desktop" && (
            <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-brand-accent">
              Detected: {activePlatform === "ios" ? "iPhone / iPad" : "Android"}
            </p>
          )}
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center rounded-[2rem] border border-white/50 bg-white/80 p-8 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
          >
            <canvas
              ref={canvasRef}
              className="rounded-2xl shadow-lg"
              aria-label="QR code for JFF install"
            />
            <p className="mt-4 text-center text-sm text-brand-muted">
              Scan on your phone — we detect iOS or Android and open the right install.
            </p>
            {installUrl ? (
              <a
                href={installUrl}
                className="mt-2 break-all text-xs text-brand-accent"
                suppressHydrationWarning
              >
                {installUrl}
              </a>
            ) : (
              <span className="mt-2 text-xs text-brand-muted">Loading link…</span>
            )}
          </motion.div>

          <div className="flex flex-col justify-center space-y-4 rounded-[2rem] border border-black/[0.06] bg-brand-black p-8 text-white dark:border-white/10">
            <Smartphone className="h-8 w-8 text-brand-accent" />
            <h2 className="font-display text-2xl font-semibold">{headline}</h2>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Faster shopping &amp; checkout</li>
              <li>Extra JFF Coin rewards</li>
              <li>Push offers &amp; order updates</li>
              <li>Works on iPhone and Android</li>
            </ul>

            {(activePlatform === "ios" || showIosSteps) && !isInstalled && !iosReady && (
              <ol className="space-y-1.5 rounded-2xl border border-white/15 bg-white/5 p-4 text-left text-xs text-white/80">
                <li>1. Tap the Share button in Safari</li>
                <li>2. Scroll and tap Add to Home Screen</li>
                <li>3. Tap Add — JFF opens like an app</li>
              </ol>
            )}

            {activePlatform === "android" && !isInstalled && !androidReady && (
              <p className="rounded-2xl border border-white/15 bg-white/5 p-4 text-xs text-white/80">
                Tap Install below. Chrome will prompt you to add JFF to your home screen. The Play
                Store app will replace this once published.
              </p>
            )}

            {!isInstalled && (
              <button
                type="button"
                onClick={() => void handlePrimary()}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3.5 text-sm font-semibold text-brand-black shadow-[0_0_28px_rgba(200,169,110,0.4)]"
              >
                <Download className="h-4 w-4" />
                {downloadAction.label}
              </button>
            )}

            {/* Always show both store targets for desktop / clarity */}
            <div className="flex flex-col gap-2 pt-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-white/45">
                Native apps
              </p>
              <div className="flex flex-wrap gap-2">
                <StoreBadge
                  href={iosStore ?? undefined}
                  live={iosReady}
                  label="App Store"
                  icon={<Apple className="h-4 w-4" />}
                />
                <StoreBadge
                  href={androidStore ?? undefined}
                  live={androidReady}
                  label="Google Play"
                />
              </div>
              {!APP_LINKS.storesLive && (
                <p className="text-[11px] text-white/50">
                  Native iOS &amp; Android apps are in progress. Install the free web app now — same
                  shopping experience on your home screen.
                </p>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-brand-muted">
          Deep links use <code className="text-xs">{APP_LINKS.deepLinkScheme}</code> for{" "}
          {COMPANY.name} products, cart, and orders.{" "}
          <Link href={ROUTES.home} className="text-brand-accent underline">
            Back to shop
          </Link>
        </p>
      </div>
    </div>
  );
}

function StoreBadge({
  href,
  live,
  label,
  icon,
}: {
  href?: string;
  live: boolean;
  label: string;
  icon?: ReactNode;
}) {
  const className =
    "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/90 transition hover:border-brand-accent/50 hover:text-brand-accent";

  if (live && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {icon}
        {label}
      </a>
    );
  }

  return (
    <span className={`${className} cursor-default opacity-55`} title="Coming soon">
      {icon}
      {label} · Soon
    </span>
  );
}
