import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import ScreenShell from "@/components/ScreenShell";
import { useAuth } from "@/lib/AuthProvider";

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp, configured } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async () => {
    setBusy(true);
    setError(null);
    if (!configured) {
      setError("Add EXPO_PUBLIC_SUPABASE_URL and ANON_KEY to continue.");
      setBusy(false);
      return;
    }
    const err =
      mode === "signin"
        ? await signIn(email.trim(), password)
        : await signUp(email.trim(), password, fullName.trim());
    setBusy(false);
    if (err) setError(err);
    else router.replace("/(tabs)/more");
  };

  return (
    <ScreenShell>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 px-5 py-8"
      >
        <Text className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-accent">
          JFF Account
        </Text>
        <Text className="mt-2 font-display text-3xl font-semibold text-brand-black dark:text-white">
          {mode === "signin" ? "Welcome back" : "Create account"}
        </Text>
        <Text className="mt-2 text-sm text-brand-muted">
          Sign in to track orders and earn JFF Coins.
        </Text>

        <View className="mt-6 flex-row rounded-full bg-black/5 p-1 dark:bg-white/10">
          {(["signin", "signup"] as const).map((m) => (
            <Pressable
              key={m}
              onPress={() => setMode(m)}
              className={`flex-1 rounded-full py-2 ${
                mode === m ? "bg-brand-black dark:bg-white" : ""
              }`}
            >
              <Text
                className={`text-center text-xs font-semibold ${
                  mode === m ? "text-white dark:text-brand-black" : "text-brand-muted"
                }`}
              >
                {m === "signin" ? "Sign in" : "Sign up"}
              </Text>
            </Pressable>
          ))}
        </View>

        {mode === "signup" && (
          <TextInput
            className="mt-4 rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/15 dark:bg-white/5 dark:text-white"
            placeholder="Full name"
            value={fullName}
            onChangeText={setFullName}
            placeholderTextColor="#6b6b6b"
          />
        )}
        <TextInput
          className="mt-3 rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/15 dark:bg-white/5 dark:text-white"
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#6b6b6b"
        />
        <TextInput
          className="mt-3 rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/15 dark:bg-white/5 dark:text-white"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#6b6b6b"
        />

        {error ? <Text className="mt-3 text-sm text-red-600">{error}</Text> : null}

        <Pressable
          onPress={() => void onSubmit()}
          disabled={busy}
          className="mt-6 items-center rounded-full bg-brand-accent py-3.5"
        >
          {busy ? (
            <ActivityIndicator color="#0a0a0a" />
          ) : (
            <Text className="text-sm font-semibold text-brand-black">
              {mode === "signin" ? "Sign in" : "Create account"}
            </Text>
          )}
        </Pressable>
      </KeyboardAvoidingView>
    </ScreenShell>
  );
}
