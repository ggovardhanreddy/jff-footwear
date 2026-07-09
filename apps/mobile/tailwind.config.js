/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0a0a0a",
          dark: "#121212",
          charcoal: "#121212",
          gray: "#1a1a1a",
          muted: "#6b6b6b",
          light: "#f4f4f5",
          cream: "#ffffff",
          white: "#ffffff",
          accent: "#c8a96e",
          "accent-dark": "#a68b4b",
          blue: "#2563eb",
          "blue-dark": "#60a5fa",
        },
      },
    },
  },
  plugins: [],
};
