"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Gift, Percent, Truck } from "lucide-react";

type Offer = {
  id: string;
  title: string;
  description: string;
  icon: typeof Percent;
  /** Hours from first client mount */
  hoursLeft: number;
};

const OFFERS: Offer[] = [
  {
    id: "20off",
    title: "20% OFF",
    description: "On your first JFF order with code WELCOME10",
    icon: Percent,
    hoursLeft: 18,
  },
  {
    id: "b2g1",
    title: "Buy 2 Get 1",
    description: "Mix & match selected daily-wear slides",
    icon: Gift,
    hoursLeft: 36,
  },
  {
    id: "ship",
    title: "Free Shipping",
    description: "On orders ₹499 and above across India",
    icon: Truck,
    hoursLeft: 72,
  },
  {
    id: "coins",
    title: "Coin Cashback",
    description: "Earn 5% back as JFF Coins on every purchase",
    icon: Coins,
    hoursLeft: 96,
  },
];

function useCountdown(hoursLeft: number) {
  const [endsAt, setEndsAt] = useState<number | null>(null);
  const [left, setLeft] = useState(0);

  useEffect(() => {
    const end = Date.now() + hoursLeft * 3_600_000;
    setEndsAt(end);
    setLeft(Math.max(0, end - Date.now()));
    const id = window.setInterval(() => {
      setLeft(Math.max(0, end - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, [hoursLeft]);

  if (endsAt == null) return "--:--:--";

  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  const s = Math.floor((left % 60_000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function OfferCard({ offer }: { offer: Offer }) {
  const countdown = useCountdown(offer.hoursLeft);
  const Icon = offer.icon;
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="min-w-[240px] flex-1 rounded-[1.5rem] border border-white/50 bg-white/70 p-5 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.2)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/15 text-brand-accent">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-xl font-semibold text-brand-black dark:text-white">
        {offer.title}
      </h3>
      <p className="mt-1.5 text-sm text-brand-muted">{offer.description}</p>
      <p
        className="mt-4 font-mono text-xs tracking-wider text-brand-accent"
        suppressHydrationWarning
      >
        Ends in {countdown}
      </p>
    </motion.article>
  );
}

export default function DiscountsForYou() {
  const offers = useMemo(() => OFFERS, []);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-brand-black dark:text-white md:text-3xl">
          Discounts For You
        </h2>
        <p className="mt-1.5 text-sm text-brand-muted">
          Personalized JFF offers with live countdown timers.
        </p>
      </div>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
