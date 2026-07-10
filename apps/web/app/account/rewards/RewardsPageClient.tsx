"use client";

import Link from "next/link";
import { Coins, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import { formatCoins, getCoinLevel, JFF_COINS } from "@jff/api/coins";
import CountUp from "@/components/motion/CountUp";
import { FlipText } from "@/components/premium";

export default function RewardsPageClient() {
  const { user, coinBalance, ledger, loading } = useAuth();
  const level = getCoinLevel(coinBalance);
  const nextLevel = JFF_COINS.levels.find((l) => l.minCoins > coinBalance);

  if (loading) {
    return (
      <div className="page-shell container-custom py-16">
        <div className="h-48 animate-pulse rounded-[2rem] bg-black/5" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-shell container-custom max-w-lg py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">JFF Coins</h1>
        <p className="mt-3 text-brand-muted">
          Sign in to earn and redeem reward coins on every purchase.
        </p>
        <Link
          href={ROUTES.login}
          className="mt-6 inline-flex rounded-full bg-brand-accent px-6 py-3 text-sm font-semibold text-brand-black"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container-custom space-y-8 py-10 md:py-14">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1a1612] via-brand-black to-[#3d3428] p-8 text-white md:p-10"
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-accent/20 blur-3xl" />
          <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            <Sparkles className="h-3.5 w-3.5" />
            <FlipText text={`${level.name} Level`} as="span" stagger={0.04} />
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
            <CountUp value={coinBalance} duration={1400} />
          </h1>
          <p className="mt-1 text-white/60">JFF Coins balance</p>
          {nextLevel && (
            <p className="mt-4 text-sm text-white/70">
              {formatCoins(nextLevel.minCoins - coinBalance)} more to {nextLevel.name}
            </p>
          )}
          <p className="mt-2 text-xs text-white/50">
            10 coins = ₹1 · Min redeem {JFF_COINS.minRedeem} · Earn {JFF_COINS.earnPerRupee * 100}%
            back
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-4">
          {JFF_COINS.levels.map((l) => (
            <div
              key={l.id}
              className={`rounded-2xl border p-4 ${
                level.id === l.id
                  ? "border-brand-accent bg-brand-accent/10"
                  : "border-black/[0.06] dark:border-white/10"
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                {l.name}
              </p>
              <p className="mt-1 text-sm font-medium">{formatCoins(l.minCoins)}+</p>
            </div>
          ))}
        </div>

        <section>
          <h2 className="font-display text-2xl font-semibold">History</h2>
          <ul className="mt-4 space-y-2">
            {ledger.length === 0 && (
              <li className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-brand-muted dark:border-white/15">
                No coin activity yet. Place an order to earn rewards.
              </li>
            )}
            {ledger.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between rounded-2xl border border-black/[0.06] bg-white/70 px-4 py-3 dark:border-white/10 dark:bg-white/5"
              >
                <div>
                  <p className="font-medium capitalize">{row.reason.replace(/_/g, " ")}</p>
                  <p className="text-xs text-brand-muted">
                    {new Date(row.created_at).toLocaleString("en-IN")}
                  </p>
                </div>
                <p
                  className={`flex items-center gap-1 font-semibold ${
                    row.delta >= 0 ? "text-emerald-600" : "text-red-500"
                  }`}
                >
                  <Coins className="h-4 w-4" />
                  {row.delta >= 0 ? "+" : ""}
                  {formatCoins(row.delta)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
