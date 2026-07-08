export type Locale = "en" | "hi" | "te";

export const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
];

type TranslationKey =
  | "addToCart"
  | "wishlist"
  | "share"
  | "quickView"
  | "search"
  | "trending"
  | "newArrivals"
  | "bestSellers"
  | "featured"
  | "offline"
  | "reconnected"
  | "backToTop";

const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    addToCart: "Add to Cart",
    wishlist: "Wishlist",
    share: "Share",
    quickView: "Quick View",
    search: "Search products…",
    trending: "Trending Products",
    newArrivals: "New Arrivals",
    bestSellers: "Best Sellers",
    featured: "Featured Products",
    offline: "You are offline",
    reconnected: "Back online",
    backToTop: "Back to top",
  },
  hi: {
    addToCart: "कार्ट में जोड़ें",
    wishlist: "विशलिस्ट",
    share: "शेयर करें",
    quickView: "त्वरित देखें",
    search: "उत्पाद खोजें…",
    trending: "ट्रेंडिंग उत्पाद",
    newArrivals: "नए आगमन",
    bestSellers: "सर्वश्रेष्ठ विक्रेता",
    featured: "विशेष उत्पाद",
    offline: "आप ऑफ़लाइन हैं",
    reconnected: "वापस ऑनलाइन",
    backToTop: "ऊपर जाएं",
  },
  te: {
    addToCart: "కార్ట్‌కు జోడించండి",
    wishlist: "విష్‌లిస్ట్",
    share: "షేర్ చేయండి",
    quickView: "త్వరిత వీక్షణ",
    search: "ఉత్పత్తులు వెతకండి…",
    trending: "ట్రెండింగ్ ఉత్పత్తులు",
    newArrivals: "కొత్త వచ్చినవి",
    bestSellers: "బెస్ట్ సెల్లర్స్",
    featured: "ఫీచర్డ్ ఉత్పత్తులు",
    offline: "మీరు ఆఫ్‌లైన్‌లో ఉన్నారు",
    reconnected: "తిరిగి ఆన్‌లైన్",
    backToTop: "పైకి వెళ్ళండి",
  },
};

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] ?? translations.en[key];
}
