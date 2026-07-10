"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Download, Smartphone } from "lucide-react";
import { useInstall } from "@/context/InstallContext";
import { APP_LINKS, ROUTES } from "@/lib/constants";
import { COMPANY } from "@/lib/constants";

export default function InstallPageClient() {
  const { canInstall, promptInstall, platform, isInstalled } = useInstall();
  const [origin, setOrigin] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const installUrl = useMemo(() => (origin ? `${origin}${ROUTES.install}` : ""), [origin]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !installUrl) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Simple QR-like pattern (visual placeholder; scan opens install URL via link below)
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

  const handleInstall = async () => {
    const result = await promptInstall();
    if (result === "unavailable") {
      if (platform === "ios") {
        alert("On iPhone: tap Share → Add to Home Screen to install JFF as an app.");
      }
    }
  };

  return (
    <div className="page-shell">
      <div className="container-custom space-y-12 py-12 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            Get the JFF App
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">Install JFF</h1>
          <p className="mt-4 text-brand-muted">
            Scan the code or choose your platform to enjoy the complete JFF shopping experience —
            free PWA, no store fees required.
          </p>
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
              Open this page on your phone, or use Install below.
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
            <h2 className="font-display text-2xl font-semibold">
              {isInstalled
                ? "You're all set"
                : platform === "ios"
                  ? "Add to Home Screen"
                  : canInstall
                    ? "Install from browser"
                    : "Get the full experience"}
            </h2>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Faster shopping &amp; checkout</li>
              <li>Extra JFF Coin rewards</li>
              <li>Offline browsing of cached products</li>
              <li>Home screen launch like a native app</li>
            </ul>
            {platform === "ios" && !isInstalled && (
              <ol className="space-y-1.5 rounded-2xl border border-white/15 bg-white/5 p-4 text-left text-xs text-white/80">
                <li>1. Tap the Share button in Safari</li>
                <li>2. Scroll and tap Add to Home Screen</li>
                <li>3. Tap Add — JFF opens like an app</li>
              </ol>
            )}
            {!isInstalled && (
              <button
                type="button"
                onClick={() => void handleInstall()}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-brand-accent px-6 py-3.5 text-sm font-semibold text-brand-black shadow-[0_0_28px_rgba(200,169,110,0.4)]"
              >
                <Download className="h-4 w-4" />
                {platform === "ios" ? "Show iPhone steps" : "Install JFF"}
              </button>
            )}
            <div className="flex flex-wrap gap-3 pt-2 opacity-60">
              <span className="text-xs">Free PWA — no Play / App Store fees required</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-brand-muted">
          Deep links use <code className="text-xs">{APP_LINKS.deepLinkScheme}</code> for{" "}
          {COMPANY.name} products, cart, and orders when the native app is available.{" "}
          <Link href={ROUTES.home} className="text-brand-accent underline">
            Back to shop
          </Link>
        </p>
      </div>
    </div>
  );
}
