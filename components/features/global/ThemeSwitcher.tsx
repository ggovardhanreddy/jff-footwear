"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme, type Theme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

interface ThemeSwitcherProps {
  className?: string;
  compact?: boolean;
}

export default function ThemeSwitcher({
  className,
  compact = false,
}: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    const next: Theme =
      theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        className={cn(
          "rounded-full p-2 text-brand-muted transition-colors hover:bg-black/5 hover:text-brand-black dark:hover:bg-white/10 dark:hover:text-white",
          className
        )}
        aria-label={`Theme: ${theme}. Click to change.`}
      >
        <Icon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div
      className={cn("flex rounded-full border border-black/10 p-1 dark:border-white/10", className)}
      role="group"
      aria-label="Theme switcher"
    >
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
            theme === value
              ? "bg-brand-black text-white dark:bg-white dark:text-brand-black"
              : "text-brand-muted hover:text-brand-black dark:hover:text-white"
          )}
          aria-pressed={theme === value}
        >
          <Icon className="h-3.5 w-3.5" aria-hidden />
          {label}
        </button>
      ))}
    </div>
  );
}
