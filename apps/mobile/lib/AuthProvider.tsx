import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import type { Profile } from "@jff/api";
import { getMobileSupabase, isMobileSupabaseConfigured } from "@/lib/supabase";

type AuthValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  coinBalance: number;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string, fullName: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isMobileSupabaseConfigured();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [coinBalance, setCoinBalance] = useState(0);
  const client = useMemo(() => getMobileSupabase(), []);

  const refreshProfile = useCallback(async () => {
    if (!client || !session?.user) {
      setProfile(null);
      setCoinBalance(0);
      return;
    }
    const { data: p } = await client
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();
    setProfile((p as Profile) || null);
    const { data: ledger } = await client
      .from("jff_coins_ledger")
      .select("balance_after")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setCoinBalance(ledger?.balance_after ?? 0);
  }, [client, session?.user]);

  useEffect(() => {
    if (!client) {
      setLoading(false);
      return;
    }
    client.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = client.auth.onAuthStateChange((_e, next) => {
      setSession(next);
    });
    return () => sub.subscription.unsubscribe();
  }, [client]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      if (!client) return "Sign-in is temporarily unavailable.";
      const { error } = await client.auth.signInWithPassword({ email, password });
      return error?.message ?? null;
    },
    [client]
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!client) return "Sign-in is temporarily unavailable.";
      const { error } = await client.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      return error?.message ?? null;
    },
    [client]
  );

  const signOut = useCallback(async () => {
    if (!client) return;
    await client.auth.signOut();
  }, [client]);

  const value: AuthValue = {
    configured,
    loading,
    session,
    user: session?.user ?? null,
    profile,
    coinBalance,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
