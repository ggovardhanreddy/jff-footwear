import type { Config } from "tailwindcss";
import { tailwindBrand } from "@jff/ui/brand";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          ...tailwindBrand,
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "logo-in": "logoIn 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        logoIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        luxury: "28px",
      },
      letterSpacing: {
        luxury: "0.24em",
        wide: "0.18em",
      },
      transitionDuration: {
        luxury: "500ms",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        premium: "var(--shadow-premium)",
        glass: "var(--shadow-glass)",
      },
      backgroundColor: {
        surface: "var(--color-surface)",
        "surface-elevated": "var(--color-surface-elevated)",
      },
    },
  },
  plugins: [],
};

export default config;
