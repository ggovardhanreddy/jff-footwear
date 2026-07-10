"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import {
  getSupabaseBrowserClient,
  isSupabaseConfigured,
  type CoinLedgerRow,
  type NotificationRow,
  type Profile,
} from "@jff/api";

type AuthContextValue = {
  configured: boolean;
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  coinBalance: number;
  unreadNotifications: number;
  notifications: NotificationRow[];
  ledger: CoinLedgerRow[];
  signInWithEmail: (email: string) => Promise<{ error: string | null }>;
  signInWithPassword: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshCoins: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  updateDeliveryLocation: (location: string, pincode?: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const LOCAL_COINS_KEY = "jff-guest-coins";
const LOCAL_LOCATION_KEY = "jff-delivery-location";

function readGuestCoins(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(LOCAL_COINS_KEY);
  return raw ? Number(raw) || 0 : 0;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [coinBalance, setCoinBalance] = useState(0);
  const [ledger, setLedger] = useState<CoinLedgerRow[]>([]);
  const [notifications, setNotifications] = useState<NotificationRow[]>([]);

  const client = useMemo(() => getSupabaseBrowserClient(), []);

  const refreshCoins = useCallback(async () => {
    if (!client || !session?.user) {
      setCoinBalance(readGuestCoins());
      setLedger([]);
      return;
    }
    const { data } = await client
      .from("jff_coins_ledger")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    const rows = (data || []) as CoinLedgerRow[];
    setLedger(rows);
    setCoinBalance(rows[0]?.balance_after ?? 0);
  }, [client, session?.user]);

  const refreshNotifications = useCallback(async () => {
    if (!client || !session?.user) {
      setNotifications([]);
      return;
    }
    const { data } = await client
      .from("notifications")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(40);
    setNotifications((data || []) as NotificationRow[]);
  }, [client, session?.user]);

  const refreshProfile = useCallback(async () => {
    if (!client || !session?.user) {
      setProfile(null);
      return;
    }
    const { data } = await client
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();
    setProfile((data as Profile) || null);
  }, [client, session?.user]);

  useEffect(() => {
    if (!client) {
      setCoinBalance(readGuestCoins());
      setLoading(false);
      return;
    }

    let mounted = true;
    client.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = client.auth.onAuthStateChange((_event, next) => {
      setSession(next);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [client]);

  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      setCoinBalance(readGuestCoins());
      setLedger([]);
      setNotifications([]);
      return;
    }
    void refreshProfile();
    void refreshCoins();
    void refreshNotifications();
  }, [session?.user, refreshProfile, refreshCoins, refreshNotifications]);

  const signInWithEmail = useCallback(
    async (email: string) => {
      if (!client) return { error: "Sign-in is temporarily unavailable." };
      const { error } = await client.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}${sessionStorage.getItem("jff-auth-next") || "/account/"}`
              : undefined,
        },
      });
      return { error: error?.message ?? null };
    },
    [client]
  );

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!client) return { error: "Sign-in is temporarily unavailable." };
      const { error } = await client.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [client]
  );

  const signUp = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (!client) return { error: "Sign-in is temporarily unavailable." };
      const { error } = await client.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      return { error: error?.message ?? null };
    },
    [client]
  );

  const signOut = useCallback(async () => {
    if (!client) return;
    await client.auth.signOut();
  }, [client]);

  const markNotificationRead = useCallback(
    async (id: string) => {
      if (!client || !session?.user) return;
      await client.from("notifications").update({ read: true }).eq("id", id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    },
    [client, session?.user]
  );

  const updateDeliveryLocation = useCallback(
    async (location: string, pincode?: string) => {
      localStorage.setItem(
        LOCAL_LOCATION_KEY,
        JSON.stringify({ location, pincode: pincode || "" })
      );
      if (!client || !session?.user) return;
      await client
        .from("profiles")
        .update({
          delivery_location: location,
          delivery_pincode: pincode || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.user.id);
      await refreshProfile();
    },
    [client, session?.user, refreshProfile]
  );

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const value: AuthContextValue = {
    configured,
    loading,
    session,
    user: session?.user ?? null,
    profile,
    coinBalance,
    unreadNotifications,
    notifications,
    ledger,
    signInWithEmail,
    signInWithPassword,
    signUp,
    signOut,
    refreshProfile,
    refreshCoins,
    refreshNotifications,
    markNotificationRead,
    updateDeliveryLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function readStoredLocation(): { location: string; pincode: string } {
  if (typeof window === "undefined") {
    return { location: "Rayachoty, AP", pincode: "516269" };
  }
  try {
    const raw = localStorage.getItem(LOCAL_LOCATION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { location: "Rayachoty, AP", pincode: "516269" };
}
