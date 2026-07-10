"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

interface OfferCountdownProps {
  endTime: number;
  className?: string;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function OfferCountdown({ endTime, className }: OfferCountdownProps) {
  const reduced = useReducedMotion();
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(Math.max(0, endTime - Date.now()));
    if (reduced) return;
    const id = window.setInterval(() => {
      setRemaining(Math.max(0, endTime - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [endTime, reduced]);

  const safe = remaining ?? 0;
  const totalSec = Math.floor(safe / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const ready = remaining != null;

  return (
    <div
      className={className}
      role="timer"
      aria-live="polite"
      aria-label={
        ready ? `Offer ends in ${h} hours ${m} minutes ${s} seconds` : "Offer countdown loading"
      }
      suppressHydrationWarning
    >
      <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-white/60 sm:text-right">
        Ends in
      </p>
      <div className="flex gap-2">
        {[
          { v: ready ? h : 0, l: "Hrs" },
          { v: ready ? m : 0, l: "Min" },
          { v: ready ? s : 0, l: "Sec" },
        ].map(({ v, l }) => (
          <div
            key={l}
            className="flex min-w-[3.5rem] flex-col items-center rounded-2xl bg-white/10 px-3 py-2 backdrop-blur-sm"
          >
            <span className="font-display text-2xl font-bold tabular-nums" suppressHydrationWarning>
              {ready ? pad(v) : "--"}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wider text-white/50">
              {l}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
