"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/lib/constants";
import { getLoginNextFromSearch } from "@/lib/auth-redirect";
import { isSupabaseConfigured } from "@jff/api";

export default function LoginPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithEmail, signInWithPassword, signUp, user, loading } = useAuth();
  const [mode, setMode] = useState<"magic" | "password" | "signup">("magic");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const configured = isSupabaseConfigured();

  const nextPath = useMemo(() => getLoginNextFromSearch(searchParams), [searchParams]);

  const isCheckoutFlow = nextPath.startsWith(ROUTES.cart) || nextPath.startsWith(ROUTES.checkout);

  useEffect(() => {
    if (!loading && user) router.replace(nextPath);
  }, [loading, user, router, nextPath]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);

    if (!configured) {
      setError("Sign-in is temporarily unavailable. Please try again later.");
      setBusy(false);
      return;
    }

    if (mode === "magic") {
      const res = await signInWithEmail(email);
      if (res.error) setError(res.error);
      else setMessage("Check your email for a magic link to sign in.");
    } else if (mode === "password") {
      const res = await signInWithPassword(email, password);
      if (res.error) setError(res.error);
      else router.push(nextPath);
    } else {
      const res = await signUp(email, password, fullName);
      if (res.error) setError(res.error);
      else
        setMessage(
          "Account created. Check your email to confirm, then sign in. You get 50 welcome JFF Coins."
        );
    }
    setBusy(false);
  };

  return (
    <div className="page-shell">
      <div className="container-custom flex min-h-[70vh] items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-[2rem] border border-white/50 bg-white/80 p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
            JFF Account
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-brand-black dark:text-white">
            {isCheckoutFlow ? "Sign in to continue" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            {isCheckoutFlow
              ? "Your items are saved in the cart. Sign in to checkout, earn JFF Coins, and track orders."
              : "Sign in to track orders, save your wishlist, and earn JFF Coins on every purchase."}
          </p>

          <div className="mt-6 flex gap-2 rounded-full bg-black/[0.04] p-1 dark:bg-white/5">
            {(
              [
                ["magic", "Magic link"],
                ["password", "Password"],
                ["signup", "Sign up"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setMode(id)}
                className={`flex-1 rounded-full px-3 py-2 text-xs font-semibold transition ${
                  mode === id
                    ? "bg-brand-black text-white dark:bg-white dark:text-brand-black"
                    : "text-brand-muted"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => void onSubmit(e)} className="mt-6 space-y-4">
            {mode === "signup" && (
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full name"
                className="input-field w-full"
              />
            )}
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field w-full"
            />
            {mode !== "magic" && (
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-field w-full"
              />
            )}
            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            {message && <p className="text-sm text-emerald-700 dark:text-emerald-400">{message}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-brand-accent py-3.5 text-sm font-semibold text-brand-black shadow-[0_0_28px_rgba(200,169,110,0.35)] disabled:opacity-60"
            >
              {busy
                ? "Please wait…"
                : mode === "signup"
                  ? "Create account"
                  : mode === "magic"
                    ? "Email me a link"
                    : "Sign in"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-brand-muted">
            <Link href={ROUTES.home} className="underline">
              Continue browsing
            </Link>
            {isCheckoutFlow ? " — your cart stays saved on this device." : " without an account."}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
