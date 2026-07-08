"use client";

import { LOCALES } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLanguage();

  return (
    <select
      value={locale}
      onChange={(e) => setLocale(e.target.value as typeof locale)}
      className={cn(
        "rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-xs font-semibold",
        "dark:border-white/10 dark:bg-brand-dark dark:text-white",
        className
      )}
      aria-label="Select language"
    >
      {LOCALES.map((l) => (
        <option key={l.code} value={l.code}>
          {l.native}
        </option>
      ))}
    </select>
  );
}
