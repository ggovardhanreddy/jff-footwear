"use client";

import { WishlistProvider } from "@/context/WishlistContext";
import { RecentlyViewedProvider } from "@/context/RecentlyViewedContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { BrandAtmosphere } from "@/components/brand";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import { ToastProvider } from "@/context/ToastContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { CompareProvider } from "@/context/CompareContext";
import { SearchHistoryProvider } from "@/context/SearchHistoryContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { LocationProvider } from "@/context/LocationContext";
import { InstallProvider } from "@/context/InstallContext";
import { AppShell } from "@/components/features";
import MobileShopNav from "@/components/shop/MobileShopNav";
import InstallExperience from "@/components/pwa/InstallExperience";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <BrandAtmosphere />
      <ServiceWorkerRegister />
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <LocationProvider>
              <InstallProvider>
                <CartProvider>
                  <WishlistProvider>
                    <RecentlyViewedProvider>
                      <CompareProvider>
                        <SearchHistoryProvider>
                          {children}
                          <AppShell />
                          <MobileShopNav />
                          <InstallExperience />
                        </SearchHistoryProvider>
                      </CompareProvider>
                    </RecentlyViewedProvider>
                  </WishlistProvider>
                </CartProvider>
              </InstallProvider>
            </LocationProvider>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
