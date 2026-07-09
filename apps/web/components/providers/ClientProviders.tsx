"use client";

import {
  WishlistProvider,
} from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { BrandAtmosphere } from "@/components/brand";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import { ToastProvider } from "@/context/ToastContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CompareProvider } from "@/context/CompareContext";
import { SearchHistoryProvider } from "@/context/SearchHistoryContext";
import { CartProvider } from "@/context/CartContext";
import { AppShell } from "@/components/features";
import MobileShopNav from "@/components/shop/MobileShopNav";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <BrandAtmosphere />
      <ServiceWorkerRegister />
      <LanguageProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <RecentlyViewedProvider>
                <CompareProvider>
                  <SearchHistoryProvider>
                    {children}
                    <AppShell />
                    <MobileShopNav />
                  </SearchHistoryProvider>
                </CompareProvider>
              </RecentlyViewedProvider>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
